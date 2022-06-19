const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Connecting to the database...')

mongoose
  .connect(url)
  .then((result) => {
    console.log('Connection Successful.')
  })
  .catch((error) => {
    console.log('error connecting to the database: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
  date: Date,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
