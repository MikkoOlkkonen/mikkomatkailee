import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password }) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          {'username '}
          <input
            className='input'
            data-testid='loginUsername'
            placeholder='Enter username'
            value={username}
            onChange={handleUsernameChange}
            enterKeyHint='Log in'
          />
        </div>
        <div>
          {'password '}
          <input
            className='input'
            data-testid='loginPassword'
            placeholder='Enter password'
            type="password"
            value={password}
            onChange={handlePasswordChange}
            enterKeyHint='Log in'
          />
        </div>
        <button className='btn' type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm