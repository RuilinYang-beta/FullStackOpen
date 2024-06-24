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

export default PersonForm;
