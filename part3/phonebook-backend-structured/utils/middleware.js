/*
 * Contains middleware definitions,
 * they are put into use in `app.js` to handle errors and unknown endpoints.
 */

// middleware functions are called in the order that they're encountered by the JavaScript engine
// Sometimes, we want to use middleware functions after routes.
// This middleware will be used for catching requests made to non-existent routes.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// If next was called without an argument, then the execution would simply move onto the next route or middleware.
// If the next function is called with an argument, then the execution will continue to the error handler middleware.
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error); // passes the error forward to the default Express error handler.
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
