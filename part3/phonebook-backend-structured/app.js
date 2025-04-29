/*
 * This file contains the application logic:
 * - connects to the MongoDB database
 * - Sets up middleware for handling requests
 * - import and use the router for handling requests
 * - handles errors
 * - exports the app for use in other modules
 */
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const config = require("./utils/config");
const Person = require("./models/person");
const personsRouter = require("./controllers/persons");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

const app = express();

// ------- connect DB -------
mongoose.set("strictQuery", false);

const url = config.MONGODB_URI;
logger.info("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

// ------- middlewares -------
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

morgan.token("body", function (request, response) {
  return request.body ? JSON.stringify(request.body) : "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// `personsRouter` is now a middleware
app.use("/api/persons", personsRouter);

app.get("/info", (request, response) => {
  response.type("html");

  const now = new Date();

  Person.countDocuments({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people.</p>
      <p>${now.toString()}</p>`
      );
    })
    .catch((error) => {
      console.error("Error counting documents:", error);
      response.send(
        ```
      <p>Phonebook has info for 0 people.</p>
      <p>${now.toString()}</p>
      ```
      );
    });
});

// ------- error -------
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
