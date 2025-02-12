const SingupForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  setSignupVisible,
  setLoginVisible }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '5px' }}>
          <span style={{ alignSelf: 'center' }}>new username</span>
          <input
            style={{ display: 'block', alignSelf: 'center' }}
            className="input"
            data-testid='signupUsername'
            placeholder="Enter username"
            value={username}
            onChange={handleUsernameChange}
            enterKeyHint='Sign up'
          />
          <span style={{ display: 'block', alignSelf: 'center' }}>new password</span>
          <input
            style={{ alignSelf: 'center' }}
            className="input"
            data-testid='signupPassword'
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            enterKeyHint='Sign up'
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
          <button className='btn' type="submit">create</button>
          <button className='btn' onClick={() => {
            setSignupVisible(false)
            setLoginVisible(true)
          }}>
            cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SingupForm