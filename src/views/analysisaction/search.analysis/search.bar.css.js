import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        elevation: 0,
        fontSize: 14

    },
    label: {
        fontSize: 14
    },
    textField: {
        width: 100
    },
    searchBar: {
        paddingLeft: 20
    }
}));

export default useStyles;