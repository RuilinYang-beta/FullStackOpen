import { useEffect, useState } from "react";
import { getAllCountries, getOneCountry } from "./services/countries";
import SearchBar from "./components/SearchBar";
import Display from "./components/Display";

const api_key = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (search === "") {
      return;
    }

    getAllCountries().then((data) => {
      const filtered = data.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      );

      console.log(filtered);
      setCountries(filtered);
    });
  }, [search]);

  return (
    <>
      <SearchBar search={search} setSearch={setSearch} />
      <Display countries={countries} setCountries={setCountries} />
    </>
  );
}

export default App;
