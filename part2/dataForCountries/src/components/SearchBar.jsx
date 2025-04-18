const SearchBar = ({ search, setSearch }) => {
  return (
    <div>
      find countries{" "}
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
    </div>
  );
};

export default SearchBar;
