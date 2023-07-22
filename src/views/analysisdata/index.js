import React from 'react';
import {Grid, Paper} from '@mui/material';
import Usage from './usage';
import VolumnChanges from './volume.changes';
import Trend from './trend';
import Analysis from './analysis';
import makeStyle from "./index.css";

export default function DataStat(){
    const classes = makeStyle();

    return(
        <Grid container spacing={1}>
            <Grid item xs={12} >

                <Paper elevation={0} className={classes.root} variant="outlined">
                    <Grid container>
                        <Grid item xs={5} className={classes.rihgtDivder}>
                            <Usage/>
                        </Grid>
                        <Grid item xs={7}>
                            <VolumnChanges/>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Trend/>
            </Grid>
            <Grid item xs={12}>
                <Analysis/>
            </Grid>
        </Grid>
    )
}