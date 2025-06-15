const asyncHandler = require("express-async-handler");
const { passwordhashed, isPassMatched } = require("../../utils/helpers");
const Student = require("../../model/Academic/StudentModel");
const generateToken = require("../../utils/generateToken");
const Exam = require("../../model/Academic/15 - Exam");
const ExamResult = require("../../model/Academic/ExamResults");
const Admin = require("../../model/Academic/Staff/Admin");

// @desc    Admin register student
// @route   POST /api/v1/students/admin/register
// @access  Private - Admin only

exports.adminRegisterStudent = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    throw new Error("Admin not found");
  }

  // Check if student already exists
  const student = await Student.findOne({ email });
  if (student) {
    throw new Error("Student already exists");
  }

  // Hash password
  const hashedPassword = await passwordhashed(password);

  // Create student
  const studentCreated = await Student.create({
    name,
    email,
    password: hashedPassword,
    role: "Student",
  });

  //push teacher into admin
  adminFound.students.push(studentCreated?._id);
  await adminFound.save();

  // Send response
  res.status(201).json({
    status: "success",
    message: "Student registered successfully",
    data: studentCreated,
  });
});

exports.loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if student exists
  const student = await Student.findOne({ email });
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  // Check password
  const isMatch = await isPassMatched(password, student.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid login credentials");
  }

  console.log("✅ Logging in student with ID:", student._id);

  // Respond with token and student data
  res.status(200).json({
    status: "success",
    message: "Student logged in successfully",
    data: {
      token: generateToken(student._id),
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
      },
    },
  });
});

// @desc    get all students
// @route   GET /api/v1/admin/students
// @access  Private/admin only

exports.getAllStudentsByAdmin = asyncHandler(async (req, res) => {
  const students = await Student.find({}).select("-password");

  if (!students || students.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No students found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Students fetched successfully",
    data: students,
  });
});

// @desc    get all single student
// @route   GET /api/v1/admin/student
// @access  Private/admin only

exports.getSingleStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id).select("-password");

  if (!student) {
    return res.status(404).json({
      status: "fail",
      message: "Student not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Student fetched successfully",
    data: student,
  });
});

// @desc    get all student profile
// @route   GET /api/v1/admin/student
// @access  Private/admin only
exports.getStudentProfile = asyncHandler(async (req, res) => {
  const studentId = req.userAuth._id;

  const student = await Student.findById(studentId)
    .select("-password -createdAT -updatedAt")
    .populate("examResults");

  if (!student) {
    return res.status(404).json({
      status: "fail",
      message: "Student profile not found",
    });
  }
  //get student profile
  const studentProfile = {
    name: student?.name,
    email: student?.email,
    currentClassLevel: student?.currentClassLevel,
    program: student?.program,
    dateAdmitted: student?.dateAdmitted,
    isSuspended: student?.isSuspended,
    isWithdrawn: student?.isWithdrawn,
    studentId: student?.studentId,
    prefectName: student?.prefectName,
  };

  //get student exam results
  const examResults = student?.examResults;
  // currrent exam
  const currentExamResult = examResults[examResults.length - 1];
  //check if exam is published
  const isPublished = currentExamResult?.isPublished;
  console.log(currentExamResult);

  // response
  res.status(200).json({
    status: "success",
    message: "Student profile fetched successfully",
    data: {
      studentProfile,
      currentExamResult: isPublished ? currentExamResult : [],
    },
  });

  // res.status(200).json({
  //   status: "success",
  //   message: "Student profile fetched successfully",
  //   data: student,
  // });
});

// @desc    get all students
// @route   GET /api/v1/admin/students
// @access  Private/admin only

// exports.getAllStudentsAdmin = asyncHandler(async (req, res) => {
//   const students = await Student.find({}).select("-password");

//   if (!students || students.length === 0) {
//     return res.status(404).json({
//       status: "fail",
//       message: "No students found",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     message: "Students fetched successfully",
//     data: students,
//   });
// });

// @desc    Student updating profile
// @route   PUT /api/v1/students/profile/update
// @access  Private/student only
const bcrypt = require("bcryptjs");
exports.studentUpdateProfile = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  // Check if the new email already exists on another student's account
  const emailExist = await Student.findOne({ email });
  if (emailExist && emailExist._id.toString() !== req.userAuth._id.toString()) {
    throw new Error("Email already exists");
  }

  // Prepare updated fields
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
  const updatedStudent = await Student.findByIdAndUpdate(
    req.userAuth._id,
    updatedData,
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedStudent) {
    return res.status(404).json({
      status: "fail",
      message: "Student not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Student profile updated successfully",
    data: updatedStudent,
  });
});

// @desc    admin updating student eg: Assigning classes...
// @route   PUT /api/v1/students/:studentId/update/admin
// @access  Private/admin only

