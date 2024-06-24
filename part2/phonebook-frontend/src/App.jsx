import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

import {
  getAllPersons,
  createPerson,
  updatePerson,
  deletePerson,
} from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState({ success: "", failure: "" });

  useEffect(() => {
    getAllPersons().then((initialPersons) => {
      const hardCodedPerson = {
        name: "hardcoded",
        number: "123",
        id: 999,
      };
      setPersons([...initialPersons, hardCodedPerson]);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // update an existing person
    if (persons.some((person) => person.name === newPerson.name)) {
      const existingPerson = persons.find(
        (person) => person.name === newPerson.name
      );

      const replace = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      );
      if (replace) {
        updatePerson(existingPerson.id, newPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.name !== returnedPerson.name ? person : returnedPerson
              )
            );
            setMessage({ ...message, success: `Updated ${newPerson.name}` });
          })
          .catch((error) => {
            setMessage({
              ...message,
              failure: `Error updating ${newPerson.name}, ${error.response.data.error}}`,
            });
          })
          .finally(() => {
            setTimeout(() => {
              setMessage({ success: "", failure: "" });
            }, 3000);
          });
      }
      return;
    }

    // create a new person
    createPerson(newPerson)
      .then((returnedPerson) => {
        setPersons([...persons, returnedPerson]);
        setMessage({ ...message, success: `Added ${newPerson.name}` });
      })
      .catch((error) => {
        setMessage({
          ...message,
          failure: `Error adding ${newPerson.name}, ${error.response.data.error}}`,
        });
      })
      .finally(() => {
        setTimeout(() => {
          setMessage({ success: "", failure: "" });
        }, 3000);
      });
  };

  // delete a person
  const handleDelete = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name} ?`)) {
      deletePerson(id)
        .then(() => {
          setMessage({ ...message, success: `Deleted ${person.name}` });
        })
        .catch((error) => {
          setMessage({
            ...message,
            failure: `${person.name} already deleted on server side.`,
          });

          console.log(error);
        })
        .finally(() => {
          setPersons(persons.filter((person) => person.id !== id));

          setTimeout(() => {
            setMessage({ success: "", failure: "" });
          }, 3000);
        });
    }
  };

  return (
    <div>
      <div>debug: </div>
      new person name: {newPerson.name}
      <br></br>
      new person number: {newPerson.number}
      <Notification message={message} />
      <br></br>
      <h1>Phonebook</h1>
      <Filter filter={filter} setFilter={setFilter} />
      <h1>Add new </h1>
      <PersonForm
        handleSubmit={handleSubmit}
        newPerson={newPerson}
        setNewPerson={setNewPerson}
      />
      <h1>Numbers</h1>
      <Persons
        persons={persons}
        filter={filter}
        handleDelete={(id) => handleDelete(id)}
      />
    </div>
  );
};

export default App;
