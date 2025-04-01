const express = require("express")
const Note = require("./models/note")
const app = express()

app.use(express.static("dist"))
app.use(express.json())

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
  {
    id: "6",
    content:
      "Middleware functions have access to the request and response objects",
    important: true,
  },
]

const checkNoteExists = (id) => {
  return notes.some((n) => n.id === id)
}

const toggleImportantNotes = (id) => {
  return notes.map((n) => (n.id === id ? { ...n, important: !n.important } : n))
}

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>")
})

/*
 * DB GET ALL NOTES
 */
app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

/*
 * DB GET ONE NOTE
 */
app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => next(err))
})

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id
  notes = notes.filter((note) => note.id !== id)

  res.status(204).end()
})

/*
 * DB POST NOTE
 */
app.post("/api/notes", (req, res) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then((savedNote) => {
    res.json(savedNote)
  })
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

/*
 * Error Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server is  running on port ${PORT}`)
