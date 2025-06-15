const asyncHandler = require("express-async-handler");
//const Admin = require("../../model/Academic/Staff/Admin.js");
const YearGroup = require("../../model/Academic/YearGroup.js");
//const AcademicYear = require("../../model/Academic/AcademicYear.js"); // if needed

// @desc   Create year group
// @route  POST /api/v1/yeargroups
// @access Private
const createYearGroup = asyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;

  // Check if year group with the same name already exists in the same academic year
  const existingYearGroup = await YearGroup.findOne({ name, academicYear });
  if (existingYearGroup) {
    throw new Error("Year Group already exists for this academic year");
  }

  // Create new YearGroup
  const yearGroupCreated = await YearGroup.create({
    name,
    academicYear,
    createdBy: req.userAuth._id,
  });

  res.status(201).json({
    status: "success",
    message: "Year Group created successfully",
    data: yearGroupCreated,
  });
});

// @desc   Get all year groups
// @route  GET /api/v1/yeargroups
// @access Private
const getYearGroups = asyncHandler(async (req, res) => {
  const yearGroups = await YearGroup.find()
    .populate("academicYear")
    .populate("createdBy", "name email"); // populate if needed

  res.status(200).json({
    status: "success",
    data: yearGroups,
    message: "Year groups retrieved successfully",
  });
});

// @desc   Get single year group by ID
// @route  GET /api/v1/yeargroups/:id
// @access Private
const getYearGroup = asyncHandler(async (req, res) => {
  const yearGroup = await YearGroup.findById(req.params.id)
    .populate("academicYear")
    .populate("createdBy", "name email");

  if (!yearGroup) {
    return res.status(404).json({
      status: "fail",
      message: "Year Group not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: yearGroup,
  });
});

// @desc   Update year group
// @route  PUT /api/v1/yeargroups/:id
// @access Private
const updateYearGroup = asyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;

  // Check if duplicate name for the same academic year exists excluding current year group
  const existingYearGroup = await YearGroup.findOne({ name, academicYear });
  if (existingYearGroup && existingYearGroup._id.toString() !== req.params.id) {
    throw new Error(
      "Year Group with this name already exists for the academic year"
    );
  }

  const yearGroup = await YearGroup.findByIdAndUpdate(
    req.params.id,
    {
      name,
      academicYear,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!yearGroup) {
    return res.status(404).json({
      status: "fail",
      message: "Year Group not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Year Group updated successfully",
    data: yearGroup,
  });
});

// @desc   Delete year group
// @route  DELETE /api/v1/yeargroups/:id
// @access Private
const deleteYearGroup = asyncHandler(async (req, res) => {
  const yearGroup = await YearGroup.findByIdAndDelete(req.params.id);

  if (!yearGroup) {
    return res.status(404).json({
      status: "fail",
      message: "Year Group not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Year Group deleted successfully",
  });
});

module.exports = {
  createYearGroup,
  getYearGroups,
  getYearGroup,
  updateYearGroup,
  deleteYearGroup,
};
