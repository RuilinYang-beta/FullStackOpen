const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
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

const initialUsers = [
  {
    username: "user1234",
    name: "Alice Johnson",
    password: "pass5678",
  },
  {
    username: "user5678",
    name: "Bob Smith",
    password: "secret9876",
  },
  {
    username: "user91011",
    name: "Charlie Brown",
    password: "mypassword12",
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

const populateInitBlogs = async () => {
  await Blog.deleteMany({});

  const users = await usersInDb();

  // each blog -> get random use -> save blog -> get blog id from returned blog -> update user with blog id
  for (const blog of initialBlogs) {
    try {
      const randomIndex = Math.floor(Math.random() * users.length);
      const userJSON = users[randomIndex];
      blog.user = userJSON.id;
      const returnedBlog = await new Blog(blog).save();

      const userObj = await User.findById(userJSON.id);
      userObj.blogs = userObj.blogs.concat(returnedBlog._id);

      await userObj.save();
    } catch (error) {
      console.error("Error saving blog or updating user:", error);
    }
  }
};

const populateInitUsers = async () => {
  await User.deleteMany({});

  const userObjects = await Promise.all(
    initialUsers.map(async (user) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(user.password, saltRounds);

      return new User({
        username: user.username,
        name: user.name,
        passwordHash,
      });
    })
  );
  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
};

const populateDummyData = async () => {
  await populateInitUsers();
  await populateInitBlogs();
};

const getJwtOfRandomUser = async () => {
  const user = await User.findOne({});

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  return jwt.sign(userForToken, process.env.SECRET);
};

const getJwtOfUser = async ({ username, userId }) => {
  let user;
  if (userId) {
    user = await User.findById(userId);
  } else {
    user = await User.findOne({ username: username });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  return jwt.sign(userForToken, process.env.SECRET);
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  // nonExistingId,
  initialUsers,
  populateDummyData,
  getJwtOfUser,
  getJwtOfRandomUser,
};
