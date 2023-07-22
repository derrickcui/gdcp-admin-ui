import { makeStyles } from '@mui/styles';
import backGroupImage from "../../asset/background-image.png";

const loginUseStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        backgroundImage: `url(${backGroupImage})`,
        backgroundPosition: 'center center',
        backgroundSize: '100% 25%',
        backgroundRepeat: 'repeat-x'
    },
    outerPaper: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#199ED8',
        width: 360,
        paddingTop: 10
    },
    paper: {
        padding: '100px 10px 40px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(0),
    },
    submit: {
        margin: theme.spacing(0, 0, 1),
        backgroundColor: '#199ED8',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#0484af',
            color: '#FFFFFF'
        }
    },
    checkbox: {
        fontSize: "10px",
        marginTop: "10px"
    }
}));

export { loginUseStyles };