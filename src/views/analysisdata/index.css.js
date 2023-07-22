import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: 5
    },
    root2: {
        height:380,
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
        paddingTop: 10
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
        ].join(',')
    },
    content: {
        paddingBottom: 20
    },
    chart: {
        height: 180,
        width: '100%'
    },
    rihgtDivder: {
        borderRight: "1px solid #ebebeb"
    }
}));

export default useStyles;