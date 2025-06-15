const asyncHandler = require("express-async-handler");
const Question = require("../../model/Academic/QuestionsModel");
const Exam = require("../../model/Academic/15 - Exam");

// @desc    Create a question and add to exam
// @route   POST /api/v1/questions/:examId
// @access  Private/Teacher only
// const Exam = require("../../model/academics/ExamModel");
// const Question = require("../../model/academics/QuestionModel");
// const asyncHandler = require("express-async-handler");

exports.createQuestion = asyncHandler(async (req, res) => {
  const data = req.body;
  const examId = req.params.examId;

  // Check if exam exists
  const examFound = await Exam.findById(examId);
  if (!examFound) {
    throw new Error("Exam not found");
  }

  // Store created questions
  let createdQuestions = [];

  if (Array.isArray(data)) {
    // Handle multiple questions
    for (const q of data) {
      const { question, optionA, optionB, optionC, optionD, correctAnswer } = q;

      // Check if question already exists (optional)
      const questionExists = await Question.findOne({ question });
      if (questionExists) {
        continue; // Skip duplicates
      }

      const created = await Question.create({
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        createdBy: req.userAuth._id,
      });

      examFound.questions.push(created._id);
      createdQuestions.push(created);
    }
  } else {
    // Handle single question
    const { question, optionA, optionB, optionC, optionD, correctAnswer } =
      data;

    const questionExists = await Question.findOne({ question });
    if (questionExists) {
      throw new Error("Question already exists");
    }

    const created = await Question.create({
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      createdBy: req.userAuth._id,
    });

    examFound.questions.push(created._id);
    createdQuestions.push(created);
  }

  await examFound.save();

  res.status(201).json({
    success: true,
    message: "Question(s) created and added to exam successfully",
    data: createdQuestions,
  });
});

// @desc   Get all questions
// @route  GET /api/v1/questions
// @access Private
exports.getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find()
    .populate({ path: "createdBy", select: "name email role" })
    .sort({ createdAt: -1 }); // Fixed typo here

  res.status(200).json({
    status: "success",
    message: "Questions fetched successfully",
    data: questions,
  });
});

// @desc   Get single question by ID
// @route  GET /api/v1/questions/:id
// @access Private/Teachers only
exports.getQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id).populate(
    "createdBy",
    "name email role"
  );

  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  res.status(200).json({
    status: "success",
    data: question,
  });
});

// @desc   Update question by ID
// @route  PUT /api/v1/questions/:id
// @access Private/Teachers only
exports.updateQuestion = asyncHandler(async (req, res) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;

  // Check if question exists
  const existingQuestion = await Question.findById(req.params.id);
  if (!existingQuestion) {
    return res.status(404).json({
      status: "fail",
      message: "Question not found",
    });
  }

  // Update question
  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("createdBy", "name email role");

  res.status(200).json({
    status: "success",
    message: "Question updated successfully",
    data: updatedQuestion,
  });
});
