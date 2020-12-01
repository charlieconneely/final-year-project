import React from 'react';
import rough from 'roughjs/bundled/rough.esm';

const generator = rough.generator();

function createElement(x1, y1, x2, y2) {
  const roughElement = generator.line(x1, y1, x2, y2);
  return {x1, y1, x2, y2, roughElement};
}

class Canvas extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isDrawing: null,
      elements: []
    }
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount () {
    this.drawOnCanvas();
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.elements !== this.state.elements) {
      this.drawOnCanvas();
    }
  }

  drawOnCanvas() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    var rc = rough.canvas(canvas);

    var r1 = generator.rectangle(400, 150, 100, 150, {
      fill: 'blue',
      hachureAngle: 60,
      hachureGap: 10,
      fillWeight: 5
    });

    var r2 = generator.rectangle(500, 150, 100, 150, {
      fill: 'white',
      hachureAngle: 60,
      hachureGap: 10,
      fillWeight: 5
    });

    rc.draw(r1);
    rc.draw(r2);

    this.state.elements.forEach(({roughElement}) => rc.draw(roughElement));
  }

  handleMouseDown (event) {
    var {clientX, clientY} = event;
    var element = createElement(clientX, clientY, clientX, clientY);
    this.setState(prevState => ({
      elements: [...(prevState.elements || []), element]
    }));
    console.log(clientX, clientY);
  }

  /* 
  to be used to actively draw the line before onMouseUp
  issue - prevState is not itterable
  handleMouseMove (event)  
  */

  handleMouseUp (event){
    var {clientX, clientY} = event;

    /* Retrieve x,y coords of last item on elements array */
    var index = this.state.elements.length - 1;
    var {x1, y1} = this.state.elements[index];
    var currentElement = createElement(x1, y1, clientX, clientY);

    this.setState(prevState => ({
      elements: [...(prevState.elements || []), currentElement]
    }));
  } 

  render () {
    return (
      <canvas id="canvas"
        style={{backgroundColor:'grey'}}
        width={window.innerWidth}
        height={window.innerHeight * 0.75}
        onMouseDown={e => this.handleMouseDown(e)}
        onMouseUp={e => this.handleMouseUp(e)}>
      </canvas>
    );
  }
}

export default Canvas;
