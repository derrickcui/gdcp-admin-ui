import { makeStyles } from '@mui/styles';
import { green, pink } from '@mui/material/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    pink: {
        color: theme.palette.getContrastText(pink[500]),
        backgroundColor: pink[500],
    },
    green: {
        color: '#fff',
        width: 50,
        height: 50,
        backgroundColor: green[500],
    },
    paper: {
        width: 240,
        padding: 10,
        border: '1px solid #f2f2f2'
    },
    gridnum: {
        fontSize: 20,
        fontWeight:'bold'
    },
    gridlabel: {
        fontSize: 14,
        color:'grey'
    }
}));

export default useStyles;