const asyncHandler = require("express-async-handler");
//const Admin = require("../../model/Academic/Staff/Admin.js");
const Program = require("../../model/Academic/7 - Program.js");
const Subject = require("../../model/Academic/8 - Subject.js");

// @desc   Create sunject
// @route  POST /api/v1/subjects/:programId
// @access Private
const createSubject = asyncHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;
  // find the program
  const programFound = await Program.findById(req.params.programId);
  if (!programFound) {
    throw new Error("Program not found");
  }

  const subjectExists = await Subject.findOne({ name });
  if (subjectExists) {
    throw new Error("subject already exists");
  }

  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy: req.userAuth._id,
  });

  // push to the program
  programFound.subjects.push(subjectCreated._id);
  await programFound.save();

  res.status(201).json({
    status: "success",
    message: "Subject created successfully",
    data: subjectCreated,
  });
});

// @desc   Get all subjects
// @route  GET /api/v1/subjects
// @access Private
const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find();
  res.status(200).json({
    status: "success",
    data: subjects,
    message: "subjects retrieved successfully",
  });
});

// @desc   Get single subjects by ID
// @route  GET /api/v1/subjects/:id
// @access Private
const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    return res.status(404).json({
      status: "fail",
      message: "Subject not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: subject,
  });
});

// @desc   Update Subject
// @route  PUT /api/v1/subjects/:id
// @access Private
const updateSubject = asyncHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;

  // Check for duplicate name
  const existingSubject = await Subject.findOne({ name });
  if (existingSubject && existingSubject._id.toString() !== req.params.id) {
    throw new Error("Subject already exists");
  }

  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      academicTerm,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!subject) {
    return res.status(404).json({
      status: "fail",
      message: "subject not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "subject updated successfully",
    data: subject,
  });
});

// @desc   Delete subject
// @route  DELETE /api/v1/subjects/:id
// @access Private
const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndDelete(req.params.id);
  if (!subject) {
    return res.status(404).json({
      status: "fail",
      message: "subject not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Subject deleted successfully",
  });
});

module.exports = {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};
