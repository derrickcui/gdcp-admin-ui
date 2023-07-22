import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: 10
    },
    header: {
        fontSize: 16,
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
        paddingTop: 10
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
    datePicker: {
        textAlign:"center",
        paddingTop:10
    },
    divider: {
        borderRight: "1px solid #ebebeb"
    },
    chart: {
        height: 300
    }
}));

export default useStyles;