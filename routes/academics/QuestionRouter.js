const express = require("express");
const questionRouter = express.Router();
const {
  createQuestion,
  getQuestions,
  getQuestion, // ✅ import the new controller
  updateQuestion,
} = require("../../controller/academics/questionCtrl");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");

// Get all questions
questionRouter.get("/", isTeacherLogin, isTeacher, getQuestions);

// Create a new question
questionRouter.post("/:examId", isTeacherLogin, isTeacher, createQuestion);

// ✅ Get a single question by ID
questionRouter.get("/:id", isTeacherLogin, isTeacher, getQuestion);

// Update a question
questionRouter.put("/:id", isTeacherLogin, isTeacher, updateQuestion);

module.exports = questionRouter;
