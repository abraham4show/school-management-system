const asyncHandler = require("express-async-handler");
const AcademicYear = require("../../model/Academic/AcademicYear");
const Admin = require("../../model/Academic/Staff/Admin");

// @desc   Create academic year
// @route  POST /api/v1/academic-years
// @access Private
const createAcademicYear = asyncHandler(async (req, res) => {
  const { name, fromYear, toYear, isCurrent } = req.body;

  const exists = await AcademicYear.findOne({ name });
  if (exists) {
    throw new Error("Academic year already exists");
  }

  const academicYearCreated = await AcademicYear.create({
    name,
    fromYear,
    toYear,
    isCurrent,
    createdBy: req.userAuth._id, // or req.user._id depending on middleware
  });

  //push academic year to admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicYears.push(academicYearCreated._id);
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Academic year created successfully",
    data: academicYearCreated,
  });
});

// @desc   Get all academic years
// @route  GET /api/v1/academic-years
// @access Private
const getAcademicYears = asyncHandler(async (req, res) => {
  const years = await AcademicYear.find();
  res.status(200).json({
    status: "success",
    data: years,
  });
});

// @desc   Get all academic years
// @route  GET /api/v1/academic-years/:id
// @access Private
const getAcademicYear = asyncHandler(async (req, res) => {
  const years = await AcademicYear.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: years,
  });
});

// @desc  update academic years
// @route  put /api/v1/academic-years/:id
// @access Private
const updateAcademicYear = asyncHandler(async (req, res) => {
  const { name, fromYear, toYear, isCurrent } = req.body;
  const id = req.params.id;
  // check if name exist
  const createdAcademicYearFound = await AcademicYear.findOne({ name });
  if (createdAcademicYearFound) {
    throw new Error("Academic year already exist");
  }

  const academicYear = await AcademicYear.findOneAndUpdate(
    { _id: id }, // ✅ Ensure 'id' comes from req.params.id
    {
      name,
      fromYear,
      toYear,
      isCurrent,
      createdBy: req.userAuth._id, // ✅ From isLogin middleware
    },
    {
      new: true, // ✅ Return the updated document
      runValidators: true, // ✅ Validate fields against schema
    }
  );

  res.status(200).json({
    status: "success",
    data: academicYear,
    message: "Academic year updated successfully",
  });
});

const deleteAcademicYear = asyncHandler(async (req, res) => {
  // check if name exist
  await AcademicYear.findOneAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Academic year deleted successfully",
  });
});

// ✅ Export correctly
module.exports = {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
};
