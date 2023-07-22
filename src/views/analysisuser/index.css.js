import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: 5
    },
    header: {
        fontSize: '14px',
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
        paddingTop: 0
    },
    subHeader: {
        fontSize: 14,
        fontWeight:"bold",
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
    },
    count: {
        fontSize: 14,
        color:"red",
        fontWeight:"bold"
    },
    chart: {
        height: 80,
        width: '100%'
    },
    rihgtDivder: {
        borderRight: "1px solid #ebebeb"
    }
}));

export default useStyles;