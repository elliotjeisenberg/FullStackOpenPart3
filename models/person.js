const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
console.log(`Connecting to ${url}`)

mongoose.connect(url).then(result => {
        console.log('Connected to MongoDB')
}).catch(err => {
        console.log(`Error connecting to MongoDB, ${err}`)
})

const personSchema = new mongoose.Schema({
        name: {
                type: String,
                required:true,
                minLength: 3
        },
        number: {
                type: String,
                required: true,
                validate: {
                        validator: (v) => {
                                return /((\d{2}-\d{6,}) | (\d{3}-\d{5,}) | (\d{8,}))/.test(v)
                        },
                        message: props => {
                                `${props.value} is not a valid phone number`
                        },
                        required: [true, 'User phone number required']
                }
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