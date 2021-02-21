import React, {useState,useLayoutEffect} from 'react'
import rough from 'roughjs/bundled/rough.esm'
//import socketIO from 'socket.io-client'
import useLocalStorage from '../../hooks/useLocalStorage'
import './canvas.css'

const generator = rough.generator();

function createElement(shape, x1, y1, x2, y2) {
  var roughElement;
  
  if (shape === "Square") {
    roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1)
  } else {
    roughElement = generator.line(x1, y1, x2, y2)
  }
  return {x1, y1, x2, y2, roughElement};
}

function Canvas(props) {
 
  const [isDrawing, setIsDrawing] = useState(false)
  const [shape, setShape] = useState("Line")
  const [elements, setElements] = useLocalStorage("elements", []) 

  /*useEffect(() => {
    var socket = socketIO('http://localhost:3000/')
    drawOnCanvas()
  }, [])*/

  useLayoutEffect(() => {
    var canvas = document.getElementById("canvas"); 
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 5;
    context.strokeStyle="black";
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.font = '28px serif';
    var rc = rough.canvas(canvas);

    elements.forEach(e => {
      /* check if item is a text element */
      if (e.hasOwnProperty('type')) {
        context.fillText(e.val, e.xco, e.yco);
        return;
      }
      rc.draw(e.roughElement)
    });
  }, [elements])

  const handleMouseDown = (event) => {
    var {pageX, pageY} = event;
    var xPos = pageX - document.getElementById('canvas').offsetLeft;
    var yPos = pageY - document.getElementById('canvas').offsetTop;

    /* if text is selected - add textElement obj to state with value from input field */
    if (shape === "Text") {
      var textInputElement = {
        type:"Text", 
        val:document.getElementById('inputText').value,
        xco:xPos, 
        yco:yPos
      }
      setElements(prevState => [...prevState, textInputElement])
      return;
    } 

    setIsDrawing(true)
    const element = createElement(shape, xPos, pageY, xPos, yPos);
    setElements(prevState => [...prevState, element])
  }

  const handleMouseMove =(event) => {
    if (!isDrawing) return;

    var {pageX, pageY} = event;
    // Account for offset
    var xPos = pageX - document.getElementById('canvas').offsetLeft;
    var yPos = pageY - document.getElementById('canvas').offsetTop;
    // Retrieve x,y coords of last item on elements array 
    var index = elements.length - 1;
    var {x1, y1} = elements[index];
    
    var currentElement = createElement(shape, x1, y1, xPos, yPos);
    const elementsCopy = [...elements];
    elementsCopy[index] = currentElement;

    setElements(elementsCopy)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
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

  return (
    <div>
      <div>
        <canvas id="canvas"
          width={window.innerWidth - 100}
          height={window.innerHeight - 200}
          onMouseDown={e => handleMouseDown(e)} 
          onMouseMove={e => handleMouseMove(e)}
          onMouseUp={handleMouseUp}>
        </canvas>
      </div>
      <div onChange={e => changeShape(e)}>
        <input type="radio" value="Line" name="Choice" defaultChecked/> Line
        <input type="radio" value="Square" name="Choice"/> Square
        <input type="radio" value="Text" name="Choice"/> Text   
      </div>
      <div>
        &nbsp; <input autoComplete="off" 
                  placeholder="Enter text here"
                  type="text"
                  id="inputText"
                  name="inputText"/>
      </div>
      <div>
        <button onClick={e => undo(e)}>Undo</button>
        <button onClick={e => clearCanvas(e)}>Clear</button>
      </div>
    </div>
  );
}

export default Canvas;
