const SingupForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password }) => {
  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {'username '}
          <input
            className="input"
            data-testid='signupUsername'
            placeholder="Enter username"
            value={username}
            onChange={handleUsernameChange}
            enterKeyHint='Sign up'
          />
        </div>
        <div>
          {'password '}
          <input
            className="input"
            data-testid='signupPassword'
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            enterKeyHint='Sign up'
          />
        </div>
        <button className='btn' type="submit">create</button>
      </form>
    </div>
  )
}

export default SingupForm