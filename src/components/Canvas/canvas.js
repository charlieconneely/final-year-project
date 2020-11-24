import React, { useLayoutEffect, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';

const generator = rough.generator();

function createElement(x1, y1, x2, y2) {
  const roughElement = generator.line(x1, y1, x2, y2);
  return {x1, y1, x2, y2, roughElement};
}

const Canvas = () => {

  const [elements, setElements] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const rc = rough.canvas(canvas);

    const r1 = generator.rectangle(400, 200, 200, 250, {
        fill: 'blue',
        stroke: 'black',
        hachureAngle: 60,
        hachureGap: 10,
        fillWeight: 5,
        strokeWidth: 5
    });

    const r2 = generator.rectangle(600, 200, 200, 250, {
        fill: 'white',
        stroke: 'black',
        hachureAngle: 60,
        hachureGap: 10,
        fillWeight: 5,
        strokeWidth: 5
    });

    rc.draw(r1);
    rc.draw(r2);

    elements.forEach(({roughElement}) => rc.draw(roughElement));
  }, [elements]);

  const handleMouseDown = (event) => {
    setIsDrawing(true);
    const {clientX, clientY} = event;
    const element = createElement(clientX, clientY, clientX, clientY);
    setElements(prevState => [...prevState, element]);
  };

  const handleMouseMove = (event) => {
    /* If drawing - track x and y coords */
    if (!isDrawing) return;

    const {clientX, clientY} = event;

    /* Retrieve last item on elements array */
    const index = elements.length - 1;
    const {x1, y1} = elements[index];
    const currentElement = createElement(x1, y1, clientX, clientY);

    const elementsCopy = [...elements];
    elementsCopy[index] = currentElement;
    setElements(elementsCopy);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <canvas id="canvas"
            style={{backgroundColor:'grey'}}
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}>
    </canvas>
  );
}

export default Canvas;
