const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const {
  createYearGroup,
  getYearGroups,
  getYearGroup,
  updateYearGroup,
  deleteYearGroup,
} = require("../../controller/academics/yearGroups");

const yearGroupRouter = express.Router();

yearGroupRouter.post("/", isLogin, isAdmin, createYearGroup);
yearGroupRouter.get("/", isLogin, isAdmin, getYearGroups);
yearGroupRouter.get("/:id", isLogin, isAdmin, getYearGroup);
yearGroupRouter.put("/:id", isLogin, isAdmin, updateYearGroup);
yearGroupRouter.delete("/:id", isLogin, isAdmin, deleteYearGroup);

module.exports = yearGroupRouter;
