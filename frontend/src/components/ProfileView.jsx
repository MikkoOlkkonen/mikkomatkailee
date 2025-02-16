import { useState, useEffect, useRef } from 'react'
import Picture from './Picture'
import imageCompression from 'browser-image-compression'

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
  setUserRetry,
  users,
  currentUser,
  addProfPic,
  listVisible,
  setListVisible }) => {

  const [lastScrollY, setLastScrollY] = useState(0)
  const [imageToScroll, setImageToScroll] = useState(null)

  let picturesRef = useRef(null)
  const fileInputRef = useRef(null)
  let scrollAmount = 0

  useEffect(() => {
    if (listVisible && imageToScroll) {
      setTimeout(() => {
        const element = document.getElementById(`picture-${imageToScroll}`)
        if (element) {
          scrollAmount = -203
          if (!isTopVisible) {
            scrollAmount = -128
          }
          element.scrollIntoView({ behavior: 'instant', block: 'start' })
          document.getElementById('profileviewPicturesContainer').scrollBy({ top: scrollAmount, behavior: 'instant' })
        }
        setImageToScroll(null)
      }, 1)
    }
  }, [listVisible, imageToScroll])

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('profileviewPicturesContainer')?.offsetHeight // Forces reflow
    }, 10)
  }, [])

  const handleButtonClick = () => {
    // Trigger the file input dialog
    fileInputRef.current.click()
  }

  const handleFileChange = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (file) {
      try {
        console.log('File selected:', file.name)
        const options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 100,
          useWebWorker: true,
          fileType: 'image/png',
        }
        const compressedFile = await imageCompression(file, options)
        console.log('Original size:', file.size / 1024, 'KB')
        console.log('Compressed size:', compressedFile.size / 1024, 'KB')
        if (!(compressedFile instanceof Blob)) {
          const blob = new Blob([compressedFile], { type: 'image/png' })
          await addProfPic({ file: blob, currentUser })
        } else {
          await addProfPic({ file: compressedFile, currentUser })
        }
      } catch (error) {
        console.error('Error compressing the file: ', error)
      }
    }
    else {
      console.log('Error reading the file')
    }
    fileInputRef.current.value = null
  }

  const switchToGrid = () => {
    document.getElementById('profileviewPicturesContainer').scrollTop = 0
    setIsTopVisible(true)
    setListVisible(false)
  }

  const switchToList = () => {
    setIsTopVisible(false)
    setListVisible(true)
    document.getElementById('profileviewPicturesContainer').scrollTop = 0
  }

  const scrollToImage = (imageId) => {
    setImageToScroll(imageId)
    setListVisible(true)
  }

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

  let profPicSrc = '/icons/profpic.png'
  if (userSelected && userSelected.profilePicture && userSelected.profilePicture.data) {
    profPicSrc = userSelected.profilePicture.data
  }
  if (currentUser.id === userSelected.id && userSelected && userSelected.profilePicture && userSelected.profilePicture.data) {
    profPicSrc = currentUser.profilePicture.data
  }

  let overflowy = 'auto'
  if (isBotVisible) {
    overflowy = 'hidden'
  }

  const onBackClick = () => {
    setIsTopVisible(true)
    setIsProfileVisible(false)
    setUserSelected(null)
    setListVisible(false)
  }

  return (
    <div
      id='profileviewPicturesContainer'
      ref={picturesRef}
      onScroll={handleScroll}
      style={{ height: '100hv', overflowY: overflowy, overscrollBehavior: 'contain' }}>
      <div
        className={`search-top ${isTopVisible ? 'visible' : 'hidden'}`}
        style={{
          position: 'fixed',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
          zIndex: '999',
          top: '155px',
          paddingTop: '5px'
        }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
          {(userSelected.id === currentUser.id) && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <img
              onClick={handleButtonClick}
              src={profPicSrc}
              alt='?'
              style={{ width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer'
              }}
            />
            <div style={{ fontSize: '8px', display: 'block', marginTop: '3px' }}>
              Edit
            </div>
          </div>}
          {(userSelected.id !== currentUser.id) &&
            <img
              src={profPicSrc}
              alt='?'
              style={{ width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
              }}
            />
          }
          <h2 style={{ marginLeft: '15px' }}>{userSelected.username}</h2>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            borderTop: '1px solid rgba(0, 0, 0, 0.2)',
            paddingTop: '5px',
            boxSizing: 'border-box'
          }}>
          <div
            onClick={switchToGrid}
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '50%',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}>
            <div style={{ display: 'block', fontSize: '30px' }}>
              🔠
            </div>
          </div>
          <div
            onClick={switchToList}
            style={{ display: 'flex', justifyContent: 'center', width: '50%', cursor: 'pointer', boxSizing: 'border-box' }}>
            <div style={{ display: 'block', fontSize: '30px', transform: 'rotate(90deg)' }}>
              ⏸️
            </div>
          </div>
        </div>
        <div
          className={`picturebar ${listVisible ? 'right' : 'left'}`}>
          {}
        </div>
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
            marginTop: '113px'
          }}>
          {listVisible && [...picturesShown]
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
                users={users}
                profileviewMode={true}
                setListVisible={setListVisible}
              />
            )}
          {!listVisible &&
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1px',
                width: '100%',
              }}>
              {[...picturesShown]
                .sort((a, b) => new Date(b.file.uploadDate) - new Date(a.file.uploadDate))
                .map(picture =>
                  <img
                    onClick={() => scrollToImage(picture.metadata._id)}
                    style={{
                      aspectRatio: '1 / 1',
                      width: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      cursor: 'pointer'
                    }}
                    key={picture.metadata._id}
                    src={`/api/pictures/${picture.metadata._id}`}
                  />

                )}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ProfileView