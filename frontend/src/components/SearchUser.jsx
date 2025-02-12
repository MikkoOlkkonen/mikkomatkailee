const SearchUser = ({ user, setUserSelected, setIsProfileVisible }) => {

  let profPicSrc = '/icons/profpic.png'
  if (user && user.profilePicture && user.profilePicture.data) {
    profPicSrc = user.profilePicture.data
  }

  return (
    <div
      onClick={() => {
        setUserSelected(user)
        setIsProfileVisible(true)
      }}
      className='blog'
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
      }}>
      <img src={profPicSrc}
        alt='?'
        style={{ width: '30px',
          height: '30px',
          borderRadius: '50%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          marginLeft: '5px',
          marginRight: '5px' }} />
      <strong>{user.username}</strong>
    </div>
  )
}

export default SearchUser