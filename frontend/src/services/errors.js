import axios from 'axios'
const baseUrl = '/api/errors'

const alert = async (message) => {
  const response = await axios.post(baseUrl, { message })
  return response.data
}

export default { alert }