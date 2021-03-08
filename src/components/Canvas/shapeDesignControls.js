import React, {useState} from 'react'
import './canvas.css'
import useStyles from './useStyles'
import {FormControl, InputLabel, Select, MenuItem, Typography, Grid, Slider} from '@material-ui/core'

function DesignControls (props) {
    const [lineWidth, setLineWidth] = useState(1)
    const [colour, setColour] = useState('')
    const styles = useStyles()
    
    const handleColourChange = (e) => {
        setColour(e.target.value)
        props.setPropsColour(e.target.value)
    }

    const handleLineWidthChange = (event, newValue) => {
        setLineWidth(newValue)
        props.setPropsLineWidth(newValue)
    }

    return (
        <div className='rows'>
            <div className='row'>
                <Grid className={styles.root}>
                    <Typography  gutterBottom>
                            Line width
                    </Typography>
                    <Slider value={lineWidth} onChange={handleLineWidthChange}
                                aria-labelledby="line-slider" disabled={props.isDisabled}
                                min={0.5} max={5}/>
                </Grid>
            </div>

            <div className='row'>
                <FormControl variant="outlined" className={styles.formControl} disabled={props.isDisabled}>
                    <InputLabel>Colour</InputLabel> 
                    <Select
                    id="colourChoice"
                    value={colour}
                    onChange={handleColourChange}
                    label="Colour">
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={'red'}>Red</MenuItem>
                        <MenuItem value={'blue'}>Blue</MenuItem>
                        <MenuItem value={'green'}>Green</MenuItem>
                        <MenuItem value={'black'}>Black</MenuItem>
                        <MenuItem value={'purple'}>Purple</MenuItem>
                        <MenuItem value={'pink'}>Pink</MenuItem>
                        <MenuItem value={'yellow'}>Yellow</MenuItem>
                        <MenuItem value={'orange'}>Orange</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    )
}

export default DesignControls