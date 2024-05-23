const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");

const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

// describe("when there is initially some blogs saved", () => {
//   beforeEach(async () => {
//     await helper.populateDummyData();
//   });

//   test("blogs are returned as json", async () => {
//     await api
//       .get("/api/blogs")
//       .expect(200)
//       .expect("Content-Type", /application\/json/);
//   });

//   test("count of blogs returned is correct", async () => {
//     const response = await api.get("/api/blogs");

//     assert.strictEqual(response.body.length, helper.initialBlogs.length);
//   });

//   test("unique identifier property of the blog posts is named id", async () => {
//     const response = await api.get("/api/blogs");

//     assert(response.body[0].id);
//     assert.ok(
//       !("_id" in response.body[0]),
//       "The object should not have the '_id' property"
//     );
//   });
// });

describe("authenticated user insert a new blog post", () => {
  let token;

  beforeEach(async () => {
    await helper.populateDummyData();
    token = await helper.getJwtOfUser();
  });

  test("insert a valid blog post will cause the count of blog to increase by 1", async () => {
    const newBlog = {
      title: "New Blog Post",
      author: "John Doe",
      url: "https://www.example.com",
      likes: 10,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert("user" in response.body, "User property is missing in the response");

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    assert.ok(titles.includes("New Blog Post"));
  });

  test("if likes property is missing, it will default to 0", async () => {
    const newBlog = {
      title: "New Blog Post",
      author: "John Doe",
      url: "https://www.example.com",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0);
  });

  test("if title or url property is missing, return 400 Bad Request", async () => {
    const newBlog = {
      author: "John Doe",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect((res) => {
        if (!res.body.error.includes("missing")) {
          throw new Error('Expected error message to contain "certain string"');
        }
      });
  });
});

// describe("deleting a specific blog post", () => {
//   beforeEach(async () => {
//     await Blog.deleteMany({});

//     const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
//     const promiseArray = blogObjects.map((blog) => blog.save());
//     await Promise.all(promiseArray);
//   });

//   test("succeeds with status code 204 if id is valid", async () => {
//     const blogsAtStart = await helper.blogsInDb();
//     const blogToDelete = blogsAtStart[0];

//     await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

//     const blogsAtEnd = await helper.blogsInDb();

//     assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

//     const titles = blogsAtEnd.map((r) => r.title);
//     assert(!titles.includes(blogToDelete.title));
//   });

//   test("fails with status code 404 if id is invalid", async () => {
//     const invalidID = "5a3d5da59071a82a3445999";

//     await api
//       .delete(`/api/blogs/${invalidID}`)
//       .expect(404)
//       .expect((res) => {
//         if (res.body.error !== "Resource not found") {
//           throw new Error('Expected error message to be "Resource not found"');
//         }
//       });
//   });
// });

// describe("update a specific blog post", () => {
//   beforeEach(async () => {
//     await helper.populateDummyData();
//   });

//   test("succeeds with status code 200 if id is valid", async () => {
//     const blogsAtStart = await helper.blogsInDb();
//     const blogToUpdate = blogsAtStart[0];

//     const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

//     const response = await api
//       .put(`/api/blogs/${blogToUpdate.id}`)
//       .send(updatedBlog)
//       .expect(200);

//     assert.deepStrictEqual(response.body, updatedBlog);
//   });
// });

after(async () => {
  await mongoose.connection.close();
});
