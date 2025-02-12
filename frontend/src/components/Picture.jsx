import Comment from './Comment'
import { useState, useRef, useEffect } from 'react'
import { MentionsInput, Mention } from 'react-mentions'
import mentionstyle from '../style.module.css'

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
  deleteComment,
  users,
  profileviewMode,
  setListVisible }) => {

  const [isImageLoading, setIsImageLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [mentionUsers, setMentionUsers] = useState(users.map((user) => ({ id: user.id, display: user.username, avatar: user.profilePicture })))
  const imageSrc = `/api/pictures/${picture.metadata._id}`
  const isoDate = picture.file.uploadDate
  const date = new Date(isoDate)

  const mentionsContainerRef = useRef(null)

  let zindex = 'auto'
  if (profileviewMode) {
    zindex = 'auto'
  }

  let username = ''

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

  const formattedDate = timeAgo(date)

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (newComment !== '') {
      const commentText = newComment.replace(/@\[(.+?)\]\([\p{L}\p{N}_-]+\)/gu, '@$1')
      onComment(commentText, picture)
      setNewComment('')
    }
  }

  const handleMentionClick = (displayName) => {
    const mentionedUser = users.find(user => user.username === displayName)
    if (mentionUsers) {
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

  const handleProfileClick = () => {
    setUserSelected(null)
    setUserSelected(picture.metadata.user)
    setIsProfileVisible(true)
    setListVisible(false)
    const element = document.getElementById('profileviewPicturesContainer')
    if (element) {
      element.scrollTop = 0
    }
  }

  //let profPicSrc = 'https://i.pravatar.cc/100'
  let profPicSrc = '/icons/profpic.png'
  if (picture.metadata.user && picture.metadata.user.profilePicture && picture.metadata.user.profilePicture.data) {
    profPicSrc = picture.metadata.user.profilePicture.data
  }

  return (
    <div
      className='blog'
      style={{
        marginBottom: '3px',
        marginTop: '0',
        marginLeft: '0',
        marginRight: '0',
        overflow: 'hidden',
        overscrollBehavior: 'hidden',
        width: '100%'
      }}>
      <div
        id={profileviewMode ? `picture-${picture.metadata._id}` : null}
        className=".blog"
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '3px',
          position: 'relative',
          padding: '5px',
        }}>
        <div
          onClick={handleProfileClick}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
          <img
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
        </div>
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
      <div style={{ display: 'flex', justifyContent: 'center', margin: '0', flexDirection: 'column' }}>
        <img
          src={imageSrc}
          alt={picture.file.filename}
          style={{
            width: '100%',
            maxHeight: 'min(120vw, 780px)',
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          onLoad={() => setIsImageLoading(false)}
        />
        {(isImageLoading) &&
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'min(120vw, 650px)', width: '100%' }}>
            <div className="dot-spinner">
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
            </div>
          </div>
        }
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
        {parseComment(picture.metadata.description)}
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
            users={users}
            setListVisible={setListVisible}
          />
        )}
      </div>
      <div style={{ marginTop: '10px', marginRight: '0', marginLeft: '0', width: '100%' }}>
        <form style={{ display: 'flex', flexDirection: 'row', maxWidth: '100vw',width: '100%', alignItems: 'center', position: 'relative' }}>
          <div
            ref={mentionsContainerRef}
            id='mentions-container'
            style={{
              width: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <div style={{
              width: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <MentionsInput
                style={{
                  zIndex: zindex,
                  suggestions: { backgroundColor: 'transparent', position: 'absolute', left: '0', top: '-55px' },
                }}
                suggestionsPortalHost={mentionsContainerRef.current}
                inputMode='email'
                placeholder='Add a comment'
                classNames={mentionstyle}
                singleLine
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                  }
                }}>
                <Mention
                  trigger="@"
                  data={mentionUsers}
                  className={mentionstyle.mentions__mention}
                  displayTransform={(id, display) => `@${display}`}
                  renderSuggestion={(suggestion, search, highlightedDisplay, index) => {
                    const avatarSrc = suggestion.avatar?.data || 'https://i.pravatar.cc/100'
                    return (
                      <div
                        style={{ display: 'flex', alignItems: 'center', backgroundColor: 'transparent' }}>
                        <img
                          src={avatarSrc}
                          alt='?'
                          style={{ width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            display: 'block',
                            cursor: 'pointer',
                            marginRight: '5px',
                            boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
                          }}
                        />
                        <span>{highlightedDisplay}</span>
                      </div>
                    )
                  }}
                />
              </MentionsInput>
              <div
                onClick={handleSubmit}
                style={{ display: 'block', lineHeight: '30px', fontSize: '30px', marginRight: '5px', cursor: 'pointer', right: '0', zIndex: zindex }}>
                ⬆️
              </div>
            </div>
          </div>
        </form>
      </div>
      <br/>
    </div>
  )
}

export default Picture