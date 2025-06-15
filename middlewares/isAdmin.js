// const Admin = require("../model/Academic/Staff/Admin");

// const isAdmin = async (req, res, next) => {
//   try {
//     const userId = req.userAuth?._id;

//     const adminFound = await Admin.findById(userId);

//     if (!adminFound || adminFound.role !== "Admin") {
//       return res.status(403).json({
//         status: "failed",
//         message: "Access denied. Admins only.",
//       });
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = isAdmin;

const Admin = require("../model/Academic/Staff/Admin");

const isAdmin = async (req, res, next) => {
  try {
    //console.log("🔍 Checking admin auth:", req.userAuth);

    const userId = req.userAuth?._id;

    const adminFound = await Admin.findById(userId);
    //console.log("👤 Admin found in DB:", adminFound);

    if (!adminFound || adminFound.role.toLowerCase() !== "admin") {
      //console.log("❌ Not an admin or no user found");
      return res.status(403).json({
        status: "failed",
        message: "Access denied. Admins only.",
      });
    }

    //console.log("✅ Access granted to admin");
    next();
  } catch (error) {
    console.error("🔥 Error in isAdmin:", error);
    next(error);
  }
};

module.exports = isAdmin;
