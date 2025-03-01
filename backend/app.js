/* global process */
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const blogsRouter = require('./controllers/blogs')
const pictureRouter = require('./controllers/pictures')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const subscribeRouter = require('./controllers/subscribe')
const errorsRouter = require('./controllers/errors')

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

const corsOptions = {
  origin: '*', // Or specify your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Include any custom headers you're using
}

app.use(cors(corsOptions))
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/pictures', pictureRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/subscribe', subscribeRouter)
app.use('/api/errors', errorsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app