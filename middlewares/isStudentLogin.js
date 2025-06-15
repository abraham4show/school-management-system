const Student = require("../model/Academic/StudentModel");
const verifyToken = require("../utils/verifyToken");

const isStudentLogin = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const verified = verifyToken(token);
    if (!verified) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const student = await Student.findById(verified.id).select(
      "name email role"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    req.userAuth = student;
    console.log("Authenticated student:", student);

    next();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = isStudentLogin;
