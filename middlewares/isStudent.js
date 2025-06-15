const isStudent = (req, res, next) => {
  if (!req.userAuth || req.userAuth.role.toLowerCase() !== "student") {
    return res.status(403).json({
      status: "failed",
      message: "Access denied: Student only",
    });
  }
  next();
};

module.exports = isStudent;
