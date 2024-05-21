const _ = require("lodash");

const dummy = (blogs) => {
  // ...
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0);
};

// const favoriteBlog = (blogs) => {
//   return blogs.reduce((fav, cur) => {
//     if (fav.likes && cur.likes > fav.likes) {
//       return cur;
//     }
//     if (!fav.likes) {
//       return cur;
//     }
//     return fav;
//   }, {});
// };

const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (fav, cur) => (cur.likes > (fav.likes || 0) ? cur : fav),
    {}
  );
};

// return an object of author with the most blogs, and the count of their blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const raw = _.countBy(blogs, "author"); // {author1: numBlogs1, author2: numBlogs2, ...}

  const transformed = _.map(raw, (numBlogs, author) => ({
    author,
    blogs: numBlogs,
  })); // [{author: author1, numBlogs: numBlogs1}, ...]

  return _.maxBy(transformed, "blogs");
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  // {author1: [blog1, blog2, ...], author2: [blog3, blog4, ...], ...}
  const groupedByAuthor = _.groupBy(blogs, "author");
  // [{author1: likes1}, {author2: likes2}, ...]
  const authorToLikes = _.map(groupedByAuthor, (blogs, author) => ({
    author,
    likes: blogs.reduce((acc, cur) => acc + cur.likes, 0),
  }));

  const authorWithMostLikes = _.maxBy(authorToLikes, "likes");

  return authorWithMostLikes;
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
