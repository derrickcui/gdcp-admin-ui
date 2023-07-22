import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    result: {
        fontSize: 14,
        color: "red"
    },
    label: {
        fontSize: 14
    },
    selected: {
        color: "red",
        fontSize: 14,
        fontWeight: "bold"
    },
    title: {
        fontSize: 14,
        fontWeight: "bold"
    },
    chip2: {
        display: 'flex', flexDirection:'row', columnGap: 5
    },
    text: {
        fontSize: 14
    },
    labelLeft: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'right',
        color: theme.palette.text.secondary,
    },
    chip: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    docstyle:{
        transition: 'color .2s',
        color: '',
        cursor:"pointer",
        $nest: {
            '&:hover': {
                color: 'blue'
            }
        }
    }
}));

export default useStyles;