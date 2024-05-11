import axios from "axios";

const baseURL = `https://studies.cs.helsinki.fi/restcountries/api`;
const buildAllCountriesURL = () => `${baseURL}/all`;
const buildCountryURL = (name) => `${baseURL}/name/${name}`;

const getAllCountries = () => {
  const URL = buildAllCountriesURL();
  return axios.get(URL).then((response) => response.data);
};

const getOneCountry = (countryName) => {
  const URL = buildCountryURL(countryName);
  return axios.get(URL).then((response) => response.data);
};

// const updatePerson = (id, newObject) => {
//   return axios
//     .put(`${baseURL}/${id}`, newObject)
//     .then((response) => response.data);
// };

// const deletePerson = (id) => {
//   return axios.delete(`${baseURL}/${id}`).then((response) => response.data);
// };

export { getAllCountries, getOneCountry };
