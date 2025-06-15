const asyncHandler = require("express-async-handler");
const Teacher = require("../../model/Academic/Staff/TeacherModel");
const Admin = require("../../model/Academic/Staff/Admin");
const { passwordhashed, isPassMatched } = require("../../utils/helpers");
//const isPasswordMatch = require("../../utils/helpers/isPasswordMatch");
const generateToken = require("../../utils/generateToken");

// @desc    admin Register Teacher
// @route   POST /api/v1/teachers/admin/register
// @access  Public

exports.adminRegisterTeacher = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    throw new Error("Admin not found");
  }
  //check if tacher already exist
  const teacher = await Teacher.findOne({ name, email });
  if (teacher) {
    throw new Error("Teacher already exists");
  }
  //hash password
  const hashedPassword = await passwordhashed(password);
  // create teacher
  const teacherCreated = await Teacher.create({
    name,
    email,
    password: hashedPassword,
    role: "Teacher",
  });
  //push teacher into admin
  adminFound.teachers.push(teacherCreated?._id);
  await adminFound.save();
  //send teacher data
  res.status(201).json({
    status: "success",
    message: " Teacher registered successfully",
    data: teacherCreated,
  });
});

// @desc    admin login Teacher
// @route   POST /api/v1/teachers/login
// @access  Public

exports.loginTeacher = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // find the user
  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    throw new Error("Teacher not found");
  }

  // verify password
  const isMatch = await isPassMatched(password, teacher.password);
  if (!isMatch) {
    return res.json({ message: "invalid login credentials", status: "fail" });
  }

  // ✅ Add this log:
  console.log("Logging in teacher with ID:", teacher._id);

  // Respond with token
  res.status(200).json({
    status: "success",
    message: "Teacher logged in successfully",
    data: {
      Token: generateToken(teacher._id),
    },
  });
});

// @desc    get all teachers
// @route   GET /api/v1/admin/teachers
// @access  Private/admin only

exports.getAllTeachersAdmin = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById("684af4206ea8516c1a2735a8").populate(
    "examsCreated"
  );
  console.log("Teacher:", teacher.name);
  console.log("Exams Created:", teacher.examsCreated);
  res.status(200).json(teacher);
});

// @desc    get single teacher
// @route   GET /api/v1/teacher/teacherId/admin
// @access  Private/admin only

exports.getTeacherByAdmin = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  const teacher = await Teacher.findById(teacherId);

  if (!teacher) {
    return res.status(404).json({
      status: "fail",
      message: "No teacher found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Teacher fetched successfully",
    data: teacher,
  });
});

// @desc     teacher profile by admin
// @route   GET /api/v1/teacher/profile
// @access  Private/teacher only

exports.getTeacherProfile = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.userAuth._id).select(
    "-password -createdAt -updatedAt"
  );

  if (!teacher) {
    return res.status(404).json({
      status: "fail",
      message: "No teacher found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Teacher profile fetched successfully",
    data: teacher,
  });
});

// @desc      teacher updating profile
// @route   put /api/v1/teacher/:id/update
// @access  Private/teacher only
const bcrypt = require("bcryptjs");

exports.teacherUpdateProfile = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  // Check if the new email already exists on another teacher's account
  const emailExist = await Teacher.findOne({ email });
  if (emailExist && emailExist._id.toString() !== req.userAuth._id.toString()) {
    throw new Error("Email already exists");
  }

  // Prepare updated fields, fallback to current values if not provided
  const updatedData = {
    email: email || req.userAuth.email,
    name: name || req.userAuth.name,
  };

  // If password is being updated, hash it
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updatedData.password = await bcrypt.hash(password, salt);
  }

  // Perform the update
  const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.userAuth._id,
    updatedData,
    { new: true, runValidators: true }
  ).select("-password"); // exclude password from response

  if (!updatedTeacher) {
    return res.status(404).json({
      status: "fail",
      message: "Teacher not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Teacher updated successfully",
    data: updatedTeacher,
  });
});

// ..

// @desc      admin updating teacher profile
// @route   put /api/v1/teacher/:id/admin
// @access  Private/admin only
exports.adminUpdateProfile = asyncHandler(async (req, res) => {
  const { program, classLevel, academicYear, subject } = req.body;

  const teacherFound = await Teacher.findById(req.params.teacherId);

  if (!teacherFound) {
    return res.status(404).json({
      status: "fail",
      message: "Teacher not found",
    });
  }

  if (teacherFound.isWitdrawn) {
    return res.status(400).json({
      status: "fail",
      message: "Teacher is withdrawn, cannot update profile",
    });
  }

  // Update the fields if they exist in request body
  if (program) teacherFound.program = program;
  if (classLevel) teacherFound.classLevel = classLevel;
  if (academicYear) teacherFound.academicYear = academicYear;
  if (subject) teacherFound.subject = subject;

  // Save once
  await teacherFound.save();

  // Send a single response after all updates
  res.status(200).json({
    status: "success",
    message: "Teacher updated successfully",
    data: teacherFound,
  });
});
