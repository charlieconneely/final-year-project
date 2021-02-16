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

  componentWillMount() {
    localStorage.getItem('elements') && this.setState({
      ...this.state,
      elements: JSON.parse(localStorage.getItem('elements'))
    })
  }

  componentDidMount () {
    this.drawOnCanvas();
  }

  componentDidUpdate (prevState) {
    if (prevState.elements !== this.state.elements) {
      this.drawOnCanvas();
    }
  }

  componentWillUpdate (nextProps, nextState) {
    localStorage.setItem('elements', JSON.stringify(nextState.elements));
  }

  drawOnCanvas() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 5;
    context.strokeStyle="black";
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.font = '28px serif';
    var rc = rough.canvas(canvas);

    this.state.elements.forEach(e => {
      /* check if item is a text element */
      if (e.hasOwnProperty('type')) {
        context.fillText(e.val, e.xco, e.yco);
        return;
      }
      rc.draw(e.roughElement)
    });
  }

  handleMouseDown (event) {
    var {clientX, clientY} = event;

    /* if text is selected - add textElement obj to state with value from input field */
    if (this.state.shape === "Text") {
      var textInputElement = {
        type:"Text", 
        val:document.getElementById('inputText').value,
        xco:clientX-50, 
        yco:clientY
      }
      this.setState({
        ...this.state, 
        elements: [...this.state.elements, textInputElement]
      })
      return;
    } 

    this.isDrawing = true;
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

    this.setState({
      ...this.state, 
      elements: elementsCopy
    });
  }

  handleMouseUp (){
    this.isDrawing = false;
  }

  defineLineEdges(element) {
    this.setState(prevState => ({
      ...prevState.shape,
      elements: [...(prevState.elements || []), element]
    }));
  }

  undo(event) {
    event.preventDefault();
    var index = this.state.elements.length - 1;
    const copy = [...this.state.elements];
    /* Remove last element from state */
    copy.splice(index, 1);
    this.setState({...this.state, elements: copy});
  }

  clearCanvas(event) {
    event.preventDefault();
    this.setState({elements:[]});
  }

  changeShape = (event) => {
    this.setState({
      ...this.state,
      shape: event.target.value
    });
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
            onMouseUp={this.handleMouseUp}>
          </canvas>
        </div>
        <div onChange={e => this.changeShape(e)}>
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
          <button onClick={e => this.undo(e)}>Undo</button>
          <button onClick={e => this.clearCanvas(e)}>Clear</button>
        </div>
      </div>
    );
  }
}

export default Canvas;
