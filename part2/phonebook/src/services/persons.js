import axios from "axios";

const baseURL = "http://localhost:3001/persons";

const getAllPersons = () => {
  return axios.get(baseURL).then((response) => response.data);
};

const createPerson = (newObject) => {
  return axios.post(baseURL, newObject).then((response) => response.data);
};

const updatePerson = (id, newObject) => {
  return axios
    .put(`${baseURL}/${id}`, newObject)
    .then((response) => response.data);
};

export { getAllPersons, createPerson, updatePerson };
