import ProfilePicture from './ProfilePicture'
import LogoutButton from './LogoutButton'
import PicPostView from './PicPostView'
import UploadButton from './UploadButton'
import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import SearchButton from './SearchButton'
import Search from './Search'
import HomeButton from './HomeButton'
import ProfileView from './ProfileView'
import NotificationButton from './NotificationButton'

const Toolbar = ({
  user,
  addProfPic,
  addPicture,
  setErrorMessage,
  logout,
  users,
  pictures,
  addLikeToPicture,
  dislikePicture,
  removePicture,
  addComment,
  likeComment,
  dislikeComment,
  isSearchVisible,
  setIsSearchVisible,
  isVisible,
  setIsVisible,
  isProfileVisible,
  setIsProfileVisible,
  userSelected,
  setUserSelected,
  isBotVisible,
  setIsBotVisible,
  deleteComment,
  requestNotificationPermission,
  file,
  setFile,
  description,
  setDescription,
  fileInputRef,
  handleCancel,
  setRetry,
  setUserRetry }) => {

  const handleButtonClick = () => {
    // Trigger the file input dialog
    fileInputRef.current.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        console.log('File selected:', file.name)
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1440,
          useWebWorker: true,
          fileType: 'image/jpeg',
        }
        const compressedFile = await imageCompression(file, options)
        console.log('Original size:', file.size / 1024, 'KB')
        console.log('Compressed size:', compressedFile.size / 1024, 'KB')
        setFile(compressedFile)
        setIsBotVisible(true)
        setIsVisible(true)
      } catch (error) {
        setErrorMessage('Error compressing the file')
        console.error('Error compressing the file: ', error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      }
    }
    else {
      setErrorMessage('Error reading the file')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
    fileInputRef.current.value = null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!file) {
      setErrorMessage('Please upload a file')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      handleCancel()
      return
    }

    addPicture({ file, description })
    setFile(null)
    setDescription('')
    setIsBotVisible(false)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
      <div className='right-cover'>
        {'  '}
      </div>
      <div className={`right-slide ${isSearchVisible ? 'visible' : 'hidden'}`} style={{ top: '-80px' }}>
        <Search
          users={users}
          pictures={pictures}
          addLikeToPicture={addLikeToPicture}
          dislikePicture={dislikePicture}
          user={user}
          removePicture={removePicture}
          addComment={addComment}
          likeComment={likeComment}
          dislikeComment={dislikeComment}
          isTopVisible={isVisible}
          setIsTopVisible={setIsVisible}
          isProfileVisible={isProfileVisible}
          setIsProfileVisible={setIsProfileVisible}
          userSelected={userSelected}
          setUserSelected={setUserSelected}
          isBotVisible={isBotVisible}
        />
      </div>
      <div
        className={`right-slide ${isProfileVisible ? 'visible' : 'hidden'}`}
        style={{ zIndex: '998', top: '-80px' }}>
        {userSelected && <ProfileView
          userSelected={userSelected}
          setUserSelected={setUserSelected}
          pictures={pictures}
          addLikeToPicture={addLikeToPicture}
          dislikePicture={dislikePicture}
          user={user}
          removePicture={removePicture}
          addComment={addComment}
          likeComment={likeComment}
          dislikeComment={dislikeComment}
          isProfileVisible={isProfileVisible}
          setIsProfileVisible={setIsProfileVisible}
          isTopVisible={isVisible}
          setIsTopVisible={setIsVisible}
          isBotVisible={isBotVisible}
          deleteComment={deleteComment}
          setRetry={setRetry}
          setUserRetry={setUserRetry}
        />}
      </div>
      <div className={`slide-bottom ${isBotVisible ? 'visible' : 'hidden'}`}>
        <PicPostView
          handleSubmit={handleSubmit}
          description={description}
          setDescription={setDescription}
          handleCancel={handleCancel}
          file={file}
        />
      </div>
      <div className='fixed-bottom' style={{ flexDirection: 'row', gap: '1px', padding: '0' }}>
        <ProfilePicture style={{ margin: '0', height: '100%' }}
          currentUser={user}
          addProfPic={addProfPic}
          handleCancel={handleCancel}
        />
        <HomeButton
          setIsSearchVisible={setIsSearchVisible}
          setIsProfileVisible={setIsProfileVisible}
          handleCancel={handleCancel}
          setIsTopVisible={setIsVisible}
          setUserSelected={setUserSelected}
        />
        <UploadButton
          fileInputRef={fileInputRef}
          handleButtonClick={handleButtonClick}
          handleFileChange={handleFileChange}
        />
        <SearchButton
          setIsSearchVisible={setIsSearchVisible}
          setIsVisible={setIsVisible}
          setIsProfileVisible={setIsProfileVisible}
          handleCancel={handleCancel}
          setUserSelected={setUserSelected}
        />
        <LogoutButton
          logout={logout}
          setIsSearchVisible={setIsSearchVisible}
          setIsProfileVisible={setIsProfileVisible}
          handleCancel={handleCancel}
          setIsTopVisible={setIsVisible}
        />
      </div>
    </div>
  )
}

export default Toolbar