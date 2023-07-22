import { makeStyles } from '@mui/styles';

const dashboardStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
        [theme.breakpoints.up('md')]: {
            width: "100%"
        },
        [theme.breakpoints.down('xs')]: {
            width: "100%"
        },
    },
    container: {
        margin: 'auto',
        [theme.breakpoints.up('md')]: {
            width: "80%"
        },
        [theme.breakpoints.down('xs')]: {
            width: "100%"
        },
    },
    company: {
        minHeight: 300,
        paddingTop: 50,
        margin: 'auto',
        [theme.breakpoints.up('md')]: {
            width: "75%"
        },
        [theme.breakpoints.down('xs')]: {
            width: "100%"
        },
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    upload: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    listItemText:{
        fontSize: 14
    }
}));

export default dashboardStyles;