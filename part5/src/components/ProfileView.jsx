import { useState, useEffect, useRef } from 'react'
import Picture from './Picture'
import PullToRefresh from 'pulltorefreshjs'

const ProfileView = ({
  userSelected,
  setUserSelected,
  pictures,
  addLikeToPicture,
  dislikePicture,
  user,
  removePicture,
  addComment,
  likeComment,
  dislikeComment,
  isProfileVisible,
  setIsProfileVisible,
  isTopVisible,
  setIsTopVisible,
  isBotVisible,
  deleteComment,
  setRetry,
  setUserRetry }) => {

  const [lastScrollY, setLastScrollY] = useState(0)

  let picturesRef = useRef(null)
  /*
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    if (standalone) {
      PullToRefresh.init({
        mainElement: picturesRef.current, // Specify the main element (defaults to body)
        onRefresh() {
          setRetry((prev) => prev + 1)
          setUserRetry((prev) => prev + 1)
        },
      })

      return () => {
        PullToRefresh.destroy() // Clean up the listener when the component unmounts
      }
    }
  },)
  */
  const handleScroll = () => {
    if (picturesRef.current) {
      const currentScrollY = picturesRef.current.scrollTop // Get current scroll position
      if (currentScrollY > lastScrollY && currentScrollY > 50 && !isBotVisible && isProfileVisible) {
        setIsTopVisible(false) // Hide on scroll down past 50px
      } else {
        setIsTopVisible(true) // Show on scroll up
      }
      setLastScrollY(currentScrollY) // Update last scroll position
      if (currentScrollY < -40 && window.matchMedia('(display-mode: standalone)').matches) {
        setRetry(prev => prev+1)
        setUserRetry(prev => prev+1)
        picturesRef.current.scrollTop = 0
      }
    }
  }

  const picturesShown = pictures.filter(picture => picture.metadata.user.id === userSelected.id)

  let profPicSrc = 'https://i.pravatar.cc/100'
  if (userSelected && userSelected.profilePicture && userSelected.profilePicture.data) {
    profPicSrc = userSelected.profilePicture.data
  }

  let overflowy = 'auto'
  if (isBotVisible) {
    overflowy = 'hidden'
  }

  const onBackClick = () => {
    setIsTopVisible(true)
    setIsProfileVisible(false)
    setUserSelected(null)
  }

  return (
    <div
      ref={picturesRef}
      onScroll={handleScroll}
      style={{ height: '100hv', overflowY: overflowy, overscrollBehavior: 'contain' }}>
      <div
        className={`search-top ${isTopVisible ? 'visible' : 'hidden'}`}
        style={{
          position: 'fixed',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
          zIndex: '999',
          top: '155px',
          paddingTop: '5px'
        }}>
        <div
          onClick={onBackClick}
          style={{
            fontSize: '20px',
            position: 'absolute',
            left: '0',
            marginLeft: '10px',
            cursor: 'pointer',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
          🔙
        </div>
        <img src={profPicSrc}
          alt='?'
          style={{ width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            marginLeft: '5px',
            marginRight: '15px',
            boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
          }}
        />
        <h2>{userSelected.username}</h2>
      </div>
      <div
        className={`search ${isTopVisible ? 'visible' : 'hidden'}`}
        style={{
          position: 'relative',
          top: '85px',
          paddingBottom: '78px'
        }}>
        <div
          className='pictures-container'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '65px'
          }}>
          {[...picturesShown]
            .sort((a, b) => new Date(b.file.uploadDate) - new Date(a.file.uploadDate))
            .map(picture =>
              <Picture
                key={picture.metadata._id}
                picture={picture}
                onLike={addLikeToPicture}
                onDislike={dislikePicture}
                currentUser={user}
                removePicture={removePicture}
                onComment={addComment}
                onCommentLike={likeComment}
                onCommentDislike={dislikeComment}
                setIsProfileVisible={setIsProfileVisible}
                setUserSelected={setUserSelected}
                deleteComment={deleteComment}
              />
            )}
        </div>
      </div>
    </div>
  )
}

export default ProfileView