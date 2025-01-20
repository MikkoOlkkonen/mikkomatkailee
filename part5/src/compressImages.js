import { MongoClient, GridFSBucket } from 'mongodb'
import sharp from 'sharp'

const uri = 'mongodb+srv://mikko:kissakoira13@cluster0.e3gzg.mongodb.net/blogApp?retryWrites=true&w=majority&appName=Cluster0'
const dbName = 'blogApp'
const bucketName = 'uploads'

const compressImages = async () => {
  const client = new MongoClient(uri) // luodaan mongo client

  try {
    await client.connect() // yhdistetään mongoon
    const db = client.db(dbName) // haetaan tietty db mongosta
    const bucket = new GridFSBucket(db, { bucketName }) // luodaan uusi bucket uploadsbucketin perusteella??

    const filesCursor = bucket.find({}) // haetaan kaikki tiedostot bucketista
    const files = await filesCursor.toArray() // muutetaan tiedostojen tiedot arrayiksi jotta niihin pääsee kätevästi käsiksi

    for (const file of files) { // käydään läpi kaikki tiedostot
      console.log(`Processing file: ${file.filename}`)
      const downloadStream = bucket.openDownloadStream(file._id) // avataan itse tiedostp?
      let chunks = []

      for await (const chunk of downloadStream) {
        chunks.push(chunk)
      }

      const originalBuffer = Buffer.concat(chunks) // yhdistää chunkit yhteen bufferiin
      const compressedBuffer = await sharp(originalBuffer)
        .resize({ width: 1080, height: 1080, fit: sharp.fit.inside, withoutEnlargement: true })
        .jpeg({ quality: 80 })  // Set JPEG quality
        .toBuffer() // muuttaa prosessoidun kuvan bufferiksi

      await bucket.delete(file._id) // poistetaan alkuperäinen tiedosto grifs bucketista

      const uploadStream = bucket.openUploadStream(file.filename, { metadata: file.metadata }) // Opens a writable stream to re-upload the compressed file.
      uploadStream.end(compressedBuffer) // Writes the compressed image to GridFS and closes the stream.
      console.log(`Compressed and re-uploaded: ${file.filename}`)
    }

    console.log('All images processed successfully!')
  }
  catch (error) {
    console.error('Error processing images:', error)
  } finally {
    await client.close()
  }
}

compressImages()