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

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.status(200).json(persons);
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.status(200).json(savedPerson);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.status(200).json(person);
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.status(200).json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      const htmlResponse = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `;
      response.send(htmlResponse);
    })
    .catch((err) => next(err));
});

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    response.status(400).send({ error: "malformed id" });
  } else if (error.name === "ValidationError") {
    response.status(400).send({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
