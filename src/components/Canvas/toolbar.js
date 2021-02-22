import React from 'react'
import { Button } from '@material-ui/core'
import Radio from '@material-ui/core/Radio'

function ToolBar(props) {

    const clearCanvas = (e) => {
        e.preventDefault()
        props.setPropsElements([])
    }

    const undo = (e) => {
        e.preventDefault()
        var index = props.propsElements.length - 1
        const copy = [...props.propsElements]
        // Remove last element from state
        copy.splice(index, 1)
        props.setPropsElements(copy)
    }

    const changeShape = (e) => {
        e.preventDefault()
        props.setPropsShape(e.target.value)
    }

    const switchControl = (e) => {
        e.preventDefault();
        if (props.propsInControl) {
          props.setPropsControl(false)
          return
        }
        props.switchControl()
    }

    const controlButtonMessage = props.propsInControl ? 'Stop Controlling' : 'Take Control'
    const canvasTextInput = (props.propsShape==="Text") ? 
      <input autoComplete="off"
        placeholder="Enter text here"
        type="text"
        id="inputText"
        name="inputText"/> : <p></p>

    return(
        <div>
            <div>
                <Button onClick={e => switchControl(e)}>{controlButtonMessage}</Button>
            </div>
            <div>
                <Radio checked={props.propsShape==='Line'} name="Choice"
                onChange={changeShape} value="Line"
                defaultChecked color="default"
                />Line 
                <Radio checked={props.propsShape==='Square'} name="Choice" 
                onChange={changeShape} value="Square"
                color="default"
                />Square
                <Radio checked={props.propsShape==='Text'} name="Choice"
                onChange={changeShape} value="Text" color="default"
                />Text
            </div>
            <div>
                {canvasTextInput}
            </div>
            <div>
                <Button onClick={e => undo(e)}>Undo</Button>
                <Button color="secondary" onClick={e => clearCanvas(e)}>Clear</Button>
            </div>
        </div>
    )
}

export default ToolBar