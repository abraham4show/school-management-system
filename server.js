require("dotenv").config();
const app = require("./app/app");
const dbConnect = require("./config/dbConnect");

// Connect to database
dbConnect();

// Start server
const PORT = process.env.PORT || 2020;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
