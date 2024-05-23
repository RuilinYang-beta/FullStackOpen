const blogsRouter = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");
const logger = require("../utils/logger");
const helper = require("../tests/test_helper"); // temp

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

// can only post with jwt token
blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  let user;
  try {
    user = await User.findById(request.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }

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

// can only delete with jwt token
// can only delete if the blog is created by the user
blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    try {
      const user = await User.findById(request.user.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Validate the ID format
      const { id } = request.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Invalid blog id" });
      }

      // validate user is the creator of the blog
      const toDelete = await Blog.findById(id);
      if (!toDelete) {
        return response.status(404).json({ error: "Resource not found" });
      }

      if (toDelete.user.toString() !== user._id.toString()) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      if (process.env.NODE_ENV !== "test") {
        logger.info("Deleted blog with id", request.params.id);
        logger.info(toDelete);
      }

      await Blog.findByIdAndDelete(id);
      response.status(204).end();
    } catch (error) {
      console.log(error);

      response.status(500).json({ error: "Internal Server Error" });
    }
  }
);

blogsRouter.put("/:id", async (request, response) => {
  const blogRaw = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogRaw, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
