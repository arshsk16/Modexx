const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const client = require("prom-client");

const User = require("./models/user");
const Hospital = require("./models/hospital");

const { corsConfig } = require("./utils");

// ROUTES
const authRouter = require("./routes/auth/auth");
const profileRouter = require("./routes/user/profile");
const hospitalRouter = require("./routes/hospital/hospital");
const appointmentRouter = require("./routes/appointments/appointment");
const otherroutes = require("./routes/otherroutes/otherroutes");

const app = express();

// --------------------
// 🔥 BASIC MIDDLEWARES
// --------------------
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());

// Enable CORS
corsConfig(app);

// --------------------------
// 🔥 SESSION (For Passport)
// --------------------------
if (!process.env.SESSION_SECRET) {
  console.error("Error: SESSION_SECRET environment variable is required");
  process.exit(1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// --------------------------
// 🔥 PASSPORT SETUP
// --------------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// ------------------------------
// 🔥 GOOGLE AUTH ENDPOINTS
// ------------------------------
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      const { id, displayName, emails } = req.user;

      // Validate emails array exists and has elements
      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ message: "Email not provided by Google" });
      }

      const email = emails[0].value;
      const clientUrl =
        process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:3000";

      let userOrHospital =
        (await User.findOne({ email })) || (await Hospital.findOne({ email }));

      let token;

      if (!userOrHospital) {
        const { user, token: newToken } =
          await require("./controllers/auth/authController").createUserFromGoogleSignIn({
            id,
            displayName,
            emails,
          });

        token = newToken;
      } else {
        const payload = { user: { id: userOrHospital.id } };
        token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3d" });
      }

      // send token back to client app (React)
      res.send(`
        <script>
          window.opener.postMessage({ token: '${token}' }, '${clientUrl}');
          window.close();
        </script>
      `);
    } catch (error) {
      console.error("Google sign-in error:", error);
      res.status(500).json({ message: "Error signing in with Google", error });
    }
  }
);

// ------------------------
// 🔐 JWT Middleware (unused outside auth router)
// ------------------------
const authenticateToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid", err });
  }
};

// --------------
// LOGOUT
// --------------
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("https://med-space.vercel.app/");
  });
});

// Protected Route Sample
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ msg: "Protected route", user: req.user });
});

// HEALTH CHECK
app.get("/ping", (_, res) => res.json({ message: "pong" }));

// Add this /api/health endpoint for uptime + DB state (useful for Render / monitoring)
const mongoose = require("mongoose"); // if not already required at top

app.get("/api/health", (req, res) => {
  const dbState = mongoose?.connection?.readyState ?? null; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({
    ok: true,
    env: process.env.NODE_ENV || "development",
    uptime_seconds: process.uptime(),
    dbState,
    timestamp: new Date().toISOString(),
  });
});


// METRICS FOR PROMETHEUS
client.collectDefaultMetrics();
app.get("/metrics", async (_, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});

// -----------------
// MAIN ROUTES
// -----------------
app.use("/auth", authRouter);
app.use("/auth", profileRouter);

app.use("/hospitalapi", hospitalRouter);
app.use("/hospitalapi", appointmentRouter);

app.use("/otherroutes", otherroutes);

module.exports = app;

