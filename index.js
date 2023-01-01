require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('postdata', ((req, res) => { return JSON.stringify(req.body)}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))

const Person = require('./models/person')

app.get('/info', (request, response, next) => {
  Person.find({})
  .then(result => {
    response.send(`<p>Phonebook has info for ${result.length} people</p><p>${new Date().toJSON()}</p>`)
  })
  .catch(err => next(err))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const person = Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {

  const updatedNumber = {
    number: request.body.number
  }

  Person.findByIdAndUpdate(request.params.id, updatedNumber, {new: true, runValidators: true})
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(err => next(err))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const newPerson = new Person({
      name: body.name,
      number: body.number
    })

    newPerson.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformed id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }
  next(error)
}
app.use(errorHandler)




const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
