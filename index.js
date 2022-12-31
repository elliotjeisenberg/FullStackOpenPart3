const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
//app.use(express.static('build'))
morgan.token('postdata', ((req, res) => { return JSON.stringify(req.body)}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))

const mongooseURL = `mongodb+srv://fullstackmongo:fullstackmongo@phonebook.fjndpdw.mongodb.net/?retryWrites=true&w=majority`
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

mongoose.connect(mongooseURL)

app.get('/info', (request, response) => {
  console.log('info was requested')
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toJSON()}</p>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const index = persons.findIndex(p => p.id === id)
  persons[index].number = request.body.number
  response.json(persons[index])
})

const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(p => p.id))
  :0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({error: 'entry must have a name and number'})
  } else if (persons.find(p => p.name === request.body.name)) {
    return response.status(400).json({error:'name must be unique'})
  } else {
    const newPerson = {...request.body, id:generateId()}
    persons = persons.concat(newPerson)
    response.status(200).json(newPerson)
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)




const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
