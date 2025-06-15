// const Admin = require("../model/Academic/Staff/Admin");
// const verifyToken = require("../utils/verifyToken");

// const isLogin = async (req, res, next) => {
//   try {
//     const token = req.headers?.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const verifiedToken = verifyToken(token);

//     if (verifiedToken) {
//       const user = await Admin.findById(verifiedToken.id).select(
//         "name email role"
//       );

//       if (!user) {
//         return res.status(401).json({ message: "User not found" });
//       }

//       req.userAuth = user; // ✅ fixed key

//       next();
//     } else {
//       return res.status(401).json({ message: "Token expired or invalid" });
//     }
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = isLogin;

const Admin = require("../model/Academic/Staff/Admin");
const verifyToken = require("../utils/verifyToken");

const isLogin = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    console.log("🔑 Token from header:", token);

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const verifiedToken = verifyToken(token);
    console.log("✅ Decoded token:", verifiedToken);

    if (verifiedToken) {
      const user = await Admin.findById(verifiedToken.id).select(
        "name user email role"
      );
      console.log("👤 Found user:", user);

      if (!user) {
        console.log("❌ User not found in DB");
        return res.status(401).json({ message: "User not found" });
      }

      req.userAuth = user; // ✅ IMPORTANT
      next();
    } else {
      console.log("❌ Invalid or expired token");
      return res.status(401).json({ message: "Token expired or invalid" });
    }
  } catch (err) {
    console.error("🔥 Error in isLogin:", err);
    next(err);
  }
};

module.exports = isLogin;
