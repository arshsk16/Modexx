// index.js
require("dotenv").config();

const connectDB = require("./config/db");
const app = require("./app");

// --------------------
// 🔥 CONNECT DATABASE
// --------------------
connectDB();

// -----------------
// START SERVER
// -----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
