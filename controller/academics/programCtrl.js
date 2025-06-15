const asyncHandler = require("express-async-handler");
const Admin = require("../../model/Academic/Staff/Admin.js");
const Program = require("../../model/Academic/7 - Program.js");

// @desc   Create program
// @route  POST /api/v1/programs
// @access Private
const createProgram = asyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;

  const exists = await Program.findOne({ name });
  if (exists) {
    throw new Error("Program already exists");
  }

  const programCreated = await Program.create({
    name,
    description,
    duration,
    createdBy: req.userAuth._id,
  });

  // Push program to admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.programs.push(programCreated._id);
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Program created successfully",
    data: programCreated,
  });
});

// @desc   Get all programs
// @route  GET /api/v1/programs
// @access Private
const getPrograms = asyncHandler(async (req, res) => {
  const programs = await Program.find();
  res.status(200).json({
    status: "success",
    data: programs,
  });
});

// @desc   Get single program by ID
// @route  GET /api/v1/programs/:id
// @access Private
const getProgram = asyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);
  if (!program) {
    return res.status(404).json({
      status: "fail",
      message: "Program not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: program,
  });
});

// @desc   Update program
// @route  PUT /api/v1/programs/:id
// @access Private
const updateProgram = asyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;

  // Check for duplicate name
  const existingProgram = await Program.findOne({ name });
  if (existingProgram && existingProgram._id.toString() !== req.params.id) {
    throw new Error("Program already exists");
  }

  const program = await Program.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      duration,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!program) {
    return res.status(404).json({
      status: "fail",
      message: "Program not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Program updated successfully",
    data: program,
  });
});

// @desc   Delete program
// @route  DELETE /api/v1/programs/:id
// @access Private
const deleteProgram = asyncHandler(async (req, res) => {
  const program = await Program.findByIdAndDelete(req.params.id);
  if (!program) {
    return res.status(404).json({
      status: "fail",
      message: "Program not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Program deleted successfully",
  });
});

module.exports = {
  createProgram,
  getPrograms,
  getProgram,
  updateProgram,
  deleteProgram,
};
