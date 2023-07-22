import React from 'react';
import {Card, CardContent, CardHeader, Grid} from "@mui/material";
import dashboardStyles from "./index.css";
import Map from '../../component/map/index';
import TopUser from "./top.user";
import {getRowText} from '../../intl/provider';
import useStyles from "./active.user.css";

export default function ActiveUser() {
    const classes = dashboardStyles();
    const headerClasses = useStyles();

    return(
        <Card variant="outlined" className={classes.root}>
            <CardHeader title={<span style={{fontSize: 14}}>{getRowText("topUserSort")}</span>} className={headerClasses.header}>
            </CardHeader>
            <CardContent>
                <Grid container direction={"row"} spacing={1}>
                    <Grid item>
                        <Map/>
                    </Grid>
                    <Grid item>
                        <TopUser/>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}