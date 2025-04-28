const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// ------- middlewares -------
app.use(express.static("dist"));
app.use(express.json());
// allow any cross-origin requests
// app.use(cors());
// strictly only allow requests from the origin of Vite FE app
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

morgan.token("body", function (request, response) {
  return request.body ? JSON.stringify(request.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// ------- const dummy data -------
let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
];

// ------- routes -------
app.get("/info", (request, response) => {
  response.type("html");

  const now = new Date();

  response.send(
    `
  <p>Phonebook has info for ${persons.length} people.</p>
  <p>${now.toString()}</p>
  `
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response, next) => {
  const person = persons.find((p) => p.id === request.params.id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: "person not found" });
  }
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  // check if the name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  // check if the name already exists
  const existingPerson = persons.find((p) => p.name === body.name);
  if (existingPerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  // only get name and number from the request body
  const newPerson = {
    id: (Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number,
  };

  persons.push(newPerson);
  response.json(newPerson);
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const personToDelete = persons.find((p) => p.id === id);
  if (!personToDelete) {
    return response.status(404).json({
      error: "person not found",
    });
  }
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

// // this is for updating an existing person
// app.put("/api/persons/:id", (request, response, next) => {
//   const id = request.params.id;
//   const personToUpdate = request.body;

//   Person.findByIdAndUpdate(id, personToUpdate, {
//     new: true,
//     runValidators: true,
//   })
//     .then((updatedPerson) => {
//       response.json(updatedPerson);
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

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
