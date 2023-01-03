const mongoose = require('mongoose')
// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI
console.log(`Connecting to ${url}`)

mongoose.connect(url).then( () => {
        console.log('Connected to MongoDB')
}).catch(err => {
        console.log(`Error connecting to MongoDB, ${err}`)
})

const personSchema = new mongoose.Schema({
        name: {
                type: String,
                required:[true, 'User name is required'],
                minLength: 3,
                unique: true
        },
        number: {
                type: String,
                required: [true, 'User phone number required'],
                validate: {
                        validator: (v) => {
                                return /((\d{2}-\d{6,})|(\d{3}-\d{5,})|(\d{8,}))/.test(v)
                        },
                        message: 'Not a valid phone number'
                },
        }
})

personSchema.set('toJSON', {
        transform: (document, returnedObject) => {
                returnedObject.id = returnedObject._id.toString(),
                delete returnedObject._id,
                delete returnedObject.__v
        }
})

module.exports = mongoose.model('Person', personSchema)