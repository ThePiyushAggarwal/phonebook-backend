require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/phonebookModel')

app.use(cors())

//json-parser
app.use(express.json())

app.use(express.static('./build'))

//morgan bitch
morgan.token('type', (request) => {
  return JSON.stringify(request.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :type')
)

// GET all
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => response.json(persons))
})

// info
app.get('/info', (request, response) => {
  response.send(
    `Phonebook has info for ${
      data.persons.length
    } people <br /> <br />${new Date()}`
  )
  response.send(``)
})

// DELETE
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error))
})

// Generate new id for new entries
const generateId = () => {
  const randomId = (Math.random() * 10000000).toFixed(0)
  return randomId
}

//CREATE
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name && body.phone) {
    if (
      data.persons.some(
        (person) => person.name.toLowerCase() === body.name.trim().toLowerCase()
      )
    ) {
      response.send(`Person with the name ${body.name} already exists`)
    } else {
      const newPerson = {
        id: generateId(),
        name: body.name,
        phone: body.phone,
      }

      data.persons = data.persons.concat(newPerson)
      response.send(`Person added <br /> ${JSON.stringify(data)}`)
    }
  } else {
    response.send('please enter name as well as phone')
  }
})

// Update the phone number
app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  console.log(body)
  const person = {
    name: body.name,
    phone: body.phone,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updated) => response.json(updated))
    .catch((error) => console.log(error))
})

//Error Handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

// this has to be the last loaded middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running fine bitch at ${PORT} `))
