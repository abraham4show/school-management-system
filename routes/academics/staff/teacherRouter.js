const express = require("express");
const {
  adminRegisterTeacher,
  loginTeacher,
  getAllTeachersAdmin,
  getTeacherByAdmin,
  getTeacherProfile,
  teacherUpdateProfile,
  adminUpdateProfile,
} = require("../../../controller/staff/teachersCtrl");

const isLogin = require("../../../middlewares/isLogin");
const isAdmin = require("../../../middlewares/isAdmin");
const isTeacherLogin = require("../../../middlewares/isTeacherLogin");
const isTeacher = require("../../../middlewares/isTeacher"); // fix here
const advanceResults = require("../../../middlewares/advanceResult");
const Teacher = require("../../../model/Academic/Staff/TeacherModel");
const isAuthenticated = require("../../../middlewares/isAuthenticated");
const roleRestriction = require("../../../controller/academics/roleRestriction");
const Admin = require("../../../model/Academic/Staff/Admin");

const teacherRouter = express.Router();

teacherRouter.post("/admin/register", isLogin, isAdmin, adminRegisterTeacher);
teacherRouter.post("/login", loginTeacher);

// /admin route with advanceResults and getAllTeachersAdmin
teacherRouter.get(
  "/admin",
  isAuthenticated("admin"),
  roleRestriction(Admin),
  advanceResults(Teacher, {
    path: "examsCreated",
    populate: {
      path: "questions",
      model: "Question",
    },
  }),
  getAllTeachersAdmin
);

// Simple test route just to manually verify the populate works
teacherRouter.get("/test", async (req, res) => {
  const teacher = await Teacher.findById("684af4206ea8516c1a2735a8").populate({
    path: "examsCreated",
    populate: {
      path: "questions",
      model: "Question",
    },
  });

  res.json(teacher);
});

teacherRouter.get("/profile", isTeacherLogin, isTeacher, getTeacherProfile);
teacherRouter.put(
  "/:teacherId/update",
  isAuthenticated("teacher"),
  roleRestriction(Teacher),
  teacherUpdateProfile
);
teacherRouter.put(
  "/:teacherId/update/admin",
  isAuthenticated("admin"),
  roleRestriction(Admin),
  adminUpdateProfile
);
teacherRouter.get("/:teacherId/admin", isLogin, isAdmin, getTeacherByAdmin);

module.exports = teacherRouter;
