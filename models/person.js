const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch((error) => {
    console.log('error connecting to mongodb', error)
  })

const personSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: (v) => {
        return /\d{2,3}-\d+/.test(v)
      },
      message: (props) => `${props.value} is not a valid number`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

personSchema.plugin(uniqueValidator)
module.exports = new mongoose.model('Person', personSchema)
