import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import './videoStyler.css'

function VideoChat(props) {

  // React.createRef() creates access DOM nodes or React elements
  // that are created within the render method;
  // (which is hidden when developing a functional hook instead of a react class component). 
  const localVideo = React.createRef()
  const externalVideo = React.createRef()

  // Socket event listeners that activate functions for connection success, 
  // offerOrAnswer, and adding a candidate.
  props.socket.on('connection-success', (success) => {
    console.log(success)
  })
  props.socket.on('offerOrAnswer', (sdp) => {
    // Create a notification that comes on screen here
    // that notifies the user that they are being called.
    document.getElementById("callNotification").textContent = "You are being called! Click answer to accept."
    console.log("OFFER OR ANSWER CREATED")
    peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
  })
  props.socket.on('candidate', (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  })

  // Creates an RTCPeerConnection object with a list of TURN/STUN servers 
  const peerConnection_config = {
    'iceServers': [
      { url: 'stun:stun.l.google.com:19302' },
      { url: 'stun:stun1.l.google.com:19302' },
      { url: 'stun:stun2.l.google.com:19302' },
      { url: 'stun:stun3.l.google.com:19302' },
    ]
  }
  const peerConnection = new RTCPeerConnection(peerConnection_config)

  // Function that emits a socket event,
  // that takes in a socket identifier and payload,
  // and send the payload and socketID to the peer.
  const sendToPeer = (messageType, payload) => {
    props.socket.emit(messageType, {
      socketID: props.socket.id,    
      payload
    })
  }

  // Event handler that specifies a function that happens 
  // whenever the local ICE agent needs to deliver a message to the other peer
  // through the signaling server.
  // It sends local candidate data to anyone who triggers this event.
  peerConnection.onicecandidate = (e) => {
    if (e.candidate){
      sendToPeer('candidate', e.candidate)
      console.log(JSON.stringify(e.candidate))
    }
  }

  peerConnection.oniceconnectionstatechange = (e) => {
    console.log(e)
  }

  // When a stream has been received, it is assigned to 
  // the externalVideo's 'React.createRef()' element.
  peerConnection.ontrack = function(event) {
    externalVideo.current.srcObject = event.streams[0];
    console.log("VIDEO SHOULD BE SHOWING")
  };

  // Create an offer. ("Just letting you know, these are my properties.")
  // If the offer creation is successful, it returns an 'SDP' and
  // the peerConnection's 'local description' is set to the 'SDP'.
  // ========================================================================
  // ('SDP' - Session Description Protocol) 
  // ('Local Description' - The properties of the local end of the connection.) 
  const createOffer = () => {
    console.log("Offer")
    peerConnection.createOffer({offerToReceiveVideo: 1}).then(sdp => {
      //Displays the SDP in JSON so we can copy it over to the other peer for testing.
      //console.log(JSON.stringify(sdp))
      peerConnection.setLocalDescription(sdp)

      sendToPeer('offerOrAnswer', sdp)
    }, e => {})
  }

  // Create an answer. ("Just letting you know, these are my properties.")
  // If the answer creation is successful, it returns an 'SDP' and
  // the peerConnection's 'local description' is set to the 'SDP'.
  // ========================================================================
  // ('SDP' - Session Description Protocol.) 
  // ('Local Description' - The properties of the local end of the connection.) 
  const createAnswer = () => {
    console.log("Answer")
    peerConnection.createAnswer({offerToReceiveVideo: 1}).then(sdp => {
      //console.log(JSON.stringify(sdp))
      peerConnection.setLocalDescription(sdp)

      sendToPeer('offerOrAnswer', sdp)
    }, e => {})
  }

  //Success constant for assigning the local video stream.
  const mediaSuccess = (stream) => {
    window.localStream = stream
    localVideo.current.srcObject = stream;
    peerConnection.addStream(stream)
    console.log("Permissions: 'Webcam' and 'Microphone' permissions approved.");
  }

  //Failure constant if video + audio are not provided by the user.
  const mediaFailure = (e) => {
    console.log("Permissions: Please enable 'Webcam' and 'Microphone' permissions.")
  }

  // Grabs user media from the browser using promises,
  // calling 'success' when video and audio returns 'true', 
  // and calls 'failure' if else.
  navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    .then(mediaSuccess)
    .catch(mediaFailure)

  return ( 
    <div class="videoContainer">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h2>You</h2>  
          <video ref={localVideo} autoPlay></video> 
        </Grid>
        <Grid item xs={6}>
          <h2>Guest</h2>
          <video ref={externalVideo} autoPlay></video> 
        </Grid>

        <Grid item xs={12}>
          <h2 id="callNotification"> </h2>
        </Grid>

        <Grid item xs={6}>
          <Button variant="outlined" color="primary" onClick={createOffer}>Call</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" color="secondary" onClick={createAnswer}>Answer</Button>
        </Grid>        
      </Grid>

      <br/><br/>

    </div>
  );
}

export default VideoChat;