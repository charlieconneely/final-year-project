import React from 'react'
import io from 'socket.io-client'
import uuid from 'react-uuid'

function VideoChat(props) {

  // React.createRef() creates access DOM nodes or React elements
  // that are created within the render method;
  // (which is hidden when developing a functional hook instead of a react class component). 
  const localVideo = React.createRef()
  const externalVideo = React.createRef()

  // Transport connection to be established with the server at the temporary namespace;
  // '/webrtcPeer'.
  // The path '/webrtc' is the path captured by the serverside
  const socket = io(
    '/webrtcPeer',
    {
      path: '/webrtc',
      query: {}
    }
  )
  
  //CHECKING IF THE PAGE IS REFRESHING
  console.log(uuid())

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
    socket.emit(messageType, {
      socketID: socket.id,
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

  // Socket event listeners that activate functions for connection success, 
  // offerOrAnswer, and adding a candidate.
  socket.on('connection-success', (success) => {
    console.log(success)
  })
  socket.on('offerOrAnswer', (sdp) => {
    // Create a notification that comes on screen here
    // that notifies the user that they are being called.
    document.getElementById("jsonPasteBox").value = JSON.stringify(sdp)
    console.log("OFFER OR ANSWER CREATED")
    peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
  })
  socket.on('candidate', (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  })

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
    <div>
      <h2> Video chat component. </h2> 

      <h1>My Video</h1>
      <video ref={localVideo} autoPlay></video> 
      <h1>Their Video</h1>
      <video ref={externalVideo} autoPlay></video> 
      
      <br></br><br></br><br></br>

      <button onClick={createOffer}>OFFER</button>
      <button onClick={createAnswer}>ANSWER</button>
      <div>
        <h2>Please paste Peer SDP or Candidate JSON below.</h2>
        <textarea id="jsonPasteBox" placeholder="Paste JSON here." input="text"/>
      </div>

      <br></br><br></br><br></br>

    </div>
  );
}

export default VideoChat;