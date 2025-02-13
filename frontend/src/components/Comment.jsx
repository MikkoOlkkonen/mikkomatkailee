const Comment = ({
  currentUser,
  comment,
  picture,
  onLike,
  onDislike,
  setIsProfileVisible,
  setUserSelected,
  deleteComment,
  users,
  setListVisible }) => {

  const isoDate = comment.createdAt
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
    if (weeksAgo <= 4) {
      return `${weeksAgo} weeks ago`
    }

    const monthsAgo = Math.floor(daysAgo / 30)
    if (monthsAgo < 12 && monthsAgo > 0) {
      return `${monthsAgo} months ago`
    }

    const yearsAgo = Math.floor(daysAgo / 365)
    return `${yearsAgo} years ago`
  }

  const parseComment = (wholetext) => {
    const regex = /@([\p{L}\p{N}_]+)/gu
    const parts = wholetext.match(/[^@]+|@[\p{L}\p{N}_]+/gu) // Match text segments (either @username or non-mention parts)
    return parts.map((part, index) => {
      // Check if the part matches a mention (i.e., starts with '@')
      if (part.startsWith('@')) {
        const displayName = part.slice(1) // Remove '@' to get the username
        return (
          <span
            onClick={() => handleMentionClick(displayName)}
            key={index}
            style={{ color: 'blue', cursor: 'pointer' }}
          >
            {part}
          </span>
        )
      }
      // Return non-mention part as plain text
      return part
    })
  }

  const formattedDate = timeAgo(date)

  let imagesrc = ''
  if (comment.user && comment.user.profilePicture && comment.user.profilePicture.data) {
    imagesrc = comment.user.profilePicture.data
  }
  else {
    imagesrc = '/icons/profpic.png'
  }

  const handleProfileClick = () => {
    setUserSelected(null)
    setUserSelected(comment.user)
    setIsProfileVisible(true)
    setListVisible(false)
    const element = document.getElementById('profileviewPicturesContainer')
    if (element) {
      element.scrollTop = 0
    }
  }

  const handleMentionClick = (displayName) => {
    const mentionedUser = users.find(user => user.username === displayName)
    if (mentionedUser) {
      setUserSelected(null)
      setUserSelected(mentionedUser)
      setIsProfileVisible(true)
      setListVisible(false)
      const element = document.getElementById('profileviewPicturesContainer')
      if (element) {
        element.scrollTop = 0
      }
    }
  }

  return (
    <div className="blog" style={{ padding: '5px', margin: '0', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)', fontSize: '14px' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div
          onClick={handleProfileClick}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
          <img
            src={imagesrc}
            alt='?'
            style={{ width: '20px',
              height: '20px',
              borderRadius: '50%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer'
            }}
          /> &nbsp;
          <strong style={{ marginRight: '5px' }}>{comment.user && comment.user.username}</strong> {formattedDate}
        </div>
        {currentUser.username.toString() === comment.user.username.toString() &&
          <div
            style={{
              position: 'absolute',
              margin: '0',
              right: '5px',
              fontSize: '16px',
              lineHeight: '16px',
              display: 'block',
              cursor: 'pointer',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
            }}
            onClick={() => deleteComment(picture, comment._id)}>
            🚮
          </div>
        }
      </div>
      {parseComment(comment.comment)}
      <br/>
      <div style={{ padding: '5px', paddingBottom: '10px', margin: '0', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
        <span>{comment.likes} </span> &nbsp;
        <div
          style={{
            marginTop: '5px',
            fontSize: '16px',
            lineHeight: '16px',
            display: 'block',
            cursor: 'pointer',
            marginRight: '10px  '
          }}
          onClick={() => onLike(picture, comment._id)}>
          {comment.likers.includes(currentUser.username) &&
            <span
              style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)', display: 'block' }}>
              👍🏽
            </span>}
          {!comment.likers.includes(currentUser.username) &&
            <span
              style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)', display: 'block' }}>
              👍
            </span>}
        </div> &nbsp;
        <span> {comment.dislikes} </span> &nbsp;
        <div
          style={{
            marginTop: '5px',
            fontSize: '16px',
            lineHeight: '16px',
            display: 'block',
            cursor: 'pointer',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}
          onClick={() => onDislike(picture, comment._id)}>
          👎
        </div>
      </div>
    </div>
  )
}

export default Comment