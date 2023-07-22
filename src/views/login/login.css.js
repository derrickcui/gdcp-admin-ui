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
        height: 260,
        padding: '10px 10px 40px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '80%', // Fix IE 11 issue.
        marginTop: theme.spacing(4),
    },
    submit: {
        margin: theme.spacing(2, 0, 2),
        backgroundColor: '#199ED8',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#0484af',
            color: '#FFFFFF'
        }
    },
    country: {
        backgroundColor: 'grey'
    }
}));

export { loginUseStyles };