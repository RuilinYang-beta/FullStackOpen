const blogsRouter = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");
const helper = require("../tests/test_helper"); // temp

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  // getting user info from jwt
  let decodedToken;
  try {
    decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  } catch (error) {
    console.log(error);

    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const rawBlog = request.body;

  // validation that it has title and url
  if (!rawBlog.hasOwnProperty("title") || !rawBlog.hasOwnProperty("url")) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const blog = new Blog({
    title: rawBlog.title,
    url: rawBlog.url,
    author: rawBlog.author,
    likes: rawBlog.likes || 0,
    user: user._id,
  });
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
