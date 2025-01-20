/* eslint-env serviceworker */
/* global firebase */

importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: 'AIzaSyBZzwX449X4gln7dykO5JKjIIeJTwuPSoI',
  authDomain: 'mikkomatkailee.firebaseapp.com',
  projectId: 'mikkomatkailee',
  storageBucket: 'mikkomatkailee.firebasestorage.app',
  messagingSenderId: '369605490220',
  appId: '1:369605490220:web:a0bf7d00004657a84bc389',
  measurementId: 'G-D0MBB736T0'
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  //console.log('heiheihei')
  console.log('Received background message ', payload)
  //console.log('title: ', payload.notification.title)
  //console.log('body: ', payload.notification.body)
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/web-app-manifest-512x512.png',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
  //console.log('moi')
})