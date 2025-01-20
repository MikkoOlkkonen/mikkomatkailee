import React, { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'

const ProfilePicture = ({ currentUser, addProfPic, handleCancel }) => {
  const fileInputRef = useRef(null)
  let profPicSrc = 'https://i.pravatar.cc/100'
  if (currentUser && currentUser.profilePicture && currentUser.profilePicture.data) {
    profPicSrc = currentUser.profilePicture.data
  }

  const handleButtonClick = () => {
    // Trigger the file input dialog
    handleCancel()
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


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
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
        onClick={handleButtonClick}>
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