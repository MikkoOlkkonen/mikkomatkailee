const NotificationButton = ({ requestNotificationPermission }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '0px',
      alignItems: 'center',
      flexDirection: 'column',
      margin: '0' }}>
      <button
        onClick={requestNotificationPermission}
        className='toolbarbtn'
        style={{ fontSize: '12px',
          margin: '0',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '0px',
          height: '100%' }}>
        <div
          style={{
            fontSize: '30px',
            lineHeight: '30px',
            display: 'block',
            marginRight: '15px',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
          🔔
        </div>
      </button>
    </div>
  )
}

export default NotificationButton