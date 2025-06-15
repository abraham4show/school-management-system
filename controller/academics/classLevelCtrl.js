const asyncHandler = require("express-async-handler");
const ClassLevel = require("../../model/Academic/ClassLevel.js");
const Admin = require("../../model/Academic/Staff/Admin.js");

// @desc   Create class level
// @route  POST /api/v1/class-level
// @access Private
const createclassLevel = asyncHandler(async (req, res) => {
  const { name, fromYear, toYear, isCurrent } = req.body;

  const exists = await ClassLevel.findOne({ name });
  if (exists) {
    throw new Error("Academic year already exists");
  }

  const classLevelCreated = await ClassLevel.create({
    name,
    fromYear,
    toYear,
    isCurrent,
    createdBy: req.userAuth._id, // or req.user._id depending on middleware
  });

  //push academic year to admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.classLevels.push(classLevelCreated._id);
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Academic year created successfully",
    data: classLevelCreated,
  });
});

// @desc   Get all academic years
// @route  GET /api/v1/academic-years
// @access Private
const getclassLevels = asyncHandler(async (req, res) => {
  const years = await ClassLevel.find();
  res.status(200).json({
    status: "success",
    data: years,
  });
});

// @desc   Get all academic years
// @route  GET /api/v1/academic-years/:id
// @access Private

//const classLevel = require("../../model/academics/classLevel");

// @desc Get a class level by ID
const getclassLevel = asyncHandler(async (req, res) => {
  const level = await ClassLevel.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: level,
  });
});

// @desc  update academic years
// @route  put /api/v1/academic-years/:id
// @access Private
// Import your model at the top of the fileconst updateclassLevel = asyncHandler(async (req, res) => {
const updateclassLevel = asyncHandler(async (req, res) => {
  const { name, fromYear, toYear, isCurrent } = req.body;
  const id = req.params.id;

  // Check if another class level with the same name exists (excluding current one)
  const createdclassLevelFound = await ClassLevel.findOne({ name });

  if (createdclassLevelFound && createdclassLevelFound._id.toString() !== id) {
    throw new Error("Class level already exists");
  }

  const classLevel = await ClassLevel.findOneAndUpdate(
    { _id: id },
    {
      name,
      fromYear,
      toYear,
      isCurrent,
      createdBy: req.userAuth._id,
    },
    { new: true, runValidators: true }
  );

  if (!classLevel) {
    return res.status(404).json({
      status: "fail",
      message: "Class level not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: classLevel,
    message: "Class level updated successfully",
  });
});

// @desc  delete academic years
// @route  put /api/v1/academic-years/:id
// @access Private

const deleteclassLevel = asyncHandler(async (req, res) => {
  // check if name exist
  await ClassLevel.findOneAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Academic year deleted successfully",
  });
});

// ✅ Export correctly
module.exports = {
  createclassLevel,
  getclassLevels,
  getclassLevel,
  updateclassLevel,
  deleteclassLevel,
};
