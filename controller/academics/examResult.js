const asyncHandler = require("express-async-handler");
const Student = require("../../model/Academic/StudentModel");
const ExamResult = require("../../model/Academic/ExamResults");

exports.checkExamResults = asyncHandler(async (req, res) => {
  const studentFound = await Student.findById(req.userAuth._id);
  if (!studentFound) {
    throw new Error("No student found");
  }

  console.log("Student ID from DB:", studentFound.studentId);
  console.log("ExamResult ID from URL:", req.params.id);

  const examResult = await ExamResult.findOne({
    _id: req.params.id,
    studentId: studentFound.studentId, // ✅ Match string to string
  })
    .populate({
      path: "exam",
      populate: { path: "questions" },
    })
    .populate("classLevel")
    .populate("academicYear")
    .populate("academicTerm");

  if (!examResult) {
    throw new Error("Exam result not found");
  }

  if (!examResult.isPublished) {
    throw new Error("Exam result is not available, check back later");
  }

  res.status(200).json({
    status: "success",
    message: "Exam Results fetched",
    data: examResult,
    student: studentFound,
  });
});

// @desc  get all exam result {name, id}
// @route  post  /api/v1/exam-results/:id/checking
// @access Private Student only

exports.getAllExamResults = asyncHandler(async (req, res) => {
  const results = await ExamResult.find().select("exam").populate("exam");
  res.status(200).json({
    status: "success",
    message: "Exam Results fetched",
    data: results,
  });
});

// @desc  admin publishing exam result
// @route  put  /api/v1/exam-results/:id/admin-toggle-publish
// @access Private admin only

exports.adminToggleExamResult = asyncHandler(async (req, res) => {
  // find the exam results
  const examResults = await ExamResult.findById(req.params.id);

  if (!examResults) {
    throw new Error("exam result not found");
  }

  const publishResult = await ExamResult.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Exam Results updated",
    data: publishResult,
  });
});
