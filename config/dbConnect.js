const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.log("❌ DB connection failed:", error.message);
  }
};

module.exports = dbConnect;
