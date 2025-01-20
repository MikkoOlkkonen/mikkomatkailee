import { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import userService from './services/users'
import pictureService from './services/pictures'
import subscribeService from './services/subscribe'
import Notification from './components/Notification'
import LoginForm from './components/loginForm'
import SingupForm from './components/signupForm'
import Picture from './components/Picture'
import Toolbar from './components/Toolbar'
import { messaging } from './firebase/firebase'
import { getToken } from 'firebase/messaging'
import PullToRefresh from 'pulltorefreshjs'

const App = () => {
  const [pictures, setPictures] = useState([])
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [signupVisible, setSignupVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [retry, setRetry] = useState(0)
  const [userRetry, setUserRetry] = useState(0)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isProfileVisible, setIsProfileVisible] = useState(false)
  const [userSelected, setUserSelected] = useState(null)
  const [isBotVisible, setIsBotVisible] = useState(false)
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')
  const [scrollCount, setScrollCount] = useState(0)

  const fileInputRef = useRef(null)
  let mainRef = useRef(null)

  /*
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    if (standalone) {
      PullToRefresh.init({
        mainElement: mainRef.current, // Specify the main element (defaults to body)
        onRefresh() {
          setRetry((prev) => prev + 1)
          setUserRetry((prev) => prev + 1)
        },
      })

      return () => {
        PullToRefresh.destroy() // Clean up the listener when the component unmounts
      }
    }
  }, [])
  */

  const requestNotificationPermission = async () => {
    try {
      const fcmtoken = await getToken(messaging, {
        vapidKey: 'BHzqHg30NDwgJDX-7p04xx9g79wLkv0jtwRz7pClEjDsTKypXtflsuGqRILlEgWYTXZMsJuLPG_oBToiQDtNMbg',
      })
      if (fcmtoken) {
        //console.log('FCM Token:', fcmtoken)
        // Send the token to your backend to subscribe it to a topic
        await subscribeService.subscribe(fcmtoken)
      } else {
        console.warn('No FCM token available.')
      }
    } catch (error) {
      console.error('Error getting FCM token:', error)
    }
  }

  useEffect(() => {
    if (user && navigator.onLine) {
      const fetchPictures = async () => {
        try {
          const fetchedPictures = await pictureService.getAll()
          setPictures(fetchedPictures)
        } catch (error) {
          setTimeout(() => {
            setRetry((prev) => prev + 1)
          }, 1000)
        }
      }
      fetchPictures()
    }
  }, [user, retry])
  //
  useEffect(() => {
    if (user && navigator.onLine) {
      const fetchUsers = async () => {
        try {
          const fetchedUsers = await userService.getAll()
          setUsers(fetchedUsers)
        } catch (error) {
          setTimeout(() => {
            setUserRetry((prev) => prev + 1)
          }, 1000)
        }
      }
      fetchUsers()
    }
  }, [user, userRetry])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      pictureService.setToken(user.token)
      userService.setToken(user.token)
      subscribeService.setToken(user.token)
    }
  }, [])

  const handleScroll = async () => {
    if (mainRef.current) {
      setScrollCount(prev => prev+1)
      if (scrollCount === 1) {
        await requestNotificationPermission()
      }
      const currentScrollY = mainRef.current.scrollTop // Get current scroll position
      if (currentScrollY > lastScrollY && currentScrollY > 50 && !isBotVisible && !isProfileVisible && !isSearchVisible) {
        setIsVisible(false) // Hide on scroll down past 50px
      } else {
        setIsVisible(true) // Show on scroll up
      }
      setLastScrollY(currentScrollY) // Update last scroll position
      //console.log(currentScrollY)
      if (currentScrollY < -40 && window.matchMedia('(display-mode: standalone)').matches) {
        setRetry(prev => prev+1)
        setUserRetry(prev => prev+1)
        mainRef.current.scrollTop = 0
      }
    }
  }

  const addLikeToPicture = async(picture) => {
    const returnedMetadata = await pictureService.likePicture(picture.metadata._id)
    setPictures(pictures.map(picture => picture.metadata._id === returnedMetadata._id ? { file: picture.file, metadata: returnedMetadata } : picture))
  }

  const dislikePicture = async(picture) => {
    const returnedMetadata = await pictureService.dislikePicture(picture.metadata._id)
    setPictures(pictures.map(picture => picture.metadata._id === returnedMetadata._id ? { file: picture.file, metadata: returnedMetadata } : picture))
  }

  const removePicture = async (pictureToRemove) => {
    if (window.confirm('Remove the post?')) {
      try {
        await pictureService.remove(pictureToRemove.metadata._id)
        setPictures(pictures.filter(picture => picture.metadata._id !== pictureToRemove.metadata._id))
      } catch (error) {
        setErrorMessage('Log out and login again')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const addPicture = async (pictureObject) => {
    try {
      const formData = new FormData()
      formData.append('file', pictureObject.file)
      formData.append('description', pictureObject.description)
      const returnedPicture = await pictureService.create(formData)
      setPictures(pictures.concat(returnedPicture))
    } catch (error) {
      setErrorMessage('Log out and login again')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addComment = async (comment, picture) => {
    try {
      const newComment = {
        comment: comment,
      }
      const returnedMetadata = await pictureService.commentPicture(picture.metadata._id, newComment)
      setPictures(pictures.map(picture => picture.metadata._id === returnedMetadata._id ? { file: picture.file, metadata: returnedMetadata } : picture))
    } catch (error) {
      setErrorMessage('Log out and login again')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addProfPic = async ({ file }) => {
    try {
      if (!user) {
        console.error('No user is logged in.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Data = reader.result
        const profilePic = {
          data: base64Data,
          contentType: 'image/png',
        }
        const updatedUser = { ...user, profilePicture: profilePic }
        const returnedUser = await userService.update(user.id, updatedUser)
        window.localStorage.setItem('loggedUser', JSON.stringify(updatedUser))
        setUser(updatedUser)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.log('Error uploading profpic: ', error)
      setErrorMessage('Log out and login again')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const likeComment = async (picture, commentId) => {
    const returnedMetadata = await pictureService.likeComment(picture.metadata._id, commentId)
    setPictures(pictures.map(picture => picture.metadata._id === returnedMetadata._id ? { file: picture.file, metadata: returnedMetadata } : picture))
  }

  const dislikeComment = async (picture, commentId) => {
    const returnedMetadata = await pictureService.dislikeComment(picture.metadata._id, commentId)
    setPictures(pictures.map(picture => picture.metadata._id === returnedMetadata._id ? { file: picture.file, metadata: returnedMetadata } : picture))
  }

  const deleteComment = async (picture, commentId) => {
    const returnedMetadata = await pictureService.removeComment(picture.metadata._id, commentId)
    setPictures(pictures.map(picture => picture.metadata._id === returnedMetadata._id ? { file: picture.file, metadata: returnedMetadata } : picture))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      pictureService.setToken(user.token)
      userService.setToken(user.token)
      subscribeService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setLoginVisible(false)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleSignup = async (event) => {
    event.preventDefault()

    const allUsers = await userService.getAll()
    let alreadyUsed = false

    allUsers.forEach(user => {
      if (user.username === username) {
        alreadyUsed = true
      }
    })
    if (alreadyUsed) {
      setUsername('')
      setPassword('')
      setErrorMessage('username in use already')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
    else {
      const newUser = {
        username: username,
        name: '',
        password: password
      }
      const createdUser = await userService.create(newUser)
      handleLogin(event)
    }
  }
  const loginForm = () => {
    const hideWhenLoginVisible = { display: loginVisible ? 'none' : '' }
    const showWhenLoginVisible = { display: loginVisible ? '' : 'none' }

    const hideWhenSignupVisible = { display: signupVisible ? 'none' : '' }
    const showWhenSignupVisible = { display: signupVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenLoginVisible}>
          <button className='btn' style={{ marginBottom: '5px' }} onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={hideWhenSignupVisible}>
          <button className='btn' onClick={() => setSignupVisible(true)}>sign up</button>
        </div>
        <div style={showWhenLoginVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button className='btn' onClick={() => setLoginVisible(false)}>cancel</button>
        </div> &nbsp;
        <div style={showWhenSignupVisible}>
          <SingupForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleSignup}
          />
          <button className='btn' onClick={() => setSignupVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const logout = () => {
    setIsProfileVisible(false)
    setIsSearchVisible(false)
    setIsVisible(true)
    handleCancel()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleCancel = () => {
    setFile(null)
    setDescription('')
    setIsBotVisible(false)
    fileInputRef.current.value = null
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: '"Funnel Sans", serif',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
      }}>
      {!user && <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '0' }}>
        <h1 className='card' style={{ marginBottom: '5px', marginTop: '0', fontFamily: 'Yellowtail, cursive', width: '100%', borderRadius: '0px', display: 'flex', justifyContent: 'center', top: '0px', textShadow: '0px 0px 0px rgba(0, 0, 0, 0.0)' }}>{'Mikko matkailee'}</h1>
        {loginForm()}
      </div>}
      {user &&
        <div
          onClick={handleRefresh}
          className={`fixed-top ${isVisible ? 'visible' : 'hidden'}`}
          style={{ padding: '0', cursor: 'pointer' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <Notification message={errorMessage} />
            <div className='card' style={{ width: '100%', height: '100%', borderRadius: '0' }}>
              <h1 style={{ margin: '0', padding: '0', display: 'flex', justifyContent: 'center', fontFamily: 'Yellowtail, cursive', textShadow: '0px 0px 0px rgba(0, 0, 0, 0.0)' }}>{'Mikko matkailee'}</h1>
              <span
                style={{
                  fontSize: '12px',
                  padding: '0',
                  margin: '0',
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <span>{user.username}</span>
              </span>
            </div>
          </div>
        </div>
      }
      {user &&
        <div ref={mainRef} onScroll={handleScroll} className={`main ${(isSearchVisible || isProfileVisible) ? 'hidden' : 'visible' }`}>
          <div className='pictures-container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '80px' }}>
            {[...pictures]
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
                  setUserSelected={setUserSelected}
                  setIsProfileVisible={setIsProfileVisible}
                  deleteComment={deleteComment}
                />
              )}
          </div>
        </div>
      }
      {user &&
        <Toolbar
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 2px -5px rgba(0, 0, 0, 0.2)' }}
          user={user}
          addProfPic={addProfPic}
          addPicture={addPicture}
          setErrorMessage={setErrorMessage}
          logout={logout}
          users={users}
          pictures={pictures}
          addLikeToPicture={addLikeToPicture}
          dislikePicture={dislikePicture}
          removePicture={removePicture}
          addComment={addComment}
          likeComment={likeComment}
          dislikeComment={dislikeComment}
          isSearchVisible={isSearchVisible}
          setIsSearchVisible={setIsSearchVisible}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          isProfileVisible={isProfileVisible}
          setIsProfileVisible={setIsProfileVisible}
          userSelected={userSelected}
          setUserSelected={setUserSelected}
          isBotVisible={isBotVisible}
          setIsBotVisible={setIsBotVisible}
          deleteComment={deleteComment}
          requestNotificationPermission={requestNotificationPermission}
          file={file}
          setFile={setFile}
          description={description}
          setDescription={setDescription}
          fileInputRef={fileInputRef}
          handleCancel={handleCancel}
          setRetry={setRetry}
          setUserRetry={setUserRetry}
        />
      }
    </div>
  )
}

export default App