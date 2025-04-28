/*
  This script connects to a MongoDB cluster at the URL, 
  drops the database `phonebookApp`, 
  and inserts dummy data documents into the `Person` collection.
*/
require("dotenv").config();
const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// const url = process.env.MONGODB_URI;
const password = process.argv[2];
const url = `mongodb+srv://admin:${password}@cluster0.roaqgtb.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

// function to connect to the database
const connectToDatabase = () => mongoose.connect(url);

// function to drop the database
const dropDatabase = () => mongoose.connection.dropDatabase();

// function to insert dummy data
const insertDummyData = () => {
  const persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
    },
  ];
  return Person.insertMany(persons);
};

mongoose.set("strictQuery", false);
connectToDatabase()
  .then(() => {
    console.log("Connected to MongoDB. Dropping database...");
    return dropDatabase();
  })
  .then(() => {
    console.log("Database dropped. Reconnecting and inserting dummy data...");
    mongoose.connection.close(); // Close the connection to drop the database
    return connectToDatabase(); // Reconnect to ensure a fresh connection
  })
  .then(() => {
    console.log("Reconnected to MongoDB. Inserting data...");
    return insertDummyData();
  })
  .then((docs) => {
    console.log("Dummy data inserted:", docs);
  })
  .catch((err) => {
    console.error("Error during operations:", err);
  })
  .finally(() => {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  });
