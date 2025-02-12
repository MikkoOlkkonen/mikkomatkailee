// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBZzwX449X4gln7dykO5JKjIIeJTwuPSoI',
  authDomain: 'mikkomatkailee.firebaseapp.com',
  projectId: 'mikkomatkailee',
  storageBucket: 'mikkomatkailee.firebasestorage.app',
  messagingSenderId: '369605490220',
  appId: '1:369605490220:web:a0bf7d00004657a84bc389',
  measurementId: 'G-D0MBB736T0'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' })
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope)
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error)
    })
}

export { app, messaging }