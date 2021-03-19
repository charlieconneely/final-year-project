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
  const [colour, setColour] = useState("") 
  const [lineWidth, setLineWidth] = useState(1)
  const [inControl, setControl] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [textSize, setTextSize] = useState(20)
  const [elements, setElements] = useLocalStorage("elements", [])
  const [yourID, setYourID] = useLocalStorage('userID', '')

  const socketRef = useRef()

  useEffect(() => {
    if (yourID === "") {     
      setYourID(uuid)
    }

    socketRef.current = io.connect("/")

    socketRef.current.on("your id", id => {
      console.log("The Socket ID: " + id)
    })
  
    socketRef.current.on("canvasState", cState => {
      if (!inControl) setElements(cState.body);
    })
  
    socketRef.current.on("control switch", id => {   
      if (id === yourID) {
        setControl(true);
      } else {
        setControl(false);
      }
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

  // called from toolBar component
  const switchControl = () => {   
    socketRef.current.emit("take control", yourID)
  }

  const sendCanvas = (c) => {
    socketRef.current.emit("send canvas state", c);
  }

  return (
    <div>
      <DrawingBoard propsInControl={inControl} propsTextSize={textSize}
          isPropsDrawing={isDrawing} setIsPropsDrawing={setIsDrawing}
          id={yourID} propsColour={colour} propsLineWidth={lineWidth}
          propsElements={elements} setPropsElements={setElements}
          propsShape={shape} winWidth={windowWidth} propsSendCanvas={sendCanvas} />

      <ToolBar propsShape={shape} setPropsShape={setShape} setPropsColour={setColour}
            propsElements={elements} setPropsElements={setElements}
            propsInControl={inControl} setPropsControl={setControl} 
            switchControl={switchControl} propsSendCanvas={sendCanvas}
            id={yourID} setPropsLineWidth={setLineWidth} 
            propsTextSize={textSize} setPropsTextSize={setTextSize}/>
    </div>
  );
}

export default Canvas;
