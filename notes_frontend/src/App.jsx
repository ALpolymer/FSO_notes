import Note from "./Note.jsx"
import Notification from "./Notification.jsx"
import Footer from "./Footer.jsx"
import { useState, useEffect } from "react"
import noteService from "./services/notes.js"
const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  const addNote = (e) => {
    e.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    noteService.create(noteObject).then((returnedNote) => {
      setNotes([...notes, returnedNote])
      setNewNote("")
    })
  }

  const toggleImportanceOfNote = (id) => {
    const selectedNote = notes.find((n) => n.id === id)
    const changedNote = {
      ...selectedNote,
      important: !selectedNote.important,
    }
    noteService
      .update(id, changedNote)
      .then((returnedNote) =>
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      )
      .catch((error) => {
        setErrorMessage(
          `Note '${selectedNote.content}' was already removed from server`
        )

        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter((note) => note.id !== selectedNote.id))
        console.log(error)
      })
  }

  const handleNoteChange = (e) => {
    setNewNote(e.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true)
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show important" : "Show All"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => {
          return (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportanceOfNote(note.id)}
            />
          )
        })}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
          placeholder="add a note"
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
