import Comment from './Comment'
import { useState } from 'react'

const Picture = ({
  picture,
  onLike,
  onDislike,
  currentUser,
  removePicture,
  onComment,
  onCommentLike,
  onCommentDislike,
  setUserSelected,
  setIsProfileVisible,
  deleteComment }) => {
  const [newComment, setNewComment] = useState('')
  const imageSrc = `/api/pictures/${picture.metadata._id}`
  const isoDate = picture.file.uploadDate
  const date = new Date(isoDate)

  const timeAgo = (date) => {
    const now = new Date()
    const secondsAgo = Math.floor((now - date) / 1000)

    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`
    }

    const minutesAgo = Math.floor(secondsAgo / 60)
    if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`
    }

    const hoursAgo = Math.floor(minutesAgo / 60)
    if (hoursAgo < 24) {
      return `${hoursAgo} hours ago`
    }

    const daysAgo = Math.floor(hoursAgo / 24)
    if (daysAgo < 7) {
      return `${daysAgo} days ago`
    }

    const weeksAgo = Math.floor(daysAgo / 7)
    if (weeksAgo < 4) {
      return `${weeksAgo} weeks ago`
    }

    const monthsAgo = Math.floor(daysAgo / 30)
    if (monthsAgo < 12) {
      return `${monthsAgo} months ago`
    }

    const yearsAgo = Math.floor(daysAgo / 365)
    return `${yearsAgo} years ago`
  }

  const formattedDate = timeAgo(date)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (newComment !== '') {
      onComment(newComment, picture)
      setNewComment('')
    }
  }

  const handleProfileClick = () => {
    setUserSelected(picture.metadata.user)
    setIsProfileVisible(true)
  }

  let profPicSrc = 'https://i.pravatar.cc/100'
  if (picture.metadata.user && picture.metadata.user.profilePicture && picture.metadata.user.profilePicture.data) {
    profPicSrc = picture.metadata.user.profilePicture.data
  }

  return (
    <div className='blog' style={{ marginBottom: '3px', marginTop: '0', marginLeft: '0', marginRight: '0', overflowY: 'auto', overscrollBehavior: 'auto', width: '100%' }}>
      <div
        className=".blog"
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '3px',
          position: 'relative',
          padding: '5px',
        }}>
        <img
          onClick={handleProfileClick}
          src={profPicSrc}
          alt='?'
          style={{ width: '30px',
            height: '30px',
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            cursor: 'pointer',
            marginRight: '5px',
            boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
          }}
        /> &nbsp;
        <strong>{picture.metadata.user.username}</strong> &nbsp;
        {formattedDate} &nbsp;
        {currentUser.username === picture.metadata.user.username &&
          <div
            style={{
              position: 'absolute',
              right: '10px',
              margin: '0',
              fontSize: '20px',
              lineHeight: '20px',
              display: 'block',
              cursor: 'pointer',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
            }}
            onClick={() => removePicture(picture)}>
            🚮
          </div>
        }
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '0' }}>
        <img
          src={imageSrc}
          alt={picture.file.filename}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
      <div style={{ padding: '5px', margin: '0', display: 'flex', alignItems: 'center', flexDirection: 'row', boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)' }}>
        <span>{picture.metadata.likes} </span> &nbsp;
        <div
          style={{
            marginTop: '5px',
            fontSize: '21px',
            lineHeight: '21px',
            display: 'block',
            cursor: 'pointer',
            marginRight: '10px  '
          }}
          onClick={() => onLike(picture)}>
          {picture.metadata.likers.includes(currentUser.username) &&
            <span
              style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)', display: 'block' }}>
              👍🏽
            </span>}
          {!picture.metadata.likers.includes(currentUser.username) &&
            <span
              style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)', display: 'block' }}>
              👍
            </span>}
        </div> &nbsp;
        <span> {picture.metadata.dislikes} </span> &nbsp;
        <div
          style={{
            marginTop: '5px',
            fontSize: '21px',
            lineHeight: '21px',
            display: 'block',
            cursor: 'pointer',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}
          onClick={() => onDislike(picture)}>
          👎
        </div>
      </div>
      {picture.metadata.description && <div className='text' style={{ padding: '5px 5px', paddingBottom: '10px', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)' }}>
        {picture.metadata.description}
      </div>}
      <div style={{ margin: 0 }}>
        {picture.metadata.comments.map(comment =>
          <Comment
            key={comment._id}
            currentUser={currentUser}
            comment={comment}
            picture={picture}
            onLike={onCommentLike}
            onDislike={onCommentDislike}
            setIsProfileVisible={setIsProfileVisible}
            setUserSelected={setUserSelected}
            deleteComment={deleteComment}
          />
        )}
      </div>
      <div style={{ marginTop: '10px', marginRight: '0', marginLeft: '0', width: '100%' }}>
        <form style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
          <textarea
            id={picture.metadata._id}
            className='input'
            style={{ width: '100%', margin: '5px', resize: 'none', maxHeight: '15px' }}
            placeholder='Add a comment'
            value={newComment}
            onChange={({ target }) => setNewComment(target.value)}
            rows='1'
          />
          <div
            onClick={handleSubmit}
            style={{ display: 'block', lineHeight: '30px', fontSize: '30px', marginRight: '5px', cursor: 'pointer' }}>
            ⬆️
          </div>
        </form>
      </div>
      <br/>
    </div>
  )
}

export default Picture