const router = require('express').Router()
const Picture = require('../models/picture')
const userExtractor = require('../utils/middleware').userExtractor
const upload = require('../utils/upload')
const mongoose = require('mongoose')
const { sendNotification } = require('../utils/notificationService')

let gfs;
const conn = mongoose.connection;

conn.once('open', () => {
  console.log('MongoDB connection open');
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads', // Name of your GridFS bucket
  });
});

// get all files
router.get('/', async (request, response) => {
  const files = await gfs.find({}).toArray()
  const pictures = await Picture.find({})
    .populate('user', { username: 1, name: 1, _id: 1, profilePicture: 1 })
    .populate('comments.user', { username: 1, name: 1, _id: 1, profilePicture: 1 })
  console.log(pictures)
  const combinedData = files.map(file => {
    const picture = pictures.find(p => p.fileId && p.fileId.toString() === file._id.toString())
    return {
      file: file,
      metadata: picture
    }
  })
  response.json(combinedData)
})

router.get('/:id', async (request, response) => {
  if (!gfs) {
    return response.status(500).json({ error: 'GridFS not initialized' });
  }

  try {
    const metadataId = request.params.id;
    const picture = await Picture.findById(metadataId)
      .populate('user', { username: 1, name: 1, _id: 1, profilePicture: 1 })
      .populate('comments.user', { username: 1, name: 1, _id: 1, profilePicture: 1 })
    const fileId = picture.fileId

    const file = await gfs.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray()

    const readStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    readStream.on('error', (err) => {
      console.error('Stream Error:', err.message);
      response.status(500).json({ error: 'Error reading file', details: err.message });
    });

    response.setHeader('Content-Type', file[0].contentType); // Adjust based on your file type
    readStream.pipe(response);

  } catch (error) {
    console.error('Server Error:', error.message)
    response.status(500).json({ error: 'Error fetching file', details: error.message })
  }
})

router.post('/', userExtractor, upload.single('file'), async (request, response) => {
  const file = request.file
  if (!file) {
    return response.status(400).json({ error: 'No file uploaded' })
  }
  const user = request.user
  if (!user) {
    return response.status(403).json({ error: 'User not logged in' });
  }
  const picture = new Picture({
    likes: 0,
    dislikes: 0,
    user: user,
    fileId: file.id, // ID of the file in GridFS
    description: request.body.description,
    likers: [],
    comments: [],
  })
  user.pictures = user.pictures.concat(picture._id)
  const savedPicture = await picture.save()

  sendNotification(
    'New post!',
    `${user.username} just posted a new picture`,
    'allUsers'
  )

  response.status(201).json({
    file: file,
    metadata: savedPicture
  })
})

router.put('/:id/likes', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(403).json({ error: 'User not logged in' })
  }

  const picture = await Picture.findById(request.params.id)

  if (!picture) {
    return response.status(404).json({ error: 'Picture not found' })
  }

  if (!picture.likers.includes(user.username)) {
    picture.likers.push(user.username)
    picture.likes += 1
  }
  else {
    picture.likers = picture.likers.filter(liker => liker !== user.username)
    picture.likes -= 1
  }

  const updatedPicture = await picture.save()

  const populatedPicture = await Picture.findById(updatedPicture._id)
    .populate('user', { username: 1, name: 1, _id: 1, profilePicture: 1 })
    .populate('comments.user', { username: 1, name: 1, _id: 1, profilePicture: 1 })

  response.json(populatedPicture)
})

router.put('/:id/dislikes', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(403).json({ error: 'User not logged in' })
  }

  const picture = await Picture.findById(request.params.id)

  if (!picture) {
    return response.status(404).json({ error: 'Picture not found' })
  }

  picture.dislikes += 1

  const updatedPicture = await picture.save()

  const populatedPicture = await Picture.findById(updatedPicture._id)
    .populate('user', { username: 1, name: 1, _id: 1, profilePicture: 1 })
    .populate('comments.user', { username: 1, name: 1, _id: 1, profilePicture: 1 })

  response.json(populatedPicture)
})

