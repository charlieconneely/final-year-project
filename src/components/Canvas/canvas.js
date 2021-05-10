import React, { useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'
import DrawingBoard from './drawingBoard'
import ToolBar from './toolbar'
import './styling/canvas.css' 

function Canvas(props) {

  const [isDrawing, setIsDrawing] = useState(false)
  const [shape, setShape] = useState("Line")
  const [colour, setColour] = useState("") 
  const [lineWidth, setLineWidth] = useState(1)
  const [inControl, setControl] = useState(false)
  const [textSize, setTextSize] = useState(20)
  const [elements, setElements] = useLocalStorage("elements", [])

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

  props.socket.on("user-disconnected", () => {
    console.log("User disconnected")
  })

  // called from toolBar component
  const switchControl = () => {   
    props.socket.emit("take control", props.propsUserID)
  }

  const sendCanvas = (cState) => {
    props.socket.emit("send canvas state", cState);
  }

  return (
    <div>
      <ToolBar propsShape={shape} setPropsShape={setShape} setPropsColour={setColour}
            propsElements={elements} setPropsElements={setElements}
            propsInControl={inControl} setPropsControl={setControl} 
            switchControl={switchControl} propsSendCanvas={sendCanvas}
            id={props.propsUserID} setPropsLineWidth={setLineWidth} 
            propsTextSize={textSize} setPropsTextSize={setTextSize}/>
      <DrawingBoard propsInControl={inControl} propsTextSize={textSize}
          isPropsDrawing={isDrawing} setIsPropsDrawing={setIsDrawing}
          id={props.propsUserID} propsColour={colour} propsLineWidth={lineWidth}
          propsElements={elements} setPropsElements={setElements}
          propsShape={shape} winWidth={props.winWidth} propsSendCanvas={sendCanvas} />
    </div>
  );
}

export default Canvas;
