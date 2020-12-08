import React from 'react';
import rough from 'roughjs/bundled/rough.esm';

const generator = rough.generator();

function createElement(x1, y1, x2, y2) {
  const roughElement = generator.line(x1, y1, x2, y2);
  return {x1, y1, x2, y2, roughElement};
}

class Canvas extends React.Component {

  isDrawing = false;

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      elements: []
    }
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount () {
    this.drawOnCanvas();
  }

  componentDidUpdate (prevState) {
    if (prevState.elements !== this.state.elements) {
      this.drawOnCanvas();
    }
  }

  drawOnCanvas() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    var rc = rough.canvas(canvas);

    this.state.elements.forEach(({roughElement}) => rc.draw(roughElement));
  }

  handleMouseDown (event) {
    this.isDrawing = true;
    var {clientX, clientY} = event;
    var element = createElement(clientX, clientY, clientX, clientY);
    this.defineLineEdges(element);
  }

  handleMouseMove (event) {
    if (!this.isDrawing) return;

    var {clientX, clientY} = event;
    /* Retrieve x,y coords of last item on elements array */
    var index = this.state.elements.length - 1;
    var {x1, y1} = this.state.elements[index];
    var currentElement = createElement(x1, y1, clientX, clientY);
    const elementsCopy = [...this.state.elements];
    elementsCopy[index] = currentElement;

    this.setState({elements: elementsCopy});
  }

  handleMouseUp (event){
    this.isDrawing = false;
    var {clientX, clientY} = event;

    /* Retrieve x,y coords of last item on elements array */
    var index = this.state.elements.length - 1;
    var {x1, y1} = this.state.elements[index];
    var currentElement = createElement(x1, y1, clientX, clientY);

    this.defineLineEdges(currentElement);
  }

  defineLineEdges(element) {
    console.log(element);
    this.setState(prevState => ({
      elements: [...(prevState.elements || []), element]
    }));
  }

  clearCanvas (event) {
    event.preventDefault();
    this.setState({elements:[]});
  }

  loadNewCanvas(event) {
    event.preventDefault();
    var e1 = createElement(365, 166, 695, 66);
    var e2 = createElement(375, 216, 719, 106);

    this.setState({elements: [...this.state.elements, e1, e2]})
  }

  render () {
    return (
      <div>
      <button onClick={e => this.clearCanvas(e)}>Clear</button>
      <button onClick={e => this.loadNewCanvas(e)}>Load Canvas</button>
      <canvas id="canvas"
        style={{backgroundColor:'grey'}}
        width={window.innerWidth}
        height={window.innerHeight * 0.75}
        onMouseDown={e => this.handleMouseDown(e)}
        onMouseMove={e => this.handleMouseMove(e)}
        onMouseUp={e => this.handleMouseUp(e)}>
      </canvas>
      </div>
    );
  }
}

export default Canvas;
