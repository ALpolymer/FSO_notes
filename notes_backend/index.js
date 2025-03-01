const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())

let notes = [
  {
    id: "1",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: false,
  },
  {
    id: "2",
    content: "Express makes it easy to create REST APIs",
    important: true,
  },
  {
    id: "3",
    content: "CORS is needed for allowing cross-origin requests",
    important: true,
  },
  {
    id: "4",
    content: "Environment variables can be accessed through process.env",
    important: false,
  },
  {
    id: "5",
    content:
      "Middleware functions have access to the request and response objects",
    important: true,
  },
]

const generateId = () => {
  const maxId =
    notes.length > 0
      ? notes.reduce((acc, curr) => Math.max(Number(curr.id), acc), 0)
      : 0
  return String(maxId + 1)
}

const checkNoteExists = (id) => {
  return notes.some((n) => n.id === id)
}

const toggleImportantNotes = (id) => {
  return notes.map((n) => (n.id === id ? { ...n, important: !n.important } : n))
}

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
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    })
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
  }

  notes = [...notes, note]

  res.json(note)
})

app.put("/api/notes/:id", (req, res) => {
  const id = req.params.id

  const exists = checkNoteExists(id)
  if (!exists) {
    return res.status(404).json({ error: `Note with id: ${id} not found` })
  }
  notes = toggleImportantNotes(id)

  const updatedNote = notes.find((note) => note.id === id)

  res.json(updatedNote)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server is  running on port ${PORT}`)
