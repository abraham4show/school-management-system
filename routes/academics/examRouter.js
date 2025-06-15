const express = require("express");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const {
  createExams,
  getExams,
  getExam,
  updateExam,
} = require("../../controller/academics/examsCtrl");
const examRouter = express.Router();

examRouter
  .route("/")
  .get(getExams) // 🟢 No middleware
  .post(isTeacherLogin, isTeacher, createExams);

examRouter.route("/:id", isTeacherLogin, isTeacher).get(getExam);
examRouter.route("/:id", isTeacherLogin, isTeacher).put(updateExam);

module.exports = examRouter;
