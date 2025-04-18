const express = require("express");
const path = require("path");

const configureMiddleware = require("./config/middleware");
const configureViewEngine = require("./config/viewEngine");
const {
  notFoundHandler,
  globalErrorHandler,
} = require("./middleware/errorHandler");

const indexRoutes = require("./routes/routes");
const imageRoutes = require("./routes/image");

const app = express();
const port = process.env.PORT || 3000;

configureViewEngine(app);

configureMiddleware(app);

app.use("/", indexRoutes);
app.use("/", imageRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
