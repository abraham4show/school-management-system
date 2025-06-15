const express = require("express");
const {
  adminRegisterStudent,
  loginStudent,
  getAllStudentsByAdmin,
  getSingleStudent,
  getStudentProfile,
  studentUpdateProfile,
  adminUpdateStudent,
  writeExam,
} = require("../../controller/student/studentCtrl");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
//const isStudent = require("../../middlewares/isStudent");
//const isStudentLogin = require("../../middlewares/isStudentLogin");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Student = require("../../model/Academic/StudentModel");
const roleRestriction = require("../../controller/academics/roleRestriction");

const studentRouter = express.Router();

// ✅ Admin registers a student
studentRouter.post("/admin/register", isLogin, isAdmin, adminRegisterStudent);

// ✅ Student login
studentRouter.post("/login", loginStudent);

// ✅ Student views their own profile
//console.log("Middlewares:", isStudentLogin, isStudent);
studentRouter.get(
  "/profile",
  isAuthenticated(Student),
  roleRestriction("student"),
  getStudentProfile
);

// ✅ Future routes:
studentRouter.get("/admin", isLogin, isAdmin, getAllStudentsByAdmin); // All students (admin only)

///
studentRouter.put(
  "/profile/update",
  isAuthenticated(Student),
  roleRestriction("student"),
  studentUpdateProfile
);
//
studentRouter.post(
  "/exam/:examId/write",
  isAuthenticated(Student),
  roleRestriction("student"),
  writeExam
);

// ✅ Admin updates a student's details by ID
studentRouter.put(
  "/admin/:studentId/update",
  isAuthenticated("Student"),
  roleRestriction("admin"),
  adminUpdateStudent
);

// ✅ Admin (or any logged-in user) gets single student by ID
studentRouter.get("/:id", isAuthenticated("Student"), getSingleStudent);

// studentRouter.put("/:id", isLogin, isAdmin, updateStudent);
// studentRouter.delete("/:id", isLogin, isAdmin, deleteStudent);

module.exports = studentRouter;
