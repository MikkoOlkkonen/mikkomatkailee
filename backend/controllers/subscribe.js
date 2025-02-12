/* global process */
const router = require('express').Router()
const admin = require('firebase-admin')
const userExtractor = require('../utils/middleware').userExtractor
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT
const serviceAccount = require(serviceAccountPath)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

router.post('/', userExtractor, async (request, response) => {
  const { fcmtoken } = request.body;
  
  try {
    // Subscribe the token to a topic
    const subscribeResponse = await admin.messaging().subscribeToTopic(fcmtoken, 'allUsers');
    const subscribeResponse2 = await admin.messaging().subscribeToTopic(fcmtoken, `${request.user.username}`);
    console.log('Successfully subscribed to topic:', subscribeResponse.errors);
    console.log('Successfully subscribed to topic:', subscribeResponse2.errors);
    response.status(200).send({ message: 'Subscribed successfully!' });
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    response.status(500).send({ error: 'Subscription failed' });
  }
})

module.exports = router