const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
];

const listWithTwoBlogs = [
  ...listWithOneBlog,
  {
    _id: "5a422aa71b54a676234d17f7",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 1,
    __v: 0,
  },
];

const listWithThreeBlogs = [
  ...listWithTwoBlogs,
  {
    _id: "5a422aa71b54a676234d17f6",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 12,
    __v: 0,
  },
];

const blogs = [
  { author: "Alice", title: "Understanding JavaScript Closures", likes: 45 },
  { author: "Bob", title: "A Guide to Responsive Web Design", likes: 62 },
  { author: "Alice", title: "Deep Dive into React Hooks", likes: 30 },
  { author: "Charlie", title: "Introduction to Node.js", likes: 28 },
  {
    author: "Bob",
    title: "CSS Grid Layouts: A Comprehensive Guide",
    likes: 56,
  },
  { author: "David", title: "Building RESTful APIs with Express", likes: 39 },
  {
    author: "Alice",
    title: "Asynchronous Programming in JavaScript",
    likes: 74,
  },
  { author: "Eve", title: "Getting Started with TypeScript", likes: 50 },
  {
    author: "Charlie",
    title: "Mastering MongoDB for Web Development",
    likes: 33,
  },
  { author: "David", title: "Testing JavaScript Applications", likes: 29 },
  { author: "Bob", title: "Webpack: A Beginner's Guide", likes: 47 },
  {
    author: "Eve",
    title: "JavaScript ES6 Features You Should Know",
    likes: 53,
  },
];

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("when list is empty, sum is 0", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("list with two blogs", () => {
    const result = listHelper.totalLikes(listWithTwoBlogs);
    assert.strictEqual(result, 6);
  });

  test("list with three blogs", () => {
    const result = listHelper.totalLikes(listWithThreeBlogs);
    assert.strictEqual(result, 18);
  });
});

describe("favorite blog", () => {
  test("when list is empty, return empty object", () => {
    const result = listHelper.favoriteBlog([]);
    assert.deepStrictEqual(result, {});
  });

  test("when list has only one blog, equals the likes of that blog", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    assert.strictEqual(result, listWithOneBlog[0]);
  });

  test("list with three blogs", () => {
    const result = listHelper.favoriteBlog(listWithThreeBlogs);
    assert.deepStrictEqual(result, listWithThreeBlogs[2]);
  });
});

describe("most blogs", () => {
  test("when list is empty, return empty object", () => {
    const result = listHelper.mostBlogs([]);
    assert.deepStrictEqual(result, {});
  });

  test("when list has only one blog, return the author of that blog", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", blogs: 1 });
  });

  test("list with three blogs", () => {
    const result = listHelper.mostBlogs(listWithThreeBlogs);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", blogs: 3 });
  });

  test("list with multiple blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, { author: "Alice", blogs: 3 });
  });
});

describe("most likes", () => {
  test("when list is empty, return empty object", () => {
    const result = listHelper.mostLikes([]);
    assert.deepStrictEqual(result, {});
  });

  test("when list has only one blog, return the author of that blog", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 5 });
  });

  test("list with three blogs", () => {
    const result = listHelper.mostLikes(listWithThreeBlogs);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 18 });
  });

  test("list with multiple blogs", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, { author: "Bob", likes: 165 });
  });
});
