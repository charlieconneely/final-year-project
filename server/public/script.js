const socket = io("/")
//Grabs the videoGrid element from "room.ejs" displayed by the server (## NOTE ## CHANGING TO JSX/REACT WEBVIEWS)
const videoGrid = document.getElementById("video-grid")

//A new PeerID is created everytime the script is called
//this could cause potential spamming issues, maybe try find a way
//to link the peerID to the peer's IP so if they get kicked, they cannot rejoin with a new PeerID.
const myPeer = new Peer();

const myVideo = document.createElement("video")
//Mute your own video, so ou don't hear yourself/get feedback
myVideo.muted = true

//Array of users
const peers = {}

//Get video and audio source from the browser,
//if the user accepts the video+microphone permissions,
//they will then join the call.
//(might change this so that they can join, and it puts up a placeholder image, that way they can still use the chatbox -> yet to be implemented)
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
    addVideoStream(myVideo, stream)
    
    //When a peer joins, they'll answer the other peers calling them,
    //and start streaming their video+audio
    myPeer.on("call", call => {
        call.answer(stream)
        const video = document.createElement("video")
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    
    //When a new user connects, call the connectToNewUser function
    socket.on("user-connected", userId => {
        connectToNewUser(userId, stream)
    })
})

//When a user disconnects, closes their Peerjs connection.
socket.on("user-disconnected", userId => {
    console.log("User Disconnected: " + userId)
    peers[userId].close()
})

//When a user joins a room, emit the event "join-room"
myPeer.on("open", id =>{
    socket.emit("join-room", ROOM_ID, id)
})

//When a user connects, log it in console (Could display a status to screen in future?)
socket.on("user-connected", userId =>{
    console.log("User connected: " + userId)
})

//AddVideoStream() function
function addVideoStream(video, stream){
    //Creates videostream from user, plays it automatically and adds it to the videogrid.
    video.srcObject = stream
    video.addEventListener("loadedmetadata", () => {
        video.play()
    })
    videoGrid.append(video)
}

//connectToNewUser() function
function connectToNewUser(userId, stream){
    //Makes everyone in the room call the new user
    //Starts streaming video if avaliable,
    //stops the video streaming when user disconnects
    const call = myPeer.call(userId, stream)
    const video = document.createElement("video")
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on("close", () => {
        video.remove()
    })

    peers[userId] = call
}