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
        <div class="backgroundLogo">
            <div id="enterButton">
                <Button onClick={enterRoom} variant='outlined' color="primary" size='large'>Enter Room</Button>
            </div>
            <p id="creditsSection">Created by: <a href="https://github.com/ConnorBrookfield">Connor Brookfield</a> and <a href="https://github.com/charlieconneely">Charlie Conneely</a></p>
        </div>
    )
}

export default LandingPage