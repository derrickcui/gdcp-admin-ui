import React from 'react';
import {Typography, Paper} from '@mui/material';
import { loginUseStyles } from './login.css';
import LoginUserName from "./login.username";

export default function Index() {
    const classes = loginUseStyles();

    return (
        <div className={classes.root}>
            <Paper elevation={3} className={classes.outerPaper} square>
                <Paper className={classes.paper} square>
                    <Typography component="h3" style={{fontWeight:"bold", fontSize: 21, color:"#199ED8", paddingBottom: 10}}>
                        Geelink后台管理系统
                    </Typography>
                    <LoginUserName/>
                </Paper>
            </Paper>
        </div>
    );
}