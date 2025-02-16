import { MentionsInput, Mention } from 'react-mentions'
import mentionstyle from '../style.module.css'
import { useState, useRef } from 'react'

const PicPostView = ({ handleSubmit, description, setDescription, handleCancel, file, users, position, setPosition }) => {
  const [imageHeightDiff, setImageHeightDiff] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)
  const currentPosition = useRef(0)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    startY.current = e.touches ? e.touches[0].clientY : e.clientY
    currentPosition.current = position
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const deltaY = clientY - startY.current
    let newPosition = currentPosition.current + deltaY

    // Limit scrolling within bounds (adjust limits as needed)
    newPosition = Math.max(-imageHeightDiff, Math.min(imageHeightDiff, newPosition))
    if (newPosition < 0) {
      setPosition(newPosition)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const loadImage = (event) => {
    setIsLoading(false)
    const maxHeight = Math.min(window.innerWidth * 1.2, 780)

    const naturalWidth = event.target.naturalWidth
    const naturalHeight = event.target.naturalHeight
    const aspectRatio = naturalHeight / naturalWidth

    const imageHeight = window.innerWidth * aspectRatio

    if (imageHeight > maxHeight) {
      setImageHeightDiff(imageHeight - maxHeight)
      return
    }
    setImageHeightDiff(0)
  }


  const mentionUsers = users.map((user) => ({ id: user.id, display: user.username, avatar: user.profilePicture }))

  const mentionsContainerRef = useRef(null)
  let blobUrl = ''

  if (file) {
    blobUrl = URL.createObjectURL(file)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'auto',
        flexDirection: 'column',
        overflowY: 'auto',
        overscrollBehavior: 'auto',
        height: '100vh',
        width: '100%',
        top: '71px'
      }}>
      {file &&
        <div>
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}  // Touch support
            onTouchMove={handleMouseMove}    // Touch support
            onTouchEnd={handleMouseUp}
            style={{
              display: 'flex',
              width: '100%',
              maxHeight: 'min(120vw, 780px)',
              userSelect: 'none',
              overflow: 'hidden',
              position: 'relative',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}>
            <img
              style={{
                top:'0',
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                objectPosition: `center ${position}px`,
                display: 'block',
                userSelect: 'none',
              }}
              src={blobUrl}
              alt='?'
              onLoad={loadImage}
              onDragStart={(event) => event.preventDefault()}
            />
          </div>
          {(isLoading) &&
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
      }
      <form
        ref={mentionsContainerRef}
        style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingBottom: '210px', position: 'relative' }}>
        <MentionsInput
          style={{
            suggestions: { backgroundColor: 'transparent', position: 'absolute', left: '0', top: '-55px' },
          }}
          suggestionsPortalHost={mentionsContainerRef.current}
          inputMode='email'
          placeholder='Add a description'
          classNames={mentionstyle}
          value={description}
          onChange={(event) => setDescription(event.target.value)}>
          <Mention
            trigger="@"
            data={mentionUsers}
            className={mentionstyle.mentions__mention}
            displayTransform={(id, display) => '@' + (display)}
            renderSuggestion={(suggestion, search, highlightedDisplay, index) => {
              const avatarSrc = suggestion.avatar?.data || 'https://i.pravatar.cc/100'
              return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
          onClick={(event) => {
            if (position === 0) {
              console.log(position)
              setPosition(0)
            }
            handleSubmit(event, position)
          }}
          style={{ display: 'block', lineHeight: '30px', fontSize: '30px', marginRight: '5px', cursor: 'pointer' }}>
          ⬆️
        </div>
        <br/>
      </form>
    </div>
  )
}

export default PicPostView