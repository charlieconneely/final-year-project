const express = require("express")
const app = express()
const io = require("socket.io")({path: "/webrtc"})
const port = 8080

// Page created by the server (in the '/views' folder)
// (might change from ejs to JSX/react? or send data to a certain page)
// https://github.com/reactjs/express-react-views
// app.set("view engine", "ejs")

// Javascript + css folder
app.use(express.static(__dirname + "/build/"))  

//Redirects the user the root "/" so there are no navigation errors.
app.get("/", (req, res) => {
    res.redirect("/")
})

//Event listener for when user connects to localhost:3000
io.on("connection", socket => {
    //Pass the roomId and userId when a user joins a room
    socket.on("join-room", (roomId, userId) => {
        console.log(roomId, userId)
        //join the room with the 
        socket.join(roomId)
        //Broadcast the "user-connected" event, to trigger a trigger in "script.js" 
        socket.to(roomId).broadcast.emit("user-connected", userId)
        //When the user disconnects, broadcast the "user-disconnected" event, to trigger a trigger in "script.js" 
        socket.on("disconnect", () =>{
            socket.to(roomId).broadcast.emit("user-disconnected", userId)
        })
    })
    
    socket.emit("your id", socket.id)

    socket.on("send message", body => {
        io.emit('message', body)
    })

    socket.on("send canvas state", body => {
        io.emit('canvasState', body)
    })

    socket.on("take control", userID => {
        io.emit('control switch', userID)
    })
})
// Application hosted on 'localhost:{port}'
const server = app.listen(port, () => console.log("Listening on port: ", port))

//Sockets are listening to the server+port
io.listen(server)

//Setting the socket transport URL connection for Peers
const peers = io.of('/webrtcPeer')