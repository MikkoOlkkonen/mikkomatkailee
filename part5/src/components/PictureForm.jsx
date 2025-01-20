import React, { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'

const PictureForm = ({ createPicture, setErrorMessage, setBotIsVisible }) => {
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')

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
        setBotIsVisible(true)
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
      return
    }

    createPicture({ file, description })
    setFile(null)
    setDescription('')
    setBotIsVisible(false)
  }

  const handleCancel = () => {
    setFile(null)
    setDescription('')
    setBotIsVisible(false)
    fileInputRef.current.value = null
  }

  return (
    <div style={{ width: '100%', display: 'flex', margin: '0' }}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      /> &nbsp;
      {!file && <button
        className='btn'
        style={{
          margin: '0',
          padding: '12px 16px',
          borderRadius: '0px',
          width: '100%', height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center' }}
        onClick={handleButtonClick}>
        <img
          src='/icons/realplus.png'
          alt='?'
          style={{
            width: '30px',
            height: '30px',
            margin: '0',
            display: 'block'
          }}
        />
      </button>}
      {file && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
        <form onSubmit={handleSubmit}>
          <textarea
            className='input'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Picture selected!
Add a description for the picture'
            rows='4'
            cols='24'
          />
          <br/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button type='submit' className='btn'>Post</button>
            <button className='btn' onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>}
    </div>
  )
}

export default PictureForm