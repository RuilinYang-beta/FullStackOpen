const mongoose = require("mongoose");

if (process.argv.length !== 5 && process.argv.length !== 3) {
  console.log(
    "Usage: node mongo.js <password> <name> <number> | node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://admin:${password}@cluster0.roaqgtb.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");

    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
  return;
}

// currently allowing duplicate entries, allowing
if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log(result._id);
    console.log(`added ${name} number ${number} to phonebook`);

    mongoose.connection.close();
  });
  return;
}
