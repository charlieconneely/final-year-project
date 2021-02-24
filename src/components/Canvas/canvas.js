import React, {useState, useEffect, useRef} from 'react'
import uuid from 'react-uuid'
import io from 'socket.io-client'
import useLocalStorage from '../../hooks/useLocalStorage'
import DrawingBoard from './drawingBoard'
import ToolBar from './toolbar'
import './canvas.css' 

function Canvas() {

  const [isDrawing, setIsDrawing] = useState(false)
  const [shape, setShape] = useState("Line")
  const [inControl, setControl] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [elements, setElements] = useLocalStorage("elements", [])
  const [yourID, setYourID] = useLocalStorage('userID', '')

  const socketRef = useRef()

  useEffect(() => {
    if (yourID === "") {
      console.log("ID was blank in localstorage")
      setYourID(uuid)
    }

    socketRef.current = io.connect('/')

    socketRef.current.on("your id", id => {
      console.log("Socket ID: " + id)
    })

    socketRef.current.on("control switch", id => {
      if (id === yourID) {
        setControl(true);
      } else {
        setControl(false);
      }
    })

    socketRef.current.on("canvasState", cState => {
      if (!inControl) setElements(cState.body);
    })

    socketRef.current.on("user-diconnected", () => {
      console.log("User disconnected")
    })

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  // called from DrawingBoard component
  const switchControl = () => {   
    socketRef.current.emit("take control", yourID)
  }

  // called from DrawingBoard component
  const sendCanvas = (canvasObject) => {
    if (!inControl) return;
    socketRef.current.emit("send canvas state", canvasObject)
  }

  return (
    <div>
      <DrawingBoard sendCanvasState={sendCanvas}
          propsInControl={inControl}
          isPropsDrawing={isDrawing} setIsPropsDrawing={setIsDrawing}
          id={yourID} 
          propsElements={elements} setPropsElements={setElements}
          propsShape={shape} winWidth={windowWidth}/>

      <ToolBar propsShape={shape} setPropsShape={setShape}
            propsElements={elements} setPropsElements={setElements}
            propsInControl={inControl} setPropsControl={setControl} 
            switchControl={switchControl} sendCanvasState={sendCanvas}
            id={yourID}/>
    </div>
  );
}

export default Canvas;
