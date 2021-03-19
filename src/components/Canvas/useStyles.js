import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(5),
      minWidth: 110,
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    root: {
        width: 100,
    },
}))

export default useStyles