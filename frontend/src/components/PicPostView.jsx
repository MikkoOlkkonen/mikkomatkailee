import { MentionsInput, Mention } from 'react-mentions'
import mentionstyle from '../style.module.css'
import { useState, useRef } from 'react'

const PicPostView = ({ handleSubmit, description, setDescription, handleCancel, file, users }) => {
  const [isLoading, setIsLoading] = useState(true)
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
          <img
            style={{
              width: '100%',
              maxHeight: 'min(120vw, 780px)',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              paddingTop: '3px'
            }}
            src={blobUrl}
            alt='?'
            onLoad={() => setIsLoading(false)}
          />
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
          onClick={handleSubmit}
          style={{ display: 'block', lineHeight: '30px', fontSize: '30px', marginRight: '5px', cursor: 'pointer' }}>
          ⬆️
        </div>
        <br/>
      </form>
    </div>
  )
}

export default PicPostView