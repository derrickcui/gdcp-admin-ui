import React from 'react';
import Paper from '@mui/material/Paper';
import {useParams} from 'react-router';
import makeStyle from "./index.css";


export default function Summary() {
    const classes = makeStyle();
    let papram = useParams();
    let papramArray = papram.id.split("&&");
    return(
        <Paper variant="outlined" className={classes.title}>
            {papram.id.split("&&")[0]}
        </Paper>
    )
}