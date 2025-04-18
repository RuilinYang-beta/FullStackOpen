require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

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

// ------- routes -------
app.get("/info", (request, response) => {
  response.type("html");

  const now = new Date();
  const date = now.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", { hour12: false });
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  Person.countDocuments({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people.</p>
      <p>${date}, ${time}, ${timezone}</p>`
      );
    })
    .catch((error) => {
      console.error("Error counting documents:", error);
      response.send(
        `<p>Phonebook has info for 0 people.</p>
      <p>${date}, ${time}, ${timezone}</p>`
      );
    });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error); // using middleware to handle errors
    });
});

/*
  One year ago I wrote: 
  this is exclusively for adding new person, 
  because for updating person FE will send PUT request. 

  But now I know here we should also check if the person already exists in the database,
  because this is the safeguard on backend, 
  eg. user can add duplicate Person via REST client, thus escape FE validation

  // TODO: check if the person already exists in the database, this is the safeguard on backend
*/
app.post("/api/persons", (request, response, next) => {
  const person = request.body;

  const personToAdd = new Person(person);
  personToAdd
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

// this is for updating an existing person
app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const personToUpdate = request.body;

  Person.findByIdAndUpdate(id, personToUpdate, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      console.log(result);

      response.status(204).end();
    })
    .catch((error) => next(error));
});

// middleware functions are called in the order that they're encountered by the JavaScript engine
// Sometimes, we want to use middleware functions after routes.
// This middleware will be used for catching requests made to non-existent routes.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

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

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
