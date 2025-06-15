const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const express = require("express");
const classLevelRouter = express.Router();

//const router = express.Router();
const {
  createclassLevel,
  getclassLevels,
  getclassLevel,
  updateclassLevel,
  deleteclassLevel,
} = require("../../controller/academics/classLevelCtrl");

// Optionally: Add auth middlewares if needed
// const isLogin = require("../../middlewares/isLogin");
// const isAdmin = require("../../middlewares/isAdmin");

// Routes
// router.post("/", isLogin, isAdmin, createclassLevel);
// router.get("/", isLogin, isAdmin, getclassLevels);

classLevelRouter
  .route("/")
  .post(isLogin, isAdmin, createclassLevel)
  .get(isLogin, isAdmin, getclassLevels);

classLevelRouter
  .route("/:id")
  .get(isLogin, isAdmin, getclassLevel)
  .put(isLogin, isAdmin, updateclassLevel)
  .delete(isLogin, isAdmin, deleteclassLevel);

// router.get("/:id", isLogin, isAdmin, getclassLevel);
// router.put("/:id", isLogin, isAdmin, updateclassLevel);
// router.delete("/:id", isLogin, isAdmin, deleteclassLevel);

module.exports = classLevelRouter;
