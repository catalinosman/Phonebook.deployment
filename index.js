const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "front")));

morgan.token("postData", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use("/", (req, res, next) => {
  next();
});

app.get("/api", (request, response) => {
  response.send("<h1>Fullstack Helsinki Course</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: "Person not found" });
  }
});

app.get("/info", (request, response) => {
  const currentTime = new Date();
  const numPersons = persons.length;
  response.send(
    `<p>Phonebook has info for ${numPersons} people</p><p>${currentTime}</p>`
  );
});

const generateId = () => {
  let newId;
  do {
    newId = Math.floor(Math.random() * 10000);
  } while (persons.some((person) => person.id === newId));
  return newId;
};
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number is missing",
    });
  }

  const existingPerson = persons.find((person) => person.name === body.name);
  if (existingPerson) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* const PORT = 3001;
app.listen(PORT); 
console.log(`Server running on port ${PORT}`); */
