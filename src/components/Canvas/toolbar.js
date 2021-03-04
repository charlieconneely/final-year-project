import React from 'react'
import { Button, TextField, Radio } from '@material-ui/core'
import SelectColour from './selectColour'
import './canvas.css'

function ToolBar(props) {

    const sendCanvasAcrossPeers = (c) => {
        props.propsSocketRef.emit("send canvas state", c)
    }

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
        sendCanvasAcrossPeers(canvasObject)
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
        sendCanvasAcrossPeers(canvasObject)
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

    // disable buttons and input fields if not in control
    const isDisabled = !props.propsInControl 

    // called from selectColour.js
    const setPropsColour = (colour) => {
        props.setPropsColour(colour)
    }

    const setPropsLineWidth = (val) => {
        props.setPropsLineWidth(val)
    }

    const controlButtonMessage = props.propsInControl ? 'Stop Controlling' : 'Take Control'

    const textInput = (props.propsShape === "Text") ? 
        <div className='row'>
            &nbsp;<TextField autoComplete="off"
            label="Enter text here"
            id="inputText"
            name="inputText" disabled={isDisabled}/>
        </div> : <div className='row'></div>

    return(
        <div className='rows'>
            <div>
                <Button onClick={e => switchControl(e)}>{controlButtonMessage}</Button>
            </div>
            <div className='row'>
                <SelectColour setPropsColour={setPropsColour} isDisabled={isDisabled}
                     setPropsLineWidth={setPropsLineWidth}/>
            </div>
            <div className='row'>
                <Radio checked={props.propsShape==='Line'} name="Choice"
                onChange={changeShape} value="Line"
                defaultChecked disabled={isDisabled} color="default"
                />Line &nbsp;
                <Radio checked={props.propsShape==='Square'} name="Choice" 
                onChange={changeShape} value="Square"
                color="default" disabled={isDisabled}
                />Square &nbsp;
                <Radio checked={props.propsShape==='Circle'} name="Choice" 
                onChange={changeShape} value="Circle"
                color="default" disabled={isDisabled}
                />Circle &nbsp;
                <Radio checked={props.propsShape==='Text'} name="Choice"
                onChange={changeShape} value="Text" color="default"
                disabled={isDisabled}
                />Text &nbsp;
            </div>
            {textInput}
            <div>
                <Button onClick={e => undo(e)} disabled={isDisabled}>Undo</Button>
                <Button color="secondary" onClick={e => clearCanvas(e)} disabled={isDisabled}>Clear</Button>
            </div>
        </div>
    )
}

export default ToolBar