import { useEffect, useState } from "react"
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom'
import emojis from '../images/emojis.svg'
import EmojiPicker from 'emoji-picker-react'
import dotenv from "dotenv";

import styles from '../styles/Chat.module.css'
import Messages from "./Messages"

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const socket = io.connect(process.env.REACT_APP_SOCKET)

const Chat = () => {
  const navigate = useNavigate()

  const { search } = useLocation();
  const [params, setParams] = useState({
    room: '',
    user: '',
  })
  const [state, setState] = useState([])
  const [message, setMessage] = useState('')
  const [isOpen, setOpen] = useState(false)
  const [users, setUsers] = useState(0)

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search))
    setParams(searchParams)
    socket.emit('join', searchParams)
  }, [search])

  useEffect(() => {
    socket.on('message', ({ data }) => {
      setState((_state) => [..._state, data])
    })
  }, [])

  useEffect(() => {
    socket.on('room', ({data: { users }}) => {
      setUsers(users.length)
    })
  }, [])

  const leftRoom = () => {
    socket.emit('leftRoom', { params })
    navigate('/')
  }

  const handleChange = ({target: { value }}) => setMessage(value)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!message) return

    socket.emit('sendMessage', { message, params })

    setMessage('')
  }

  const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`)
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>
          {params.room}
        </div>
        <div className={styles.users}>
          {users} user(s) in this room
        </div>
        <button className={styles.left} onClick={leftRoom}>
          Left the room
        </button>
      </div>

      <div className={styles.messages}>
        <Messages messages={state} name={params.name}/>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input 
            type="text" 
            name="message" 
            value={message}
            placeholder='What do you want to say ?'
            onChange={handleChange}
            autoComplete='off'
            required
          />
        </div>
        <div className={styles.emoji}>
          <img src={emojis} alt='emojis' onClick={() => setOpen(!isOpen)}/>
          {
            isOpen && (
              <div className={styles.emojis}>
                <EmojiPicker onEmojiClick={onEmojiClick}/>
              </div>
            )
          }
        </div>
        <div className={styles.button}>
          <input type="submit" onSubmit={handleSubmit} value="Send a message"/>
        </div>
      </form>
    </div>
  )
}
export default Chat