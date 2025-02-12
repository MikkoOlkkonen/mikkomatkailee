import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
          <span style={{ display: 'block', alignSelf: 'center' }}>username</span>
          <input
            style={{ display: 'block', alignSelf: 'center' }}
            className='input'
            data-testid='loginUsername'
            placeholder='Enter username'
            value={username}
            onChange={handleUsernameChange}
            enterKeyHint='Log in'
          />
          <span style={{ display: 'block', alignSelf: 'center' }}>password</span>
          <input
            style={{ display: 'block', alignSelf: 'center' }}
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