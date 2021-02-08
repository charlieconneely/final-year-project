import React from 'react';
import rough from 'roughjs/bundled/rough.esm';
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

class Canvas extends React.Component {

  isDrawing = false;

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      shape: "Line",
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
    context.lineWidth = 5;
    context.strokeStyle="black";
    context.strokeRect(0, 0, canvas.width, canvas.height);
    var rc = rough.canvas(canvas);

    this.state.elements.forEach(({roughElement}) => rc.draw(roughElement));
  }

  handleMouseDown (event) {
    this.isDrawing = true;
    var {clientX, clientY} = event;
    console.log(clientX + " " + clientY);
    var element = createElement(this.state.shape, clientX-50, clientY, clientX-50, clientY);
    this.defineLineEdges(element);
  }

  handleMouseMove (event) {
    if (!this.isDrawing) return;

    var {clientX, clientY} = event;
    /* Retrieve x,y coords of last item on elements array */
    var index = this.state.elements.length - 1;
    var {x1, y1} = this.state.elements[index];
    var currentElement = createElement(this.state.shape, x1, y1, clientX-50, clientY);
    const elementsCopy = [...this.state.elements];
    elementsCopy[index] = currentElement;

    this.setState({...this.state, elements: elementsCopy});
  }

  handleMouseUp (event){
    this.isDrawing = false;
    var {clientX, clientY} = event;

    /* Retrieve x,y coords of last item on elements array */
    var index = this.state.elements.length - 1;
    var {x1, y1} = this.state.elements[index];
    var currentElement = createElement(this.state.shape, x1, y1, clientX-50, clientY);

    this.defineLineEdges(currentElement);
  }

  defineLineEdges(element) {
    this.setState(prevState => ({
      ...prevState.shape,
      elements: [...(prevState.elements || []), element]
    }));
  }

  clearCanvas (event) {
    event.preventDefault();
    this.setState({elements:[]});
  }

  loadNewCanvas(event) {
    event.preventDefault();
    var e1 = createElement("Line", 365, 166, 695, 66);
    var e2 = createElement("Line", 375, 216, 719, 106);

    this.setState({...this.state, elements: [...this.state.elements, e1, e2]})
  }

  changeShape = (event) => {
    this.setState({...this.state, shape: event.target.value});
  }

  render () {
    return (
      <div>
        <div>
          <canvas id="canvas"
            width={window.innerWidth - 100}
            height={window.innerHeight - 200}
            onMouseDown={e => this.handleMouseDown(e)}
            onMouseMove={e => this.handleMouseMove(e)}
            onMouseUp={e => this.handleMouseUp(e)}>
          </canvas>
        </div>
        <div onChange={e => this.changeShape(e)}>
          <input type="radio" value="Line" name="Choice" defaultChecked/> Line
          <input type="radio" value="Square" name="Choice"/> Square
        </div>
        <div>
          <button onClick={e => this.clearCanvas(e)}>Clear</button>
          <button onClick={e => this.loadNewCanvas(e)}>Load Canvas</button>
        </div>
      </div>
    );
  }
}

export default Canvas;
