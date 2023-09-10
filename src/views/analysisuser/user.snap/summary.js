import React, {useState, useEffect, useContext} from 'react';
import { Grid, Paper } from '@mui/material';
import {useParams} from 'react-router';
import jwt_decode from "jwt-decode";
import {getRowText} from '../../../intl/provider';
import makeStyle from "./index.css";
import {AppContext} from "../../../privacy/AppContext";
import {DATAMAP_SUCCESS, LOADING, LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../../constant";
import {useQueryDistribute} from "../../../service/datamap";


export default function Summary() {
    const classes = makeStyle();
    let papram = useParams();
    const {application, setMessage} = useContext(AppContext);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    let uid = decodeURIComponent(papram.id);
    const [ location, setLocation ] = useState();
    const [ latestDateTime, setLatestDateTime ] = useState();
    const [ latestUserIP, setLatestUserIP ] = useState();
    const [ clickcount, setClickCount ] = useState()
    const user = auth && auth.token && jwt_decode(auth.token);;

    const [{data: getUserDetail, loading: getUserDetailLoading, error: getUserDetailError}, getUserDetailApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getClickCount, loading: getClickCountLoading, error: getClickCountError}, getClickCountApi] = useQueryDistribute(
        {}, {manual: true});

    useEffect(() => {
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        let param = {
            appName: user.workspace + '_' + application,
            clientId: auth.clientId,
            uid: uid
        }

        getUserDetailApi({
            url: '/user/detail',
            params: param
        });

        getClickCountApi({
            url: '/click/count',
            params: param
        });


    }, []);

    useEffect(() => {
        if (getClickCountLoading === false) {
            if (getClickCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getClickCount")
                });
            } else if (getClickCount) {
                if(getClickCount.dmcode === DATAMAP_SUCCESS) {
                    let count=getClickCount.result.count;
                    setClickCount(count);
                }
            }
        }
    }, [getClickCountLoading]);

    useEffect(() => {
        if (getUserDetailLoading === false) {
            if (getUserDetailError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserDetailError")
                });
            } else if (getUserDetail) {
                if(getUserDetail.dmcode === DATAMAP_SUCCESS) {
                    let result=getUserDetail.result;
                    setLocation(result.latestLocation);
                    setLatestDateTime(result.latestDateTime.split(".")[0]);
                    setLatestUserIP(result.latestUserIP);
                }
            }
        }
    }, [getUserDetailLoading]);


    return (
        <Paper elevation={0} className={classes.root} variant="outlined">
            <Grid container spacing={1}>
                <Grid item xs={12} className={classes.header}>
                    <span className={classes.user_info}>{getRowText("userID")}：{uid}</span>
                    <span className={classes.user_info}>{getRowText("clickCount")}：{clickcount}</span>
                </Grid>
                <Grid item xs={12}>
                     <span className={classes.user_info}>{getRowText("latestUserIP")}{latestUserIP}</span>
                     <span className={classes.user_info}>{getRowText("latestDateTime")}{latestDateTime} </span>
                     <span className={classes.user_info}>{getRowText("location")}{location} </span>
                     <span className={classes.user_info}>{getRowText("mobile")}N/A</span>
                </Grid>
            </Grid>
        </Paper>
    )
}