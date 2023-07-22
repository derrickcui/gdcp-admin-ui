import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: '1px 2px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        border: "1px solid grey",
        margin: "auto"
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 5,
    },
}));

export default useStyles;