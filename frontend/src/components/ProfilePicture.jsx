import React, { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'

const ProfilePicture = ({
  currentUser,
  setUserSelected,
  setIsProfileVisible,
  handleCancel,
  setListVisible }) => {
  const fileInputRef = useRef(null)
  let profPicSrc = '/icons/profpic.png'
  if (currentUser && currentUser.profilePicture && currentUser.profilePicture.data) {
    profPicSrc = currentUser.profilePicture.data
  }

  const handleProfileClick = () => {
    handleCancel()
    setUserSelected(null)
    setUserSelected(currentUser)
    setIsProfileVisible(true)
    setListVisible(false)
    document.getElementById('profileviewPicturesContainer').scrollTop = 0
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button
        className='toolbarbtn'
        style={{
          borderRadius: '0',
          padding: '0',
          margin: '0',
          height: '54px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={handleProfileClick}>
        <img
          src={profPicSrc}
          alt='?'
          style={{ width: '45px',
            height: '45px',
            borderRadius: '50%',
            cursor: 'pointer',
            objectFit: 'cover',
            objectPosition: 'center',
            margin: '4px 4px',
            marginLeft: '24px',
            display: 'block',
            boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
          }}
        />
      </button>
    </div>
  )
}

export default ProfilePicture