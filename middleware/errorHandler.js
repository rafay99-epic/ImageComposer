const multer = require("multer");

function notFoundHandler(req, res, next) {
  res.status(404).render("pages/404", { title: "404 Not Found" });
}

function globalErrorHandler(err, req, res, next) {
  console.error("Global error handler caught an error:", {
    error: err.message,
    stack: err.stack,
  });
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).send({
        error: `Image size exceeds the ${err.limit / 1024 / 1024}MB limit.`,
      });
    }
    return res.status(400).send({ error: `File upload error: ${err.message}` });
  }

  if (err.status === 429) {
    return res.status(429).send({ error: err.message });
  }
  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(400).send({ error: err.message });
  }
  if (err.message === "Not allowed by CORS") {
    return res.status(403).send({ error: "CORS error: Request blocked" });
  }

  if (err.message === "Error processing image.") {
    return res.status(500).send({ error: "Error processing image." });
  }

  res
    .status(err.status || 500)
    .send({ error: "Something went wrong on the server." });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
