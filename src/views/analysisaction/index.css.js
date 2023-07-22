import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    convertRate: {
        '&:hover': {
            cursor: 'pointer',
            color: 'red'
        }
    },
    root: {
        maxWidth: "100%",
        padding: 5
    },
    number: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    label: {
        fontSize: 14,
        color: "grey"
    },
    click: {
        textAlign: 'center',
        padding: 5,
        '&:hover': {
            cursor: 'pointer',
            color: 'red'
        }
    },
    header: {
        fontSize: 14,
        color: 'gray',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        textAlign: 'left',
    },
    headerBorder :{
        borderBottom:"1px solid #ebebeb"
    },
    subHeader: {
        fontSize: 14,
        fontWeight:"bold",
        paddingBottom: 10,
        paddingLeft: 10,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(',')
    },
    divider: {
        borderRight:"1px solid #ebebeb"
    }
}));

export default useStyles;