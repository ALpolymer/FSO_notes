const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://alpolymer:${password}@cluster0.gor7j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model("Note", noteSchema)

Note.find({}).then((res) => {
  console.log(res)
  mongoose.connection.close()
})

const note = new Note({
  content: "Mongoose makes things easy",
  important: true,
})

//Save note to db
note.save().then((result) => {
  console.log("note saved!")
  mongoose.connection.close()
})
