const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    author: "Alice",
    title: "Understanding JavaScript Closures",
    likes: 45,
    url: "http://example1.com",
  },
  {
    author: "Bob",
    title: "A Guide to Responsive Web Design",
    likes: 62,
    url: "http://example2.com",
  },
  {
    author: "Alice",
    title: "Deep Dive into React Hooks",
    likes: 30,
    url: "http://example3.com",
  },
  {
    author: "Charlie",
    title: "Introduction to Node.js",
    likes: 28,
    url: "http://example4.com",
  },
  {
    author: "Bob",
    title: "CSS Grid Layouts: A Comprehensive Guide",
    likes: 56,
    url: "http://example5.com",
  },
  {
    author: "David",
    title: "Building RESTful APIs with Express",
    likes: 39,
    url: "http://example6.com",
  },
  {
    author: "Alice",
    title: "Asynchronous Programming in JavaScript",
    likes: 74,
    url: "http://example7.com",
  },
  {
    author: "Eve",
    title: "Getting Started with TypeScript",
    likes: 50,
    url: "http://example8.com",
  },
  {
    author: "Charlie",
    title: "Mastering MongoDB for Web Development",
    likes: 33,
    url: "http://example9.com",
  },
  {
    author: "David",
    title: "Testing JavaScript Applications",
    likes: 29,
    url: "http://example10.com",
  },
  {
    author: "Bob",
    title: "Webpack: A Beginner's Guide",
    likes: 47,
    url: "http://example11.com",
  },
  {
    author: "Eve",
    title: "JavaScript ES6 Features You Should Know",
    likes: 53,
    url: "http://example12.com",
  },
];

// const nonExistingId = async () => {
//   const note = new Note({ content: "willremovethissoon" });
//   await note.save();
//   await note.deleteOne();

//   return note._id.toString();
// };

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  // nonExistingId,
};
