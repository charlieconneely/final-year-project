import React from 'react'
import { Button, TextField } from '@material-ui/core'
import './landing.css'

function LandingPage() {

    return (
        <div class='container'>
            <div class='option'>
                <h2>Welcome to Videsign</h2>
            </div>
            <div class='option'>
                <Button variant='outlined' size='large'>Host Room</Button>
            </div>
            <div class='option'>
                <TextField autoComplete="off"
                    label="Enter room ID here" /> 
                <Button variant='outlined' size='large'>Join Room</Button>
            </div>
        </div>
    )
}

export default LandingPage