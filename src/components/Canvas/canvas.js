import React, {useState, useEffect, useRef} from 'react'
import uuid from 'react-uuid'
import io from 'socket.io-client'
import useLocalStorage from '../../hooks/useLocalStorage'
import DrawingBoard from './drawingBoard'
import ToolBar from './toolbar'
import './canvas.css' 

function Canvas(props) {

  const [isDrawing, setIsDrawing] = useState(false)
  const [shape, setShape] = useState("Line")
  const [colour, setColour] = useState("") 
  const [lineWidth, setLineWidth] = useState(1)
  const [inControl, setControl] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [textSize, setTextSize] = useState(20)
  const [elements, setElements] = useLocalStorage("elements", [])

  useEffect(() => {
    props.socket.on("your id", id => {
      console.log("The Socket ID (inside canvas): " + id)
    })
  
    props.socket.on("canvasState", cState => {
      if (!inControl) setElements(cState.body);
    })
  
    props.socket.on("control switch", id => {   
      if (id === props.propsUserID) {
        setControl(true);
      } else {
        setControl(false);
      }
    })
  
    props.socket.on("user-diconnected", () => {
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
    props.socket.emit("take control", props.propsUserID)
  }

  const sendCanvas = (c) => {
    props.socket.emit("send canvas state", c);
  }

  return (
    <div>
      <DrawingBoard propsInControl={inControl} propsTextSize={textSize}
          isPropsDrawing={isDrawing} setIsPropsDrawing={setIsDrawing}
          id={props.propsUserID} propsColour={colour} propsLineWidth={lineWidth}
          propsElements={elements} setPropsElements={setElements}
          propsShape={shape} winWidth={windowWidth} propsSendCanvas={sendCanvas} />

      <ToolBar propsShape={shape} setPropsShape={setShape} setPropsColour={setColour}
            propsElements={elements} setPropsElements={setElements}
            propsInControl={inControl} setPropsControl={setControl} 
            switchControl={switchControl} propsSendCanvas={sendCanvas}
            id={props.propsUserID} setPropsLineWidth={setLineWidth} 
            propsTextSize={textSize} setPropsTextSize={setTextSize}/>
    </div>
  );
}

export default Canvas;
