import React from 'react'
import { Button, TextField } from '@material-ui/core'
import uuid from 'react-uuid'
import './landing.css'

const LandingPage = (props) => {

    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
        <div className='container'>
            <div className='heading'>
                <h2>Welcome to Videsign</h2> 
            </div>
            <div className='authors'>
                <p>Created by: Charlie Conneely & Connor Brookfield</p>
            </div>
            <div className='option'>
                <Button onClick={create} variant='outlined' size='large'>Host Room</Button>
            </div>
            <div className='option'>
                <TextField autoComplete="off"
                    label="Enter room ID here" /> 
                <Button variant='outlined' size='large'>Join Room</Button>
            </div>
        </div>
    )
}

export default LandingPage