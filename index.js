const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[Content-Length] :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.status(200).json(persons);
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.status(200).json(savedPerson);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.status(200).json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findOneAndDelete({ _id: request.params.id }).then((result) => {
    response.status(204).end();
  });
});

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    const htmlResponse = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `;
    response.send(htmlResponse);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
