const mongoose = require("mongoose");

const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const rawBlog = request.body;
  if (!rawBlog.hasOwnProperty("likes")) {
    rawBlog.likes = 0;
  }

  if (!rawBlog.hasOwnProperty("title") || !rawBlog.hasOwnProperty("url")) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const blog = new Blog(rawBlog);
  if (process.env.NODE_ENV !== "test") {
    logger.info(blog);
  }

  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(404).json({ error: "Resource not found" });
  }

  const result = await Blog.findByIdAndDelete(id);
  if (process.env.NODE_ENV !== "test") {
    logger.info("Deleted blog with id", request.params.id);
    logger.info(result);
  }

  if (result === null) {
    return response.status(404).json({ error: "Resource not found" });
  }

  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const blogRaw = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogRaw, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
