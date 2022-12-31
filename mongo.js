const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

if (process.argv.length === 2) {
        console.log('you must enter a password')
        process.exit(1)
}

const password = process.argv[2]
const isDisplayAll = process.argv.length === 3 ? true : false
const url = `mongodb+srv://fullstackmongo:${password}@phonebook.fjndpdw.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
        name: String,
        number: String
})

const Person = mongoose.model('Person', personSchema)

const displayAllPersons = () => {
        mongoose
        .connect(url)
        .then((res) => {
                Person.find({}).then(result => {
                        result.forEach(person => {
                                console.log(person)
                        })
                        mongoose.connection.close()
                })
        })
        .catch(err => {
                console.log('did not connect', err)
        })
        
}

const saveNewUser = () => {
        const newPersonName = process.argv[3]
        const newPersonNumber = process.argv[4]

        mongoose
        .connect(url)
        .then((res) => {
                const newPerson = Person({
                        name: newPersonName,
                        number: newPersonNumber
                })

                return newPerson.save()
        })
        .then(() => {
                console.log('New Person Saved!')
                mongoose.connection.close()
        })
        .catch(err => {
                console.log(err)
        })
}


if (isDisplayAll) {
        console.log('Displaying the whole phonebook')
        displayAllPersons()
} else {
        console.log('Adding a new entry')
        saveNewUser()
}