const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");
const logger = require("./utils/logger");

const mongoUrl = config.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

const app = express();
app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);

module.exports = app;