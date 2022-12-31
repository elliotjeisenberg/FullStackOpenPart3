const mongoose = require('mongoose')
mongoose.set("strictQuery", false);

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackmongo:${password}@cluster0.cry5xom.mongodb.net/?retryWrites=true&w=majority`

mongoose
  .connect(url)
  .then((result) => {
    const noteSchema = new mongoose.Schema({
      content: String,
      date: Date,
      important: Boolean,
    })
    
    const Note = mongoose.model('Note', noteSchema)
    console.log('hello')
    
    Note.find().then(result => {
        result.forEach(note => {
          console.log(note)
        })
        mongoose.connection.close()
      })

  }).catch((err) => console.log(err))
