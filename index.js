require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PhoneBook = require('./mongoose')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.get('/api/persons', async (request, response, next) => {
  try {
    const persons = await PhoneBook.find({})
    response.json(persons)
  } catch (error) {
    next(error)
  }
})
app.get('/info', async (request, response, next) => {
  try {
    const count = await PhoneBook.countDocuments({})
    response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
  } catch (error) {
    next(error)
  }
})
app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await PhoneBook.findById(request.params.id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).send({ error: 'Person not found' })
    }
  } catch (error) {
    next(error)
  }
})
app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const result = await PhoneBook.findByIdAndDelete(request.params.id)
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).send({ error: 'Person not found' })
    }
  } catch (error) {
    next(error)
  }
})
app.post('/api/persons', async (request, response, next) => {
  const newData = request.body
  if (!newData.name || !newData.number) {
    return response.status(400).json({ error: 'Name or number missing' })
  }
  try {
    const existingPerson = await PhoneBook.findOne({ name: newData.name })
    if (existingPerson) {
      return response.status(400).json({ error: 'Name must be unique' })
    }
    const newPerson = new PhoneBook({
      name: newData.name,
      number: newData.number
    })
    const savedPerson = await newPerson.save()
    response.json(savedPerson)
  } catch (error) {
    next(error)
  }
})
app.put('/api/persons/:id', async (request, response, next) => {
  const { name, number } = request.body
  const updatedPerson = { name, number }
  try {
    const result = await PhoneBook.findByIdAndUpdate(
      request.params.id,
      updatedPerson,
      { new: true, runValidators: true, context: 'query' }
    )
    if (result) {
      response.json(result)
    } else {
      response.status(404).send({ error: 'Person not found' })
    }
  } catch (error) {
    next(error)
  }
})
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformed ID' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
