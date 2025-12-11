const jwt = require("jsonwebtoken");

// Validate JWT_SECRET at module load time
if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET environment variable is required");
  process.exit(1);
}

const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = { authenticateToken };
