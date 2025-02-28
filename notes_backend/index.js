const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
  {
    id: "4",
    content: "CSS helps style web pages",
    important: true,
  },
  {
    id: "5",
    content:
      "React is a popular JavaScript library for building user interfaces",
    important: true,
  },
  {
    id: "6",
    content: "APIs allow different software applications to communicate",
    important: false,
  },
  {
    id: "7",
    content: "Local storage can be used to store data in the browser",
    important: true,
  },
  {
    id: "8",
    content: "HTTPS provides secure communication over the internet",
    important: true,
  },
  {
    id: "9",
    content: "JSON is a lightweight data interchange format",
    important: false,
  },
  {
    id: "10",
    content:
      "Responsive design ensures websites work on different screen sizes",
    important: true,
  },
]

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>")
})

app.get("/api/notes", (req, res) => {
  res.json(notes)
})

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id
  const note = notes.find((note) => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id
  notes = notes.filter((note) => note.id !== id)

  res.status(204).end()
})

app.post("/api/notes", (req, res) => {
  const maxId =
    notes.length > 0
      ? notes.reduce((acc, curr) => Math.max(Number(curr.id), acc), 0)
      : 0
  const note = req.body
  note.id = String(maxId)
  console.log(note)
  res.json(note)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server is  running on port ${PORT}`)
