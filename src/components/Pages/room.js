import React from 'react';
import Canvas from '../Canvas/canvas';
import VideoChat from '../Videochat/videochat';

const Room = (props) => {
  const id = props.match.params.roomID;
  console.log("ID (inside Room): " + id);
  return (
    <div>
      <Canvas/>
      <VideoChat/>
    </div>
  );
}

export default Room;
