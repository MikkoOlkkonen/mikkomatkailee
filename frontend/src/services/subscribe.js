import axios from 'axios'
const baseUrl = '/api/subscribe'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const subscribe = async fcmtoken => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
  }
  const response = await axios.post(baseUrl, { fcmtoken }, config)
  return response.data
}

export default { subscribe, setToken }