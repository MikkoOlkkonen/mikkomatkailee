import { useEffect } from 'react'
import { messaging } from '../firebase/firebase'
import { onMessage } from 'firebase/messaging'
import { getToken } from 'firebase/messaging'

const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: 'BHzqHg30NDwgJDX-7p04xx9g79wLkv0jtwRz7pClEjDsTKypXtflsuGqRILlEgWYTXZMsJuLPG_oBToiQDtNMbg' })
    if (token) {
      console.log('User FCM Token:', token)
    } else {
      console.warn('No registration token available.')
    }
  } catch (error) {
    console.error('Error while fetching token:', error)
  }
}

const NotificationProvider = () => {
  useEffect(() => {
    requestNotificationPermission()
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received: ', payload)
      // Add custom notification handling logic here
    })
    // Cleanup listener on unmount
    return unsubscribe
  }, [])

  return null // No visible UI required
}

export default NotificationProvider