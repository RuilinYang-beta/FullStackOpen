import Weather from "./Weather";

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
      {/* <Weather country={country} /> */}
    </div>
  );
};

export default Display;
