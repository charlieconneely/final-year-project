import React, { useState, useEffect } from 'react'
import Canvas from '../Canvas/canvas'
import uuid from 'react-uuid'
import VideoChat from '../Videochat/videochat'
import useLocalStorage from '../../hooks/useLocalStorage'
import SocketContext from '../../socketContext'
import './landing.css'


const Room = () => {
  const [yourID, setYourID] = useLocalStorage('userID', '')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    if (yourID === "") {     
      setYourID(uuid)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])  

  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  return (
    <body>      
      <SocketContext.Consumer>
        { socket => <VideoChat socket={socket}/> }
      </SocketContext.Consumer>
      <SocketContext.Consumer>
        { socket => <Canvas propsUserID={yourID} socket={socket} winWidth={windowWidth}/> }
      </SocketContext.Consumer>
    </body>
  );
}

export default Room;
