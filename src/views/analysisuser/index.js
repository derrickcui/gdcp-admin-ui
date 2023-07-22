import React from 'react';
import {Grid} from "@mui/material";
import UserDistribution from "./user.distribution";
import ActiveUser from "./active.user";
import UserVolume from './volume';
import UserAnalysis from './analysis';

export default function AnalysisUser() {
    return(
        <Grid container spacing={1}>
            <Grid item xs={5}>
                <UserDistribution/>
            </Grid>
            <Grid item xs={7}>
                <ActiveUser/>
            </Grid>
            <Grid item xs={12}>
                <UserVolume/>
            </Grid>
            <Grid item xs={12}>
                <UserAnalysis/>
            </Grid>
        </Grid>
    )
}