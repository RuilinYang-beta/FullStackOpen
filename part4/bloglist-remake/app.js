const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogRouter = require("./controllers/blog");

const app = express();

// --- connect to DB ---
const uri = config.MONGODB_URI;
mongoose.connect(uri);

// --- middlewares ---
app.use(express.json());
app.use("/api/blogs", blogRouter);

module.exports = app;
