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

export default Filter;
