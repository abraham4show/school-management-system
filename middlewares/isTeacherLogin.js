const Teacher = require("../model/Academic/Staff/TeacherModel");
const verifyToken = require("../utils/verifyToken");

const isTeacherLogin = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return res.status(401).json({ message: "Token expired or invalid" });
    }

    const teacher = await Teacher.findById(verifiedToken.id).select(
      "name user email role _id"
    );

    if (!teacher) {
      return res.status(401).json({ message: "teacher not found" });
    }

    req.userAuth = teacher; // ✅ Correct assignment
    console.log("req.user set by isTeacherLogin:", req.userAuth);

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = isTeacherLogin;
