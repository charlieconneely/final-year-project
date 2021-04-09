import React, {useEffect, useRef} from 'react';
import Canvas from '../Canvas/canvas';
import uuid from 'react-uuid'
import VideoChat from '../Videochat/videochat';
import useLocalStorage from '../../hooks/useLocalStorage'
import SocketContext from '../../socketContext'

const Room = () => {
  const [yourID, setYourID] = useLocalStorage('userID', '')

  useEffect(() => {
    if (yourID === "") {     
      setYourID(uuid)
    }
  }, [])  

  return (
    <div>
      <SocketContext.Consumer>
        { socket => <Canvas propsUserID={yourID} socket={socket}/> }
      </SocketContext.Consumer>
      <SocketContext.Consumer>
        { socket => <VideoChat socket={socket}/> }
      </SocketContext.Consumer>
    </div>
  );
}

export default Room;
