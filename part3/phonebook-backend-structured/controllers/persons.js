/*
 * Contains the route event handlers for the persons resource.
 * Note the relative path of the routes,
 * which are prefixed with "/api/persons" in the app.js file.
 */
const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => {
      next(error); // using middleware to centralize error handling
    });
});

personsRouter.get("/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error); // using middleware to centralize error handling
    });
});

// Check if the person already exists in the database, this is the safeguard on backend
personsRouter.post("/", (request, response, next) => {
  const { name, number } = request.body;

  Person.findOne({ name: name })
    .then((existingPerson) => {
      if (existingPerson) {
        existingPerson.number = number;

        return existingPerson.save().then((updatedPerson) => {
          response.json(updatedPerson);
        });
      } else {
        const person = new Person({
          name,
          number,
        });

        return person.save().then((savedPerson) => {
          response.json(savedPerson);
        });
      }
    })
    .catch((error) => {
      next(error); // using middleware to centralize error handling
    });
});

// this is for updating an existing person
personsRouter.put("/:id", (request, response, next) => {
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
      next(error); // using middleware to centralize error handling
    });
});

personsRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      console.log(result);

      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;
