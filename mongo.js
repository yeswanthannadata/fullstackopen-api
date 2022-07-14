const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide all arguments')
  console.log('To create: node mongo.js <password> <name> <number>')
  console.log('To get: node mongo.js <password>')
  process.exit(0)
}

const password = process.argv[2]
const url = `mongodb+srv://yeswanth:${password}@nodeexpress.nfcbg.mongodb.net/personApp?retryWrites=true&w=majority`

const PersonSchema = mongoose.Schema({
  name: String,
  number: String,
})

const Person = new mongoose.model('Person', PersonSchema)

if (process.argv.length === 3) {
  mongoose.connect(url).then(() => {
    Person.find({}).then((persons) => {
      console.log('phonebook:')
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
  })
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  mongoose
    .connect(url)
    .then(() => {
      const person = new Person({ name, number })
      return person.save()
    })
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => {
      console.log(err)
    })
}
