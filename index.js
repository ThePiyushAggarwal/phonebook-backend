const express = require('express')
const app = express()
const data = require('./db.json')
const morgan = require('morgan')
const cors = require('cors')

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

// root
app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1>')
})

// GET all
app.get('/api/persons', (request, response) => {
  response.json(data)
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

// GET particular
app.get('/api/persons/:id', (request, response) => {
  const id = +request.params.id
  const thePerson = data.persons.find((person) => person.id === id)

  if (thePerson) {
    response.json(thePerson)
  } else {
    response.status(404).send('Person not found...')
  }
})

// DELETE
app.delete('/api/persons/:id', (request, response) => {
  const id = +request.params.id
  const found = data.persons.some((person) => person.id === id)
  if (found) {
    data.persons = data.persons.filter((person) => person.id !== id)
    response.send('Person deleted from database')
  } else {
    response.send('Person to be deleted not found in the database')
  }
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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running fine bitch at ${PORT} `))
