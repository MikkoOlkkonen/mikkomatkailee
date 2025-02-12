const router = require('express').Router()

router.post('/', (request, response) => {
  console.log(request.body)
  response.status(200).json({ message: 'Error logged successfully' })
})

module.exports = router