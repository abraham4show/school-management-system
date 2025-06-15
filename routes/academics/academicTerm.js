const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const express = require("express");
const academicTermRouter = express.Router();

//const router = express.Router();
const {
  createAcademicTerm,
  getAcademicTerms,
  getAcademicTerm,
  updateAcademicTerm,
  deleteAcademicTerm,
} = require("../../controller/academics/academicTermCtrl");

// Optionally: Add auth middlewares if needed
// const isLogin = require("../../middlewares/isLogin");
// const isAdmin = require("../../middlewares/isAdmin");

// Routes
// router.post("/", isLogin, isAdmin, createAcademicTerm);
// router.get("/", isLogin, isAdmin, getAcademicTerms);

academicTermRouter
  .route("/")
  .post(isLogin, isAdmin, createAcademicTerm)
  .get(isLogin, isAdmin, getAcademicTerms);

academicTermRouter
  .route("/:id")
  .get(isLogin, isAdmin, getAcademicTerm)
  .put(isLogin, isAdmin, updateAcademicTerm)
  .delete(isLogin, isAdmin, deleteAcademicTerm);

// router.get("/:id", isLogin, isAdmin, getAcademicTerm);
// router.put("/:id", isLogin, isAdmin, updateAcademicTerm);
// router.delete("/:id", isLogin, isAdmin, deleteAcademicTerm);

module.exports = academicTermRouter;
