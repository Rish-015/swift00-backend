// server.js ✅ Correct version
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config(); // 👈 THIS should come BEFORE accessing process.env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
