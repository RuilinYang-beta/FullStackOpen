import axios from "axios";

// ------ 1. (deprecated) run with dummy backend powered by json-server, ------
// see `package.json` of this repo
// const baseURL = "http://localhost:3001/persons";

// ------ 2. run as a frontend-only repo, ------
// need to start node.js backend separately
// (part3/phonebook-backend or part3/phonebook-backend-dummy)
// const baseURL = "http://localhost:3001/api/persons";

// ------ 3. run as part of backend, ------
// build -> copy build folder to part3/phonebook-backend
// (deploy BE) -> run node.js backend
// because it's not a part of BE, the request goes to the same origin
// so we only need relative path
const baseURL = `/api/persons`;

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
