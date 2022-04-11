const express = require('express')
const { reset } = require('nodemon')
const app = express()
const data = require('./db.json')

app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(data)
})

app.get('/info', (request, response) => {
  response.send(
    `Phonebook has info for ${
      data.persons.length
    } people <br /> <br />${new Date()}`
  )
  response.send(``)
})

app.get('/api/persons/:id', (request, response) => {
  const id = +request.params.id
  const thePerson = data.persons.find((person) => person.id === id)

  if (thePerson) {
    response.json(thePerson)
  } else {
    response.status(404).send('Person not found...')
  }
})

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

const PORT = 5000
app.listen(PORT, () => console.log('Server running fine bitch'))
