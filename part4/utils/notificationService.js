/* global process */
const admin = require('firebase-admin')
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT
const serviceAccount = require(serviceAccountPath)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const sendNotification = async (title, body, topic) => {
  const message = {
    notification: {
      title,
      body,
    },
    topic, // You can use a topic to send notifications to all users
  }

  try {
    const response = await admin.messaging().send(message)
    console.log('Notification sent successfully:', response)
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

module.exports = { sendNotification };