import { useState, useEffect } from "react";

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
            setTimeout(() => {
              setMessage({ success: "", failure: "" });
            }, 3000);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      return;
    }

    // create a new person
    createPerson(newPerson).then((returnedPerson) => {
      setPersons([...persons, returnedPerson]);

      setMessage({ ...message, success: `Added ${newPerson.name}` });
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

const Filter = ({ filter, setFilter }) => {
  return (
    <>
      filter by name{" "}
      <input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </>
  );
};

const PersonForm = ({ handleSubmit, newPerson, setNewPerson }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        {"name:   "}
        <input
          value={newPerson.name}
          onChange={(event) =>
            setNewPerson({ ...newPerson, name: event.target.value })
          }
        />
      </div>
      <div>
        {"number: "}
        <input
          value={newPerson.number}
          onChange={(event) =>
            setNewPerson({ ...newPerson, number: event.target.value })
          }
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, filter, handleDelete }) => {
  if (filter === "") {
    return (
      <table>
        <tbody>
          {persons.map((person) => (
            <Person
              key={person.name}
              person={person}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <table>
      <tbody>
        {persons
          .filter((person) =>
            person.name.toLowerCase().includes(filter.toLowerCase())
          )
          .map((person) => (
            <Person
              key={person.name}
              person={person}
              handleDelete={handleDelete}
            />
          ))}
      </tbody>
    </table>
  );
};

const Person = ({ person, handleDelete }) => {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.number}</td>
      <td>
        <button onClick={() => handleDelete(person.id)}>Delete</button>
      </td>
    </tr>
  );
};

const Notification = ({ message }) => {
  return (
    (message.success || message.failure) && (
      <div className={message.success ? "success" : "failure"}>
        {message.success || message.failure}
      </div>
    )
  );
};

export default App;
