import styles from '../styles/Main.module.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const FIELDS = {
  NAME: 'name',
  ROOM: 'room',
}

const Main = () => {
  const { NAME, ROOM } = FIELDS

  const [values, setValues] = useState({
    [NAME]: "",
    [ROOM]: "",
  })

  const handleChange = ({ target: { value, name } }) => {
    setValues({ ...values, [name]: value})
  }

  const handleClick = (e) => {
    const isDisabled = Object.values(values).some((v => !v))

    if(isDisabled) e.preventDefault()
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Join</h1>

        <form className={styles.form}>
            <div className={styles.group}>
              <input 
                type="text" 
                name="name" 
                value={values[NAME]}
                placeholder='Name'
                className={styles.input}
                onChange={handleChange}
                autoComplete='off'
                required
              />
            </div>
            <div className={styles.group}>
              <input 
                type="text" 
                name="room" 
                value={values[ROOM]}
                placeholder='Room'
                className={styles.input}
                onChange={handleChange}
                autoComplete='off'
                required
              />
            </div>
          <br />
          <Link 
            to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}
            className={styles.group}
            onClick={handleClick}
          >
            <button type='submit' className={styles.button}>
              Sign In
            </button>
          </Link>
        </form>
      </div>
    </div>
  )
}
export default Main