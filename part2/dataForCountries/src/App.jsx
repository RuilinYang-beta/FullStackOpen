import { useEffect, useState } from "react";
import { getAllCountries, getOneCountry } from "./services/countries";
import { getWeather } from "./services/weather";

const api_key = import.meta.env.VITE_WEATHER_API_KEY;

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

const Display = ({ countries, setCountries }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length === 1) {
    const country = countries[0];
    return <SingleCountry country={country} />;
  }

  return (
    <div>
      <table>
        <tbody>
          {countries.map((country) => (
            <tr key={country.name.common}>
              <td>{country.name.common}</td>
              <td>
                <button onClick={() => setCountries([country])}>show</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SingleCountry = ({ country }) => {
  const languages = Object.values(country.languages);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital[0]}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} width="100" />
      <Weather country={country} />
    </div>
  );
};

const Weather = ({ country }) => {
  const [info, setInfo] = useState({
    temperature: "",
    sunrise: "",
    sunset: "",
  });

  const [lat, long] = country.latlng;

  useEffect(() => {
    getWeather(lat, long, api_key).then((data) => {
      setInfo({
        temperature: data.current_observation.condition.temperature,
        sunrise: data.current_observation.astronomy.sunrise,
        sunset: data.current_observation.astronomy.sunset,
      });
    });
  }, [country]);

  return (
    <div>
      <h3>Weather in {country.capital[0]}</h3>
      <p>
        <strong>temperature:</strong>
        {info.temperature ? (
          <> {info.temperature} Fahrenheit</>
        ) : (
          <>loading...</>
        )}
      </p>
      <p>
        <strong>sunrise:</strong>{" "}
        {info.sunrise ? <> {info.sunrise} </> : <>loading...</>}
      </p>
      <p>
        <strong>sunset:</strong>{" "}
        {info.sunset ? <> {info.sunset} </> : <>loading...</>}
      </p>
    </div>
  );
};

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
