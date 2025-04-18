import { useEffect, useState } from "react";
import { getWeather } from "../services/weather";

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

export default Weather;
