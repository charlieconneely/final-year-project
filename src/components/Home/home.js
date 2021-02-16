import React from 'react';
import Canvas from '../Canvas/canvas';
import VideoChat from '../Videochat/videochat';

const Home = () => {
  return (
    <div>
      <div>
        <h2>Welcome to the home screen</h2>
        <VideoChat/>
      </div>
      <div>
        <Canvas/>
      </div>
    </div>
  );
}

export default Home;
