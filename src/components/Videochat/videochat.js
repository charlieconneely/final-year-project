import React, { Component } from 'react';

class VideoChat extends Component {
  constructor(props){
    super(props)

    // React.createRef() creates access DOM nodes or React elements
    // that are created within the render method. 
    this.localVideoRef = React.createRef()
  }

  render(){

    const constraints = {
      video: true
    }

    const success = (stream) => {
      this.localVideoRef.current.srcObject = stream;
    }

    const failure = (e) => {
      console.log("Failed to get user Media.")
    }

    // Grabs user media from the browser using promises,
    // calling 'success' when video returns 'true', 
    // and calls 'failure' if else.
    navigator.mediaDevices.getUserMedia(constraints)
    .then(success)
    .catch(failure)

    return (
      <div>
        <h2>Video chat component.</h2>
        <video ref={this.localVideoRef} autoPlay></video>
      </div>
    );
  }

}

export default VideoChat;
