const GridFsStorage = require('multer-gridfs-storage').GridFsStorage
const multer = require('multer')
const config = require('./config') // Adjust the path to your config file

const storage = new GridFsStorage({
  url: config.MONGODB_URI,
  file: (req, file) => {
    console.log('Processing file:', file); // Log file metadata
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads',
    }
  },
})

storage.on('connection', (db) => {
  console.log('Connected to GridFS')
})

storage.on('error', (err) => {
  console.error('GridFS Storage Error:', err); // Log storage errors
})

const upload = multer({ storage })

module.exports = upload