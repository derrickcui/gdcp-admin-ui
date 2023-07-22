import React, { useState,useEffect,useContext }  from 'react';
import {Grid, Typography, Paper, Divider} from '@mui/material';
import jwt_decode from "jwt-decode";
import {getRowText} from '../../intl/provider';
import useStyles from "./index.css";
import {DATAMAP_SUCCESS, LOADING, LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import {useQueryDistribute} from "../../service/datamap";


export default function Summary() {
    const classes = useStyles();

    const {application, setMessage} = useContext(AppContext);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getSearchCount, loading: getSearchCountLoading, error: getSearchCountError}, getSearchCountApi] = useQueryDistribute(
        {}, {manual: true});

     const [{data: getSearchSuccessCount, loading: getSearchSuccessCountLoading, error: getSearchSuccessCountError}, getSearchSuccessCountApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getUnClickSearchCount, loading: getUnClickSearchCountLoading, error: getUnClickSearchCountError}, getUnClickSearchCountApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getUnSearchCount, loading: getUnSearchCountLoading, error: getUnSearchCountError}, getUnSearchCountApi] = useQueryDistribute(
        {}, {manual: true});

    const [ searchCount, setSearchCount ] = useState();
    const [ searchSuccessCount, setSearchSuccessCount ] = useState();
    const [ unClickSearchCount, setUnClickSearchCount ] = useState();
    const [ unSearchCount, setUnSearchCount ] = useState();

    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        let param = {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                clickType:"search"
            }

            getSearchCountApi({
                url: '/click/count',
                params: param
            });
            

            param.isValid=1;
            getSearchSuccessCountApi({
                url: '/click/count',
                params: param
            });
            
            param.isValid=-1;
            param.isSearchHit=1;
          getUnClickSearchCountApi({
            url: '/click/count',
            params: param
        });
            
            param.isSearchHit=-1;
           getUnSearchCountApi({
            url: '/click/count',
            params: param
        });
    
    }, [ ]);

    useEffect(() => {
        if (getUnSearchCountLoading === false) {
            if (getUnSearchCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUnSearchCountError")
                });
            } else if (getUnSearchCount) {
                if(getUnSearchCount.dmcode === DATAMAP_SUCCESS) {
                    let count=getUnSearchCount.result.count;
                    setUnSearchCount(count);
                }
            }
        }
    }, [getUnSearchCountLoading]);

    useEffect(() => {
        if (getUnClickSearchCountLoading === false) {
            if (getUnClickSearchCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUnClickSearchCountError")
                });
            } else if (getUnClickSearchCount) {
                if(getUnClickSearchCount.dmcode === DATAMAP_SUCCESS) {
                    let count=getUnClickSearchCount.result.count;
                    setUnClickSearchCount(count);
                }
            }
        }
    }, [getUnClickSearchCountLoading]);

    useEffect(() => {
        if (getSearchSuccessCountLoading === false) {
            if (getSearchSuccessCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getSearchSuccessCountError")
                });
            } else if (getSearchSuccessCount) {
                if(getSearchSuccessCount.dmcode === DATAMAP_SUCCESS) {
                    let count=getSearchSuccessCount.result.count;
                    setSearchSuccessCount(count);
                }
            }
        }
    }, [getSearchSuccessCountLoading]);

    useEffect(() => {
        if (getSearchCountLoading === false) {
            if (getSearchCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getSearchCountError")
                });
            } else if (getSearchCount) {
                if(getSearchCount.dmcode === DATAMAP_SUCCESS) {
                    let count=getSearchCount.result.count;
                    setSearchCount(count);
                }
            }
        }
    }, [getSearchCountLoading]);

  
    return(
        <Paper variant="outlined" className={classes.root}>
            <Grid container spacing={1} direction={"column"}>
                <Grid item className={classes.header}>
                    {getRowText("searchAllCount")}
                </Grid>

                <Grid item>
                    <Divider/>
                </Grid>
                <Grid item>
                    <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-around'}}>
                        <div className={classes.click}>
                            <Typography className={classes.number}>
                                {getSearchCountLoading.pending && LOADING}
                                {searchCount}
                            </Typography>
                            <Typography className={classes.label}>{getRowText("searchAllTotal")}</Typography>
                        </div>

                        <div className={classes.click}>
                            <Typography className={classes.number}>
                                {getSearchSuccessCountLoading.pending && LOADING}
                                {searchSuccessCount}
                            </Typography>
                            <Typography className={classes.label}>{getRowText("searchSuccessCount")}</Typography>
                        </div>

                        <div className={classes.click}>
                            <Typography className={classes.number}>
                                {getUnClickSearchCountLoading.pending && LOADING}
                                {unClickSearchCount}
                            </Typography>
                            <Typography className={classes.label}>{getRowText("unClickSearchCount")}</Typography>
                        </div>

                        <div className={classes.click}>
                            <Typography className={classes.number}>
                                {getUnSearchCountLoading.pending && LOADING}
                                {unSearchCount}
                            </Typography>
                            <Typography className={classes.label}>{getRowText("unSearchCount")}</Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Paper>
    )
}