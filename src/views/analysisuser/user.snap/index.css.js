import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: 5
    },
    header: {
        fontSize: 14,
        fontWeight: "bold",
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
    user_info: {
        fontSize: 14,
        fontWeight: "bold",
        color: "grey",
        marginRight: 20,
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
    subHeader: {
        fontSize: 14,
        fontWeight:"bold",
        paddingBottom: 5,
        paddingLeft: 5,
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
    select: {
        paddingBottom: 5
    }
}));

export default useStyles;