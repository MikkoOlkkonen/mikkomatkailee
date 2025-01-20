const HomeButton = ({ setIsSearchVisible, setIsProfileVisible, handleCancel, setIsTopVisible, setUserSelected }) => {
  return (
    <div style={{ width: '100%' }}>
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
        onClick={() => {
          setIsSearchVisible(false)
          setIsProfileVisible(false)
          setIsTopVisible(true)
          setUserSelected(null)
          handleCancel()
        }}>
        <div
          style={{
            fontSize: '30px',
            lineHeight: '30px',
            display: 'block',
            margin: '0',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
          🏠
        </div>
      </button>
    </div>
  )
}

export default HomeButton