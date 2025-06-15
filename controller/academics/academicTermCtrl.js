const asyncHandler = require("express-async-handler");
const Admin = require("../../model/Academic/Staff/Admin");
const AcademicTerm = require("../../model/Academic/10 - AcademicTerm");

// @desc   Create academicTerm year
// @route  POST /api/v1/academic-Terms
// @access Private
const createAcademicTerm = asyncHandler(async (req, res) => {
  const { name, description, duration, createdBy } = req.body;

  const exists = await AcademicTerm.findOne({ name });
  if (exists) {
    throw new Error("Academic Term already exists");
  }

  const academicTermCreated = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy: req.userAuth._id, // or req.user._id depending on middleware
  });

  //push academic year to admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicTerms.push(academicTermCreated._id);
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Academic Term created successfully",
    data: academicTermCreated,
  });
});

// @desc   Get all academic Terms
// @route  GET /api/v1/academic-Terms
// @access Private
const getAcademicTerms = asyncHandler(async (req, res) => {
  const academicTerms = await AcademicTerm.find();

  res.status(200).json({
    status: "Academic terms fetched successfully",
    data: academicTerms,
  });
});

// @desc   Get single academic Terms
// @route  GET /api/v1/academic-Terms/:id
// @access Private
const getAcademicTerm = asyncHandler(async (req, res) => {
  console.log("ID received:", req.params.id); // Add this for debugging

  const academicTerm = await AcademicTerm.findById(req.params.id);

  if (!academicTerm) {
    return res.status(404).json({
      status: "failed",
      message: "Academic term not found",
      data: null,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Academic term fetched successfully",
    data: academicTerm,
  });
});

// @desc  update academic Term
// @route  put /api/v1/academic-Terms/:id
// @access Private
const updateAcademicTerm = asyncHandler(async (req, res) => {
  const { name, discription, duration } = req.body;
  const id = req.params.id;
  // check if name exist
  const createdAcademicTermFound = await AcademicTerm.findOne({ name });
  if (createdAcademicTermFound) {
    throw new Error("Academic year already exist");
  }

  const academicTerms = await AcademicTerm.findOneAndUpdate(
    { _id: id }, // ✅ Ensure 'id' comes from req.params.id
    {
      name,
      duration,
      discription,
      createdBy: req.userAuth._id, // ✅ From isLogin middleware
    },
    {
      new: true, // ✅ Return the updated document
      runValidators: true, // ✅ Validate fields against schema
    }
  );

  res.status(200).json({
    status: "success",
    data: academicTerms,
    message: "Academic Terms updated successfully",
  });
});

// @desc  delete academic Term
// @route  delete /api/v1/academic-Terms/:id
// @access Private
const deleteAcademicTerm = asyncHandler(async (req, res) => {
  // check if name exist
  await AcademicTerm.findOneAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Academic year deleted successfully",
  });
});

// ✅ Export correctly
module.exports = {
  createAcademicTerm,
  getAcademicTerms,
  getAcademicTerm,
  updateAcademicTerm,
  deleteAcademicTerm,
};
