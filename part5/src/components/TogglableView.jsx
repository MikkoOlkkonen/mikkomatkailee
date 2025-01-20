import { useState, useImperativeHandle, forwardRef } from 'react'

const TogglableView = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <span>
      <span style={hideWhenVisible}>
        <button className='btn' onClick={toggleVisibility}>{props.buttonLabel}</button>
      </span>
      <span style={showWhenVisible}>
        <button className='btn' onClick={toggleVisibility}>hide</button>
        {props.children}
      </span>
    </span>
  )
})

TogglableView.displayName = 'TogglableView'

export default TogglableView