router.put('/:id/comments', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(403).json({ error: 'User not logged in' })
  }

  const picture = await Picture.findById(request.params.id)
    .populate('user', { username: 1, name: 1, _id: 1, profilePicture: 1 })

  if (!picture) {
    return response.status(404).json({ error: 'Picture not found' })
  }

  const pictureUser = picture.user

  const newComment = {
    user: user,
    comment: request.body.comment,
    likes: 0,
    dislikes: 0,
    likers: []
  }

  picture.comments = [...picture.comments, newComment]

  const updatedPicture = await picture.save()

  sendNotification(
    'New comment!',
    `${user.username} just commented on your post`,
    `${pictureUser.username}`
  )

  const populatedPicture = await Picture.findById(updatedPicture._id)
    .populate('user', { username: 1, name: 1, _id: 1, profilePicture: 1 })
    .populate('comments.user', { username: 1, name: 1, _id: 1, profilePicture: 1 })

  response.json(populatedPicture)
})

router.put('/:id/comments/likes', userExtractor, async (request, response) => {
  const user = request.user
  const commentId = request.body.commentId

  if (!user) {
    return response.status(403).json({ error: 'User not logged in' })
  }

  const picture = await Picture.findById(request.params.id)

  if (!picture) {
    return response.status(404).json({ error: 'Picture not found' })
  }

  picture.comments = picture.comments.map((comment) => {
    if (comment._id.toString() === commentId) {
      if (comment.likers.includes(user.username)) {
        comment.likes -= 1
        comment.likers = comment.likers.filter(liker => liker !== user.username)
      }
      else {
        comment.likes += 1
        comment.likers.push(user.username)
      }
    }
    return comment
  })

  const updatedPicture = await picture.save()

  const populatedPicture = await Picture.findById(updatedPicture._id)
    .populate('user', { username: 1, name: 1, _id: 1, profilePicture: 1 })
    .populate('comments.user', { username: 1, name: 1, _id: 1, profilePicture: 1 })

  response.json(populatedPicture)
})

router.put('/:id/comments/dislikes', userExtractor, async (request, response) => {
  const user = request.user
  const commentId = request.body.commentId

  if (!user) {
    return response.status(403).json({ error: 'User not logged in' })
  }

  const picture = await Picture.findById(request.params.id)

  if (!picture) {
    return response.status(404).json({ error: 'Picture not found' })
  }

  picture.comments = picture.comments.map((comment) => {
    if (comment._id.toString() === commentId) {
      comment.dislikes += 1
    }
    return comment
  })

  const updatedPicture = await picture.save()

  const populatedPicture = await Picture.findById(updatedPicture._id)
    .populate('user', { username: 1, name: 1, _id: 1, profilePicture: 1 })
    .populate('comments.user', { username: 1, name: 1, _id: 1, profilePicture: 1 })

  response.json(populatedPicture)
})

router.put('/:id/comments/remove', userExtractor, async (request, response) => {
  const user = request.user
  const commentId = request.body.commentId

  if (!user) {
    return response.status(403).json({ error: 'User not logged in' })
  }

  const picture = await Picture.findById(request.params.id)

  if (!picture) {
    return response.status(404).json({ error: 'Picture not found' })
  }


  for (const comment of picture.comments) {
    if (comment._id.toString() === commentId) {
      if (comment.user._id.toString() !== user.id.toString()) {
        return response.status(403).json({ error: 'user not authorized' })
      }
    }
  }

  picture.comments = picture.comments.filter(comment => comment._id.toString() !== commentId)

  const updatedPicture = await picture.save()

  const populatedPicture = await Picture.findById(updatedPicture._id)
    .populate('user', { username: 1, name: 1, _id: 1, profilePicture: 1 })
    .populate('comments.user', { username: 1, name: 1, _id: 1, profilePicture: 1 })

  response.json(populatedPicture)
})

router.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const picture = await Picture.findById(request.params.id)
  if (!picture) {
    return response.status(204).end()
  }

  if ( user.id.toString() !== picture.user.toString() ) {
    return response.status(403).json({ error: 'user not authorized' })
  }
  const fileId = picture.fileId
  gfs.delete(new mongoose.Types.ObjectId(fileId))
  await picture.deleteOne()

  user.picture = user.pictures.filter(b => b._id.toString() !== picture._id.toString())

  await user.save()

  response.status(204).end()
})

module.exports = router