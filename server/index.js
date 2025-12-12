// server/index.js
require('dotenv').config();

const connectDB = require('./config/db'); 
const app = require('./app');



// -----------------
// START SERVER FAST
// -----------------
const PORT = process.env.PORT || 5000;


const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// --------------------
// CONNECT DATABASE 
// --------------------
const maxAttempts = 12;      // total attempts
const retryDelayMs = 30000;  // 30 seconds between tries

async function tryConnect(attempt = 1) {
  try {
    console.log(`DB connection attempt ${attempt}...`);
    await connectDB(); // your existing function which likely returns a promise
    console.log('✅ Database connected');
  } catch (err) {
    console.error(`DB connect failed on attempt ${attempt}:`, err.message || err);
    if (attempt < maxAttempts) {
      console.log(`Retrying DB connect in ${retryDelayMs / 1000}s...`);
      setTimeout(() => tryConnect(attempt + 1), retryDelayMs);
    } else {
      console.error('DB failed to connect after multiple attempts. Leaving server running for debugging.');
     
    }
  }
}

// Start the first attempt but do NOT block the server from listening
tryConnect();
