import React, {useState} from 'react'
import {FormControl, InputLabel, Select, MenuItem, makeStyles} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 110
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
}))

function SelectColour (props) {
    const [colour, setColour] = useState('')
    const classes = useStyles()
    
    const handleChange = (e) => {
        setColour(e.target.value)
        props.setPropsColour(e.target.value)
    }

    return (
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Colour</InputLabel> 
            <Select
            id="colourChoice"
            value={colour}
            onChange={handleChange}
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
    )
}

export default SelectColour