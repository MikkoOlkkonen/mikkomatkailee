import axios from 'axios'
const baseUrl = '/api/pictures'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    'headers': { 'Authorization': token,
      'Content-Type': 'multipart/form-data'
    }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const likePicture = async (id) => {
  const config = {
    'headers': { 'Authorization': token }
  }
  const response = await axios.put(`${ baseUrl }/${id}/likes`, {}, config)
  return response.data
}

const dislikePicture = async (id) => {
  const config = {
    'headers': { 'Authorization': token }
  }
  const response = await axios.put(`${ baseUrl }/${id}/dislikes`, {}, config)
  return response.data
}

const commentPicture = async (id, comment) => {
  const config = {
    'headers': { 'Authorization': token }
  }
  const response = await axios.put(`${ baseUrl }/${id}/comments`, comment, config)
  return response.data
}

const likeComment = async (pictureId, commentId) => {
  const config = {
    'headers': { 'Authorization': token }
  }
  const response = await axios.put(`${ baseUrl }/${pictureId}/comments/likes`, { commentId }, config)
  return response.data
}

const dislikeComment = async (pictureId, commentId) => {
  const config = {
    'headers': { 'Authorization': token }
  }
  const response = await axios.put(`${ baseUrl }/${pictureId}/comments/dislikes`, { commentId }, config)
  return response.data
}

const removeComment = async (pictureId, commentId) => {
  const config = {
    'headers': { 'Authorization': token }
  }
  const response = await axios.put(`${ baseUrl }/${pictureId}/comments/remove`, { commentId }, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    'headers': { 'Authorization': token }
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll, setToken, create, remove, likePicture, dislikePicture, commentPicture, likeComment, dislikeComment, removeComment }