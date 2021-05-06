import React, { useLayoutEffect } from 'react'
import shapeGenerator from './shapeGenerator'
import rough from 'roughjs/bundled/rough.esm'
import './styling/canvas.css'

function DrawingBoard (props) {

  useLayoutEffect(() => {
      var canvas = document.getElementById("canvas");
      var context = canvas.getContext('2d');
      var rc = rough.canvas(canvas)

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = 5;
      context.strokeStyle="black";
      context.strokeRect(0, 0, canvas.width, canvas.height);

      props.propsElements.forEach(e => {
        // check if item is a text element
        if (e.hasOwnProperty('type')) {
          context.font = e.size + 'px serif';
          context.fillText(e.val, e.xco, e.yco);
          return;
        }
        rc.draw(e.roughElement)
      });

  }, [props.propsElements, props.winWidth])

  const handleMouseDown = (event) => {
      var {pageX, pageY} = event;
      var xPos = pageX - document.getElementById('canvas').offsetLeft;
      var yPos = pageY - document.getElementById('canvas').offsetTop;

      // if text is selected - add textElement obj to state with value from input field
      if (props.propsShape === "Text") {
        var textInputElement = {
          type:"Text",
          val:document.getElementById('inputText').value,
          xco:xPos,
          yco:yPos,
          size: props.propsTextSize
        }
        props.setPropsElements(prevState => [...prevState, textInputElement])
        return;
      }

      props.setIsPropsDrawing(true)
      const element = shapeGenerator(props.propsShape, props.propsColour, xPos, yPos, xPos, yPos, props.propsLineWidth);
      props.setPropsElements(prevState => [...prevState, element])
  }

  const handleMouseMove = (event) => {
      if (!props.isPropsDrawing) return;

      var {pageX, pageY} = event;
      // Account for offset
      var xPos = pageX - document.getElementById('canvas').offsetLeft;
      var yPos = pageY - document.getElementById('canvas').offsetTop;
      // Retrieve x,y coords of last item on elements array
      var index = props.propsElements.length - 1;
      var {x1, y1} = props.propsElements[index];

      var currentElement = shapeGenerator(props.propsShape, props.propsColour, x1, y1, xPos, yPos, props.propsLineWidth);
      const elementsCopy = [...props.propsElements];
      elementsCopy[index] = currentElement;

      props.setPropsElements(elementsCopy)
  }

  const handleMouseUp = () => {
      props.setIsPropsDrawing(false)
      if (!props.propsInControl) return;
      // if in control - send updated elements array across socket
      const canvasObject = {
          body: props.propsElements,
          id: props.id
      }
      props.propsSendCanvas(canvasObject)
  }

  let unsupportedMessage = "Your browser does not support our features.";
  let canvasWidth = window.innerWidth - 100;
  let canvasHeight = window.innerHeight - 200;
  // if player is in control - return canvas with event handling
  const canvasItem = props.propsInControl ?
    <canvas id="canvas"
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={e => handleMouseDown(e)}
      onMouseMove={e => handleMouseMove(e)}
      onMouseUp={handleMouseUp}>
        {unsupportedMessage}
    </canvas>
    // else - return non-interactive canvas
    :
    <canvas id="canvas"
      width={canvasWidth}
      height={canvasHeight}>
      {unsupportedMessage}
    </canvas>

  return (
      <div>
          {canvasItem}
      </div>
  )
}

export default DrawingBoard
