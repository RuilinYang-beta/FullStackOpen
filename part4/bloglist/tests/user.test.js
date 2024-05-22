const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");

const User = require("../models/user");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

describe("create a new user", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("create a valid user will lead to the count of users increment by 1", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "john_doe",
      name: "John Doe",
      password: "password",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    assert.strictEqual(response.body.username, newUser.username);
  });

  test("create user with existing username will not succeed", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "john_doe",
      name: "John Doe",
      password: "password",
    };

    await api.post("/api/users").send(newUser).expect(201);

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    assert(response.body.error.includes("Username already exists"));
  });

  test("create user without username will not succeed", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "John Doe",
      password: "password",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    assert(
      response.body.error.includes(
        "Both username and password must be provided"
      )
    );
  });

  test("create user without password will not succeed", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "john_doe",
      name: "John Doe",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    assert(
      response.body.error.includes(
        "Both username and password must be provided"
      )
    );
  });

  test("create user with username length less than 3 will not succeed", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "jo",
      name: "John Doe",
      password: "password",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    assert(
      response.body.error.includes(
        "Username and password must be at least 3 characters long"
      )
    );
  });

  test("create user with password length less than 3 will not succeed", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "john_doe",
      name: "John Doe",
      password: "pa",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    assert(
      response.body.error.includes(
        "Username and password must be at least 3 characters long"
      )
    );
  });
});

// describe("deleting a specific blog post", () => {
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
