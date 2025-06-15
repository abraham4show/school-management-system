//status

//message

//stack
const globalErrorHandler = (err, req, res, next) => {
  const stack = err.stack;
  const message = err.message;
  const status = err.status ? err.status : "failed";
  const statusCode = err.statusCode ? err.statusCode : 500;

  // Log detailed error info to console
  console.error("--- Global Error Handler ---");
  console.error("Status Code:", statusCode);
  console.error("Status:", status);
  console.error("Message:", message);
  console.error("Stack:", stack);
  console.error("Request Method:", req.method);
  console.error("Request URL:", req.originalUrl);
  console.error("Request Headers:", req.headers);
  console.error("Request Body:", req.body);

  res.status(statusCode).json({ message, status, stack });
};

// not found
// middlewares/errorHandler.js (or wherever your error handler is)
const notFoundError = (req, res, next) => {
  console.log("404 Error - Route not found:");
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);

  const error = new Error(`can't find ${req.originalUrl} on the server`);
  res.status(404).json({
    status: "failed",
    message: error.message,
    stack: error.stack,
  });
};

module.exports = { globalErrorHandler, notFoundError };
