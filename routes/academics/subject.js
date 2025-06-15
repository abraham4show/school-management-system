const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} = require("../../controller/academics/subjectCtrl");

const subjectRouter = express.Router();

subjectRouter.post("/:programId", isLogin, isAdmin, createSubject);
subjectRouter.get("/", isLogin, isAdmin, getSubjects);
subjectRouter.get("/:id", isLogin, isAdmin, getSubject);
subjectRouter.put("/:id", isLogin, isAdmin, updateSubject);
subjectRouter.delete("/:id", isLogin, isAdmin, deleteSubject);

module.exports = subjectRouter;
