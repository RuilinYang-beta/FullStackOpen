const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
// ------- middlewares -------
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

morgan.token("body", function (req, res) {
  return req.body ? JSON.stringify(req.body) : "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// ------- data -------
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = (min = 5000, max = 100000) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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

  response.send(
    `<p>Phonebook has info for ${persons.length} people.</p>
    <p>${date}, ${time}, ${timezone}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  if (persons.find((p) => p.name === person.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  person.id = generateId();

  persons = persons.concat(person);

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personToDelete = persons.find((entry) => entry.id === id);
  if (!personToDelete) {
    return response.status(404).json({ error: "Entry not found" });
  }

  persons = persons.filter((person) => person.id !== id);
  console.log(persons);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