exports.adminUpdateStudent = asyncHandler(async (req, res) => {
  const {
    classLevels,
    academicYear,
    program,
    name,
    email,
    prefectName,
    isSuspended,
    isWithdrawn,
  } = req.body;
  //find the student by id
  const studentFound = await Student.findById(req.params.studentId);
  if (!studentFound) {
    throw new Error("Student not found");
  }
  // update
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentId,
    {
      $set: {
        academicYear,
        program,
        name,
        email,
        prefectName,
        isSuspended,
        isWithdrawn,
      },
      $addToSet: {
        classLevels: classLevels,
      },
    },
    { new: true }
  );
  // send response
  res.status(200).json({
    status: "success",
    message: "student updated successfully",
    data: studentUpdated,
  });
});

// @desc   student taking exam
// @route  post  /api/v1/students/exams/:examId/write
// @access Private Student only
exports.writeExam = asyncHandler(async (req, res) => {
  // Get student
  const studentFound = await Student.findById(req.userAuth._id);
  if (!studentFound) {
    throw new Error("Student not found");
  }

  // Get exam with populated questions
  const examFound = await Exam.findById(req.params.examId)
    .populate("questions")
    .populate("academicTerm");
  console.log(examFound);

  if (!examFound) {
    throw new Error("Exam not found");
  }

  // get questions (if needed)
  const questions = examFound.questions;
  //log answers
  const studentAnswers = req.body.answers;

  //check if student has answered all questions
  if (studentAnswers.length !== questions.length) {
    throw new Error("please answer all questions");
  }

  // check if student has already taken the exam
  const studentFoundResults = await ExamResult.findOne({
    student: studentFound._id,
  });

  if (studentFoundResults) {
    throw new Error("you have already taken this exam");
  }

  // check if student is suspended
  if (studentFound.isSuspended || studentFound.isWithdrawn) {
    throw new Error(
      "you are suspended/withdrawn, you can't writing this exam, please contact the school administration for mor information"
    );
  }

  //Build report object
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let remarks = "";
  let status = ""; //failed/pass
  let grade = 0;
  let score = 0;
  let answeredQuestions = [];

  // check for answers
  for (let i = 0; i < questions.length; i++) {
    // find the question
    const question = questions[i];
    // check if the answer is correct
    if (question.correctAnswer === studentAnswers[i]) {
      correctAnswers++; //increase correct answers
      score++;
      question.isCorrect = true;
    } else {
      wrongAnswers++; //increase wrong answers
    }
  }
  //calculate report
  totalQuestions = questions.length;
  grade = (correctAnswers / questions.length) * 100;
  answeredQuestions = questions.map((question) => {
    return {
      question: question.question,
      correctAnswers: question.correctAnswer,
      isCorrect: question.isCorrect,
    };
  });

  //calculate status
  if (grade >= 50) {
    status = "pass";
  } else {
    status = "fail";
  }

  //remarks
  if (grade >= 80) {
    remarks = "Excellent";
  } else if (grade >= 70) {
    remarks = "very good";
  } else if (grade >= 60) {
    remarks = "good";
  } else if (grade >= 50) {
    remarks = "fair";
  } else {
    remarks = "poor";
  }

  //create exam result
  const examResults = await ExamResult.create({
    studentId: studentFound.studentId,
    exam: examFound._id,
    grade,
    score,
    status,
    remarks,
    classLevel: examFound.classLevel,
    academicTerm: examFound.academicTerm,
    academicYear: examFound.academicYear,
    position: 1,
    answeredQuestions: answeredQuestions,
  });

  //push the result into
  studentFound.examResults.push(examResults._id);
  await studentFound.save();

  //promoting student to next class
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "pass" &&
    studentFound?.currentClassLevel === "level 100"
  ) {
    console.log(examFound.academicTerm);
  }
  {
    //promote student to level 200
    studentFound.classLevels.push("level 200");
    studentFound.currentClassLevel = "level 200";
    await studentFound.save();
  }

  //promote student to level 300
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "pass" &&
    studentFound?.currentClassLevel === "level 200"
  ) {
    console.log(examFound.academicTerm);
  }
  {
    //promote student to level 200
    studentFound.classLevels.push("level 300");
    studentFound.currentClassLevel = "level 300";
    await studentFound.save();
  }

  //promote student to level 400
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "pass" &&
    studentFound?.currentClassLevel === "level 300"
  ) {
    console.log(examFound.academicTerm);
  }
  {
    //promote student to level 200
    studentFound.classLevels.push("level 400");
    studentFound.currentClassLevel = "level 400";
    await studentFound.save();
  }

  //promote student to graduate
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "pass" &&
    studentFound?.currentClassLevel === "level 400"
  ) {
    console.log(examFound.academicTerm);
  }
  {
    //promote student to level 200
    studentFound.isGraduated = true;
    studentFound.yearGraduated = new Date();
    await studentFound.save();
  }

  // Send student
  res.status(200).json({
    status: "success",
    data: "you have submitted your exam. check later for the results",
  });
});
