const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())

let notes = []

const generateId = () => {
  const maxId =
    notes.length > 0
      ? notes.reduce((acc, curr) => Math.max(Number(curr.id), acc), 0)
      : 0
  return String(maxId + 1)
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

const PORT = 3001
app.listen(PORT)
console.log(`Server is  running on port ${PORT}`)
