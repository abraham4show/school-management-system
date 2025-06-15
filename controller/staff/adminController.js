const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const generateToken = require("../../utils/generateToken");
const Admin = require("../../model/Academic/Staff/Admin");
//const { isPassMatched } = require("../../utils/helpers");

// @desc    Register an admin
// @route   POST /api/v1/admins/register
// @access  Public
exports.registerAdminCtrl = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if admin already exists
  const adminFound = await Admin.findOne({ email });
  if (adminFound) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(password, salt);

  // ✅ Use the correct variable name here
  const user = await Admin.create({
    name,
    email,
    password: passwordHashed,
  });

  res.status(201).json({
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
    message: "Admin registered successfully",
  });
});

// @desc    Login an admin
// @route   POST /api/v1/admins/login
// @access  Public
exports.loginAdminCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await Admin.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  console.log("✅ Entered:", password);
  console.log("🔐 Stored:", user.password);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("✅ Match:", isMatch);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  res.status(200).json({
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
    message: "Admin logged in successfully",
  });
});

// @desc    Get all admins
// @route   GET /api/v1/admins
// @access  Private
exports.getAllAdminsCtrl = asyncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

// @desc    Get a single admin
// @route   GET /api/v1/admins/:id
// @access  Private
exports.getSingleAdminProfileCtrl = async (req, res, next) => {
  try {
    const adminId = req.userAuth._id; // Or wherever your admin ID is coming from
    const admin = await Admin.findById(adminId)
      .lean()
      .select("-password -createdAt -updatedAt")
      .populate("academicYears")
      .populate("academicTerms")
      .populate("programs")
      .populate("teachers")
      .populate("students")
      .populate("classLevels");

    if (!admin) {
      return res
        .status(404)
        .json({ status: "fail", message: "Admin not found" });
    }

    res.status(200).json({
      status: "admin registared",
      data: admin,
      message: "admin profile fetched successfully",
    });
  } catch (error) {
    next(error); // Proper error handling (if you have a global error handler)
  }
};

//update admin
// const bcrypt = require("bcryptjs"); // make sure you use bcrypt for password hashing
// ...existing code...
//update admin
exports.updateAdminCtrl = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  // Find the currently logged-in admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    throw new Error("Admin not found");
  }

  // Check if the new email already exists in another admin's account
  const emailExist = await Admin.findOne({ email });
  if (emailExist && emailExist._id.toString() !== req.userAuth._id.toString()) {
    throw new Error("Email already exists");
  }

  // Prepare updated fields
  const updatedData = {
    email: email || adminFound.email,
    name: name || adminFound.name,
  };

  // If password is being updated, hash it
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updatedData.password = await bcrypt.hash(password, salt); // <-- FIXED
  }

  // Perform the update
  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.userAuth._id,
    updatedData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedAdmin,
    message: "Admin updated successfully",
  });
});
// ...existing code...

//delete admin
exports.deleteAdminCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "delete admin",
    });
  } catch (error) {
    res.json({
      status: "failled",
      error: error.message,
    });
  }
};

//suspendedAminCtrl
exports.suspendAminCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin suspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failled",
      error: error.message,
    });
  }
};

//unsuspend
exports.unsuspendAdminCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unsuspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failled",
      error: error.message,
    });
  }
};

//withdraw
exports.withdrawAdminCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin withdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failled",
      error: error.message,
    });
  }
};

//unwithdraw
exports.unWithdraw = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unwithdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failled",
      error: error.message,
    });
  }
};

// publish exam
exports.publishAdminCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin publishing exam",
    });
  } catch (error) {
    res.json({
      status: "failled",
      error: error.message,
    });
  }
};

//unpublish exam
exports.unpublishAdminCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unpublishing exam",
    });
  } catch (error) {
    res.json({
      status: "failled",
      error: error.message,
    });
  }
};
