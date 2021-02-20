const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const { v4: uuidV4 } = require("uuid")

// Page created by the server (in the '/views' folder)
// (might change from ejs to JSX/react? or send data to a certain page)
// https://github.com/reactjs/express-react-views
app.set("view engine", "ejs")

// Javascript + css folder
app.use(express.static("public"))  

//Redirects the user to a dynamically created room (uuid url)
app.get("/", (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

//Renders "room.ejs", redirects the user to it, passing through the "uuid" roomID.
app.get("/:room", (req, res) => {
    res.render("room", {
        roomId: req.params.room
    })
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

    socket.on("canvas-change", ({name, canvas}) => {
        io.emit(canvas, {name, canvas})
    })
})

//Application hosted on 'localhost:3000'
server.listen(3000, function() {
    console.log("Listening on port 3000")
})