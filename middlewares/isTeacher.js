// const isTeacher = async (req, res, next) => {
//   try {
//     const userId = req.user?._id;
//     console.log("Checking teacher access for user ID:", userId);

//     const teacherFound = await Teacher.findById(userId);
//     console.log("Teacher found:", teacherFound);

//     if (!teacherFound || teacherFound.role.toLowerCase() !== "teacher") {
//       console.log("Access denied. Role:", teacherFound?.role);
//       return res.status(403).json({
//         status: "failed",
//         message: "Access denied. Teachers only.",
//       });
//     }

//     next(); // ✅ Passed the check
//   } catch (error) {
//     next(error);
//   }
// };

//const Teacher = require("../model/Academic/Staff/13 - Teacher");
const asyncHandler = require("express-async-handler");
const Teacher = require("../model/Academic/Staff/TeacherModel"); // double-check this path is correct

const isTeacher = asyncHandler(async (req, res, next) => {
  console.log("req.user in isTeacher:", req.user);

  const teacherFound = await Teacher.findById(req.userAuth._id);
  console.log("teacherFound:", teacherFound);

  if (!teacherFound || teacherFound.role.toLowerCase() !== "teacher") {
    return res.status(403).json({
      message: "Access denied, teacher only",
    });
  }

  req.teacher = teacherFound; // ✅ Attach teacher to req
  next();
});

module.exports = isTeacher;
