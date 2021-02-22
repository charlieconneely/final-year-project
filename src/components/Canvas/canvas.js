import React, {useState, useEffect, useRef} from 'react'
import uuid from 'react-uuid'
import io from 'socket.io-client'
import useLocalStorage from '../../hooks/useLocalStorage'
import './canvas.css'
import DrawingBoard from './drawingBoard'

function Canvas(props) {

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

  function switchControl(e) {
    e.preventDefault();
    if (inControl) {
      setControl(false)
      return
    }
    socketRef.current.emit("take control", yourID)
  }

  const undo = (event) => {
    event.preventDefault()
    var index = elements.length - 1
    const copy = [...elements]
    // Remove last element from state
    copy.splice(index, 1)
    setElements(copy)
  }

  const clearCanvas = (event) => {
    event.preventDefault()
    setElements([])
  }

  const changeShape = (event) => {
    event.preventDefault()
    setShape(event.target.value)
  }

  const sendCanvas = (canvasObject) => {
    socketRef.current.emit("send canvas state", canvasObject)
  }

  const controlButtonMessage = inControl ? 'Stop Controlling' : 'Take Control'
  const canvasTextInput = (shape==="Text") ? 
    <input autoComplete="off"
      placeholder="Enter text here"
      type="text"
      id="inputText"
      name="inputText"/> : <p></p>

  return (
    <div>
      <div>
        <DrawingBoard sendCanvasState={sendCanvas}
            propsInControl={inControl}
            isPropsDrawing={isDrawing} setIsPropsDrawing={setIsDrawing}
            id={yourID} 
            propsElements={elements} setPropsElements={setElements}
            propsShape={shape} winWidth={windowWidth}/>
      </div>
      <div>
        <button onClick={e => switchControl(e)}>{controlButtonMessage}</button>
      </div>
      <div onChange={e => changeShape(e)}>
        <input type="radio" value="Line" name="Choice" defaultChecked/> Line
        <input type="radio" value="Square" name="Choice"/> Square
        <input type="radio" value="Text" name="Choice"/> Text
      </div>
      <div>
        {canvasTextInput}
      </div>
      <div>
        <button onClick={e => undo(e)}>Undo</button>
        <button onClick={e => clearCanvas(e)}>Clear</button>
      </div>
    </div>
  );
}

export default Canvas;
