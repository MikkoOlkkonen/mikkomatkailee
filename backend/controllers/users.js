const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

router.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'password missing or too short' })
  }


  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

router.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

router.put('/:id', userExtractor, async (request, response) => {
  const realUser = request.user
  const userId = request.params.id
  const user = request.body

  if (!user || !user.profilePicture || !user.profilePicture.contentType || !user.profilePicture.data) {
    return response.status(400).json({ error: 'Invalid profile picture data' })
  }

  if (!realUser) {
    return response.status(403).json({ error: 'User not logged in' });
  }

  if ( realUser.id.toString() !== user.id.toString() ) {
    return response.status(403).json({ error: 'user not authorized' })
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true })

    if (!updatedUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.json(updatedUser)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

module.exports = router