const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url = `mongodb+srv://admin:${password}@cluster0.eakyx.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
  date: Date,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name: name,
    phone: phone,
    date: new Date(),
  })

  person.save().then((result) => {
    console.log(`added ${name} number ${phone} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note.name, note.phone)
    })

    mongoose.connection.close()
  })
}
