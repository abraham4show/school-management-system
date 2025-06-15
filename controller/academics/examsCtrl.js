const asyncHandler = require("express-async-handler");
//const Teacher = require("../../model/Academic/Staff/TeacherModel");
// const Exam = require("../../models/academics/Exam");
// const Teacher = require("../../models/academics/staff/teacherModel");
const Exam = require("../../model/Academic/15 - Exam");

// @desc    create exams
// @route   POST /api/v1/exams
// @access  private teachers only

exports.createExams = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    examStatus,
    classLevel,
    academicYear,
  } = req.body;

  const createdBy = req.userAuth?._id;

  // find the teacher
  const teacher = req.teacher;
  if (!teacher) {
    throw new Error("Teacher not found");
  }

  // check if exam already exists
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    throw new Error("Exam already exists");
  }

  // create new exam
  const examCreated = new Exam({
    name,
    description,
    academicYear,
    classLevel,
    createdBy,
    duration,
    examDate,
    examTime,
    examType,
    examStatus,
    subject,
    program,
    academicTerm,
  });

  // save the exam first
  await examCreated.save();

  // push the exam ID to teacher
  teacher.examsCreated.push(examCreated._id);

  // save the teacher
  await teacher.save();

  res.status(201).json({
    status: "success",
    message: "Exam created successfully",
    data: {
      exam: examCreated,
    },
  });
});

// @desc   Get all exams
// @route  GET /api/v1/exams
// @access Private
exports.getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find()
    .populate({ path: "createdBy", select: "name email role" })
    .sort({ cretedAt: -1 });
  res.status(200).json({
    status: "success",
    data: exams,
    message: "exams fetched successfully",
  });
});

// @desc   Get single exam by ID
// @route  GET /api/v1/exams/:id
// @access Private Teachers only

exports.getExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.status(200).json({
    status: "success",
    data: exam,
    message: "Exam fetched successfully",
  });
});

// @desc   Update Exam
// @route  PUT /api/v1/Exams/:id
// @access Private - teacher only

exports.updateExam = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    examStatus,
    classLevel,
    academicYear,
  } = req.body;

  // Check for duplicate exam name (excluding current exam)
  const existingExam = await Exam.findOne({ name });
  if (existingExam && existingExam._id.toString() !== req.params.id) {
    throw new Error("Exam already exists");
  }

  const examUpdated = await Exam.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      subject,
      program,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      examStatus,
      classLevel,
      academicYear,
      createdBy: req.userAuth?._id, // ✅ Use req.user not req.userAuth
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!examUpdated) {
    return res.status(404).json({
      status: "failed",
      message: "Exam not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Exam updated successfully",
    data: examUpdated,
  });
});
