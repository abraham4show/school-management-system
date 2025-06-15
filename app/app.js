const express = require("express");
const morgan = require("morgan");
const adminRouter = require("../routes/academics/staff/adminRouter");
const academicYearRouter = require("../routes/academics/academicYear");
const academicTermRouter = require("../routes/academics/academicTerm");
const classLevelRouter = require("../routes/academics/classLevel");
const programRouter = require("../routes/academics/program");
const subjectRouter = require("../routes/academics/subject");
const yearGroupRouter = require("../routes/academics/yearGroup");
const teacherRouter = require("../routes/academics/staff/teacherRouter");
const studentRouter = require("../routes/student/studentRouter");
const examRouter = require("../routes/academics/examRouter");
const questionRouter = require("../routes/academics/QuestionRouter");
const examResultRouter = require("../routes/academics/examResults");

const {
  globalErrorHandler,
  notFoundError,
} = require("../middlewares/errorHandler");
//const examRouter = require("../routes/academics/examRoute");
//const yearGroupRouter = require("../routes/academics/yearGroup");

const app = express();

// Middleware
app.use(morgan("dev"));
// Add this request logger middleware here:

app.use(express.json());

// Mount routes
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/academic-years", academicYearRouter);
app.use("/api/v1/academic-terms", academicTermRouter);
app.use("/api/v1/class-levels", classLevelRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/year-groups", yearGroupRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/exam-results", examResultRouter);

// Error middlewares
app.use(notFoundError);
app.use(globalErrorHandler);

module.exports = app;
