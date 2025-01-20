import { useState, useEffect, useRef } from 'react'
import SearchUser from './SearchUser'
import ProfileView from './ProfileView'

const Search = ({
  users,
  pictures,
  addLikeToPicture,
  dislikePicture,
  user,
  removePicture,
  addComment,
  likeComment,
  dislikeComment,
  isTopVisible,
  setIsTopVisible,
  isProfileVisible,
  setIsProfileVisible,
  userSelected,
  setUserSelected,
  isBotVisible }) => {
  const [username, setUsername] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [lastSearchScrollY, setLastSearchScrollY] = useState(0)

  let searchRef = useRef(null)

  let overflowy = 'auto'
  if (isProfileVisible || isBotVisible) {
    overflowy = 'hidden'
  }

  const handleSearchScroll = () => {
    if (searchRef.current) {
      const currentScrollY = searchRef.current.scrollTop // Get current scroll position

      if (currentScrollY > lastSearchScrollY && currentScrollY > 50 && !isProfileVisible && !isBotVisible) {
        setIsTopVisible(false) // Hide on scroll down past 50px
      } else {
        setIsTopVisible(true) // Show on scroll up
      }
      setLastSearchScrollY(currentScrollY) // Update last scroll position
    }
  }

  let shownUsers = users
  if (username !== '') {
    shownUsers = users.filter(user => user.username.includes(username))
  }

  return (
    <div
      ref={searchRef}
      onScroll={handleSearchScroll}
      style={{ width: '100%', height: '100hv', overflowY: overflowy, overscrollBehavior: 'auto' }}>
      <div
        className={`search-top ${isTopVisible ? 'visible' : 'hidden'}`}
        style={{
          position: 'fixed',
          alignItems: 'normal',
          justifyContent: 'normal',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
          zIndex: '999',
          width: '100%',
          top: '155px',
          display: 'flex',
          flexDirection: 'row'
        }}>
        <input
          name='searchinput'
          className='input'
          style={{
            width: '100%',
            margin: '5px'
          }}
          placeholder='🔍 Search for a user'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div
        className={`search ${isVisible ? 'visible' : 'hidden'}`}
        style={{ position: 'relative', overflowY: 'hidden', paddingBottom: '50px', top: '125px' }}>
        {shownUsers.map((user) => {
          return(
            <SearchUser
              key={user.id}
              user={user}
              setUserSelected={setUserSelected}
              setIsProfileVisible={setIsProfileVisible}
            />
          )
        })}
      </div>
    </div>
  )

}

export default Search