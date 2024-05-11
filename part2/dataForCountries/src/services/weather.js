import axios from "axios";

const getWeather = (lat, long, api_key) => {
  const options = {
    method: "GET",
    url: "https://yahoo-weather5.p.rapidapi.com/weather",
    params: {
      lat,
      long,
      format: "json",
      u: "f",
    },
    headers: {
      "X-RapidAPI-Key": api_key,
      "X-RapidAPI-Host": "yahoo-weather5.p.rapidapi.com",
    },
  };

  return axios.request(options).then((response) => response.data);
};

export { getWeather };
