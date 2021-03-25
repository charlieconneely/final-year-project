const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const socket = require("socket.io")
const io = socket(server) 
const port = 3000

// Javascript + css folder
app.use(express.static(__dirname + "/build/"))  

//Redirects the user the root "/" so there are no navigation errors.
app.get('/', (res) => {
    res.sendFile(__dirname + '/build/index.html')
})

//Sockets are listening to the server+port
//socket.listen(server)

//Setting the socket transport URL connection for Peers
//const peers = io.of('/webrtcPeer')

//List of all Peer connections to sockets
let peerConnections = new Map()

//Event listeners for when peers connect to the server URL.
io.on('connection', (socket) => {
    // Emits a event called 'connection-success' along with the user's socket id.
    // A peer is added to the map, with a socket ID as the key, and the socket as a value.
    console.log("VIDEO SIDE OF THINGS:",socket.id);
    socket.emit('connection-success', { success: socket.id})
    peerConnections.set(socket.id, socket)

    // Event listener for 'offerOrAnswer'.
    // Loops through each of the keys + values within the peerConnections Map
    // if their sockets are not the same, the 'offerOrAnswer' event is emitted with the payload data.
    socket.on('offerOrAnswer', (data) => {
        for (const [socketID, socket] of peerConnections.entries()){
            if (socketID !== data.socketID){
                console.log(socketID, data.payload.type)
                socket.emit('offerOrAnswer', data.payload) // switch to io + include uuid in emit
            }
        }
    })

    // Event listener for 'candidate'.
    // Loops through each of the keys + values within the peerConnections Map
    // if their sockets are not the same, the 'candidate' event is emitted with the payload data.
    // *** DUPLICATE CODE TO 'offerOrAnswer' *** 
    socket.on('candidate', (data) => {
        for (const [socketID, socket] of peerConnections.entries()){
            if (socketID !== data.socketID){
                console.log(socketID, data.payload)
                socket.emit('candidate', data.payload)
            }
        }
    })    

    // Event listener for 'disconnect'.
    // When the event is called, the element in the peerConnections Map with the socket id is removed.
    socket.on('disconnect', () => {
        console.log('disconnected')
        peerConnections.delete(socket.id)
    })

    socket.emit("your id", socket.id)

    socket.on("send canvas state", body => {
        io.emit('canvasState', body)
    })

    socket.on("take control", userID => {
        io.emit('control switch', userID)
    })
})

// Application hosted on 'localhost:{port}'
server.listen(port, () => console.log("Listening on port: ", port))