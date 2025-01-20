const PicPostView = ({ handleSubmit, description, setDescription, handleCancel, file }) => {
  let blobUrl = ''

  if (file) {
    blobUrl = URL.createObjectURL(file)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'auto',
        flexDirection: 'column',
        overflowY: 'auto',
        overscrollBehavior: 'auto',
        height: '100vh',
        width: '100%'
      }}>
      {file && <img
        style={{ width: '100%', height: 'auto', display: 'block', paddingTop: '3px' }}
        src={blobUrl}
        alt='?'
      />}
      <form
        style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingBottom: '210px' }}>
        <textarea
          name='postpicviewinput'
          className='input'
          style={{ width: '100%', margin: '5px', resize: 'none', maxHeight: '15px' }}
          placeholder='Add a description for the picture'
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          rows='1'
        />
        <div
          onClick={handleSubmit}
          style={{ display: 'block', lineHeight: '30px', fontSize: '30px', marginRight: '5px', cursor: 'pointer' }}>
          ⬆️
        </div>
        <br/>
      </form>
    </div>
  )
}

export default PicPostView