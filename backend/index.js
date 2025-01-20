const app = require('./app') // varsinainen Express-sovellus
const config = require('./utils/config')
const logger = require('./utils/logger')

console.log('Index.js started')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})