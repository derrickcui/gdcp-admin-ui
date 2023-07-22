import {makeStyles} from "@mui/styles";

export const useStyles = makeStyles(theme => ({
    root: {
        margin: "auto",
        padding: "10px"
    },
    formTextLabel: {
        fontSize: 14,
        float: "right",
        marginRight: "20px"
    },
    title: {
        fontSize: 14,
        fontWeight: "bold"
    },
    error: {
        fontSize: 10,
        color: 'red'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));


export { makeStyles };