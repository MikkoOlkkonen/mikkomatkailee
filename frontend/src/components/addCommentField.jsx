import { MentionsInput, Mention } from 'react-mentions'
import mentionstyle from '../style.module.css'

const addCommentField = ({
  mentionsContainerRef,
  newComment,
  setNewComment,
  mentionUsers,
  handleSubmit,
}) => {
  return (
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
              style={{ display: 'block', lineHeight: '30px', fontSize: '30px', marginRight: '5px', cursor: 'pointer', right: '0' }}>
              ⬆️
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default addCommentField