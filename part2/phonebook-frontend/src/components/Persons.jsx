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

export default Persons;
