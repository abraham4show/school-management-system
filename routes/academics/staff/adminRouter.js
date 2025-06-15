const express = require("express");
const {
  registerAdminCtrl,
  loginAdminCtrl,
  getAllAdminsCtrl,
  getSingleAdminProfileCtrl,
  updateAdminCtrl,
  deleteAdminCtrl,
  suspendAminCtrl,
  unsuspendAdminCtrl,
  withdrawAdminCtrl,
  unWithdraw,
  publishAdminCtrl,
  unpublishAdminCtrl,
} = require("../../../controller/staff/adminController");
const isLogin = require("../../../middlewares/isLogin");
const isAdmin = require("../../../middlewares/isAdmin");
const advanceResults = require("../../../middlewares/advanceResult");
const Admin = require("../../../model/Academic/Staff/Admin");
const isAuthenticated = require("../../../middlewares/isAuthenticated");
const roleRestriction = require("../../../controller/academics/roleRestriction");

const adminRouter = express.Router();

//register admin
adminRouter.post("/register", registerAdminCtrl);

//login admin
adminRouter.post("/login", loginAdminCtrl);

//get all
adminRouter.get("/", isLogin, advanceResults(Admin), getAllAdminsCtrl);

//get single admin
adminRouter.get(
  "/profile",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  getSingleAdminProfileCtrl
);

//update admin
adminRouter.put("/:id", isLogin, roleRestriction("admin"), updateAdminCtrl);

//delete admin
adminRouter.delete("/:id", deleteAdminCtrl);

//suspend
adminRouter.put("/suspend/teacher/:id", suspendAminCtrl);

//unsuspend teacher
adminRouter.put("/unsuspend/teacher/:id", unsuspendAdminCtrl);

//withdraw
adminRouter.put("/withdraw/teacher/:id", withdrawAdminCtrl);

//unwithdraw
adminRouter.put("/unwithdraw/teacher/:id", unWithdraw);

//publish exam
adminRouter.put("/publish/exam/:id", publishAdminCtrl);

//unpublish exam
adminRouter.put("/unpublish/exam/:id", unpublishAdminCtrl);

module.exports = adminRouter;
