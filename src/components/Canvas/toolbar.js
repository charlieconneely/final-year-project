import React from 'react'
import { Button } from '@material-ui/core'
import Radio from '@material-ui/core/Radio'
import TextField from '@material-ui/core/TextField';
import SelectColour from './selectColour'

function ToolBar(props) {

    const clearCanvas = (e) => {
        e.preventDefault()
        if (!props.propsInControl) return;
        // empty canvas array of elements
        props.setPropsElements([])
        // send canvas state to peers
        const canvasObject = {
            body: [],
            id: props.id
          }
        props.sendCanvasState(canvasObject)
    }

    const undo = (e) => {
        e.preventDefault()
        if (!props.propsInControl) return;
        var index = props.propsElements.length - 1
        const copy = [...props.propsElements]
        // Remove last element from state
        copy.splice(index, 1)
        // overwrite props array of elements
        props.setPropsElements(copy)

        // send canvas state to peers
        const canvasObject = {
            body: copy,
            id: props.id
        }
        props.sendCanvasState(canvasObject)
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
        props.setPropsControl(true)
        props.switchControl()
    }

    // called from selectColour.js
    const setPropsColour = (colour) => {
        props.setPropsColour(colour)
    }

    const controlButtonMessage = props.propsInControl ? 'Stop Controlling' : 'Take Control'
    const canvasTextInput = (props.propsShape==="Text") ? 
      <div><TextField autoComplete="off"
        label="Enter text here"
        id="inputText"
        name="inputText"/></div> : <div><p></p></div>
    const UndoClearButtons = props.propsInControl ? 
        <div>
            <Button onClick={e => undo(e)}>Undo</Button>
            <Button color="secondary" onClick={e => clearCanvas(e)}>Clear</Button>
        </div>
        :
        <div>
            <Button onClick={e => undo(e)} disabled={true}>Undo</Button>
            <Button color="secondary" onClick={e => clearCanvas(e)} disabled={true}>Clear</Button>
        </div>

    return(
        <div>
            <div>
                <Button onClick={e => switchControl(e)}>{controlButtonMessage}</Button>
            </div>
            <div>
                <SelectColour setPropsColour={setPropsColour} />
                <Radio checked={props.propsShape==='Line'} name="Choice"
                onChange={changeShape} value="Line"
                defaultChecked color="default"
                />Line 
                <Radio checked={props.propsShape==='Square'} name="Choice" 
                onChange={changeShape} value="Square"
                color="default"
                />Square
                <Radio checked={props.propsShape==='Circle'} name="Choice" 
                onChange={changeShape} value="Circle"
                color="default"
                />Circle
                <Radio checked={props.propsShape==='Text'} name="Choice"
                onChange={changeShape} value="Text" color="default"
                />Text
            </div>
            {canvasTextInput}
            {UndoClearButtons}
        </div>
    )
}

export default ToolBar