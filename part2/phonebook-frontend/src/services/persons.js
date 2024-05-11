import axios from "axios";

// diff modes to run the app
// 1. run with dummy backend powered by json-server,
//    baseURL = http://localhost:3001/persons
// 2. [deprecated] ~~run as a frontend-only repo, test with node.js backend in part3/phonebook-backend,~~
//    ~~baseURL = http://localhost:3001/api/persons~~
// 3. run as part of backend, build -> copy build folder to part3/phonebook-backend -> run node.js backend,
//    baseURL = /api/persons

const baseURL = `/api/persons`; // works for both 1 and 3, see `part2/phonebook-frontend/vite.config.js`

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

const deletePerson = (id) => {
  return axios.delete(`${baseURL}/${id}`).then((response) => response.data);
};

export { getAllPersons, createPerson, updatePerson, deletePerson };
