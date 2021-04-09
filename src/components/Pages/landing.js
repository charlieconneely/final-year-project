import React from 'react'
import { Button, TextField } from '@material-ui/core'
import uuid from 'react-uuid'
import './landing.css'

const LandingPage = (props) => {

    function enterRoom() {
        //const id = uuid();
        props.history.push(`/room`);
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
                <Button onClick={enterRoom} variant='outlined' size='large'>Enter Room</Button>
            </div>
        </div>
    )
}

export default LandingPage