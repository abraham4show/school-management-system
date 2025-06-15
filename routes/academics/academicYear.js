const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const express = require("express");
const academicYearRouter = express.Router();

//const router = express.Router();
const {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} = require("../../controller/academics/academicYearCtrl");

// Optionally: Add auth middlewares if needed
// const isLogin = require("../../middlewares/isLogin");
// const isAdmin = require("../../middlewares/isAdmin");

// Routes
// router.post("/", isLogin, isAdmin, createAcademicYear);
// router.get("/", isLogin, isAdmin, getAcademicYears);

academicYearRouter
  .route("/")
  .post(isLogin, isAdmin, createAcademicYear)
  .get(isLogin, isAdmin, getAcademicYears);

academicYearRouter
  .route("/:id")
  .get(isLogin, isAdmin, getAcademicYear)
  .put(isLogin, isAdmin, updateAcademicYear)
  .delete(isLogin, isAdmin, deleteAcademicYear);

// router.get("/:id", isLogin, isAdmin, getAcademicYear);
// router.put("/:id", isLogin, isAdmin, updateAcademicYear);
// router.delete("/:id", isLogin, isAdmin, deleteAcademicYear);

module.exports = academicYearRouter;
