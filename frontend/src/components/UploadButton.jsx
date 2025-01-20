const UploadButton = ({ fileInputRef, handleFileChange, handleButtonClick }) => {
  return (
    <div style={{ width: '100%' }}>
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
          margin: '0',
          padding: '12px 16px',
          borderRadius: '0px',
          width: '100%', height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center' }}
        onClick={handleButtonClick}>
        <div
          style={{
            fontSize: '30px',
            lineHeight: '30px',
            display: 'block',
            margin: '0',
            transform: 'rotate(45deg)',
            transformOrigin: 'center',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
          ❎
        </div>
      </button>
    </div>
  )
}

export default UploadButton