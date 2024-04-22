import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  // { name: "Arto Hellas", number: "040-123456", id: 1 },
  // { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
  // { name: "Dan Abramov", number: "12-43-234345", id: 3 },
  // { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newPerson.name)) {
      alert(`${newPerson.name} is already added to phonebook`);
      return;
    }
    setPersons([...persons, { ...newPerson, id: persons.length + 1 }]);
  };

  return (
    <div>
      <div>debug: </div>
      new person name: {newPerson.name}
      <br></br>
      new person number: {newPerson.number}
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add new </h2>
      <PersonForm
        handleSubmit={handleSubmit}
        newPerson={newPerson}
        setNewPerson={setNewPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
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

const Persons = ({ persons, filter }) => {
  if (filter === "") {
    return persons.map((person) => (
      <div key={person.name}>
        {person.name} {person.number}
      </div>
    ));
  }
  return persons
    .filter((person) =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    )
    .map((person) => (
      <div key={person.name}>
        {person.name} {person.number}
      </div>
    ));
};

export default App;
