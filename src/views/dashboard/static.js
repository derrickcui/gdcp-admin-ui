import React, {useEffect, useState}  from 'react';
import {Avatar, Grid, Paper} from "@mui/material";
import allUserIcon from '../../asset/allUser.png';
import userTotalIcon from '../../asset/userTotal.png';
import searchTotalIcon from '../../asset/searchTotal.png';
import searchCountIcon from '../../asset/searchCount.png';
import searchRateIcon from '../../asset/searchRate.png';
import searchCount from '../../asset/searchCountIcon.png'
import readCountIcon from '../../asset/readCount.png'
import sessionCountIcon from '../../asset/sessionCount.png'
import avgTime from '../../asset/avgTime.png'
import clickcount from '../../asset/clickcount.png'
import clickRate from '../../asset/clickRate.png'
import avgClickPosition from '../../asset/avgClickPosition.png'
import useStyles from "./static.css";



export default function Static(props) {
    const classes = useStyles();
    const [ noActive, setNoActive] = useState();

    useEffect(() => {
        if ( props.order === 'allUser' ) {
            setNoActive(allUserIcon);
        }else if ( props.order === 'userTotal' ) {
            setNoActive(userTotalIcon);
        }else if ( props.order === 'searchTotal' ) {
            setNoActive(searchTotalIcon);
        }else if ( props.order === 'searchCount' ) {
            setNoActive(searchCountIcon);
        }else if ( props.order === 'searchRate' ) {
            setNoActive(searchRateIcon);
        }else if ( props.order === 'searchCountIcon' ) {
            setNoActive(searchCount);
        }else if ( props.order === 'readCount' ) {
            setNoActive(readCountIcon);
        }else if ( props.order === 'sessionCount' ) {
            setNoActive(sessionCountIcon);
        }else if ( props.order === 'avgTime' ) {
            setNoActive(avgTime);
        }else if ( props.order === 'clickcount' ) {
            setNoActive(clickcount);
        }else if ( props.order === 'clickRate' ) {
            setNoActive(clickRate);
        }else if ( props.order === 'avgClickPosition' ) {
            setNoActive(avgClickPosition);
        }
    }, [props.order]);

    return(
        <Paper variant="outlined" className={classes.paper} style={{backgroundColor: '#EDE7F6'}}>
            <Grid container>
                <Grid item xs={6}>
                    <Avatar style={{  color: '#fff',width: 55,height: 55,backgroundColor: props.color}}>
                    <img src={noActive} height={30} width={30} />
                    </Avatar>
                </Grid>
                <Grid item container direction={'column'} xs={6}>
                    <Grid item className={classes.gridnum}>
                        {props.number}
                    </Grid>
                    <Grid item className={classes.gridlabel}>
                        {props.label}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}