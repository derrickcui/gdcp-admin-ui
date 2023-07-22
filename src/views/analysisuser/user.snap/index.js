import React, { useState,useEffect,useContext } from 'react';
import {Grid} from '@mui/material'
import Profile from '../../../component/profile';
import Summary from './summary';
import Activity from './activity';
import Behaviour from './behaviour';
import {useParams} from 'react-router';
import jwt_decode from "jwt-decode";
import Static from "../../dashboard/static";
import {useQueryDistribute} from "../../../service/datamap";
import {AppContext} from "../../../privacy/AppContext";
import {getRowText} from "../../../intl/provider";
import {DATAMAP_SUCCESS, LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../../constant";


export default function UserSnap() {
    let papram = useParams();
    let uid = decodeURIComponent(papram.id);
    
    const [ searchCount, setSearchCount ] = useState();
    const [ readCount, setReadCount ] = useState();
    const [ sessionCount, setSessionCount ] = useState();
    const [ avgTime, setAvgTime ] = useState();
    const {application, setMessage} = useContext(AppContext);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getClickCount, loading: getClickCountLoading, error: getClickCountError}, getClickCountApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getReadCount, loading: getReadCountLoading, error: getReadCountError}, getReadCountApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getSessionCount, loading: getSessionCountLoading, error: getSessionCountError}, getSessionCountApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getUserAvgTime, loading: getUserAvgTimeLoading, error: getUserAvgTimeError}, getUserAvgTimeApi] = useQueryDistribute(
        {}, {manual: true});

    useEffect(() => {
        console.log("user snapshot")
        const user = auth && auth.token && jwt_decode(auth.token);
        if (!user || user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        let param = {
            appName: user.workspace + '_' + application,
            clientId: auth.clientId,
            uid: uid,
            clickType:"search",
        }

        getClickCountApi({
            url: '/click/count',
            params: param
        });

        let readParam = {
            appName: user.workspace + '_' + application,
            clientId: auth.clientId,
            uid: uid,
            clickType: "doc",
        }

        getReadCountApi({
            url: '/click/count',
            params: readParam
        });

        let sessionParam = {
            appName: user.workspace + '_' + application,
            clientId: auth.clientId,
            uid: uid
        }

        getSessionCountApi({
            url: '/session/count',
            params: sessionParam
        });

        getUserAvgTimeApi({
            url: '/session/avg/utilityTime',
            params: sessionParam
        });

    }, [application])


    useEffect(() => {
        if (getUserAvgTimeLoading === false) {
            if (getUserAvgTimeError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserAvgTimeError")
                });
            } else if (getUserAvgTime) {
                if(getUserAvgTime.dmcode === DATAMAP_SUCCESS) {
                    let avgTime=getUserAvgTime.result.sessionAvgUtilityTime/1000;
                    setAvgTime((avgTime/60).toFixed(2) + "分钟");
                }
            }
        }
    }, [getUserAvgTimeLoading]);

    useEffect(() => {
        if (getSessionCountLoading === false) {
            if (getSessionCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getSessionCountError")
                });
            } else if (getSessionCount) {
                if(getSessionCount.dmcode === DATAMAP_SUCCESS) {
                    let count=getSessionCount.result.count;
                    setSessionCount(count);
                }
            }
        }
    }, [getSessionCountLoading]);

    useEffect(() => {
        if (getReadCountLoading === false) {
            if (getReadCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getReadCountError")
                });
            } else if (getReadCount) {
                if(getReadCount.dmcode === DATAMAP_SUCCESS) {
                    let count=getReadCount.result.count;
                    setReadCount(count);
                }
            }
        }
    }, [getReadCountLoading]);

    useEffect(() => {
        if (getClickCountLoading === false) {
            if (getClickCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getClickCountError")
                });
            } else if (getClickCount) {
                if(getClickCount.dmcode === DATAMAP_SUCCESS) {
                    let count=getClickCount.result.count;
                    setSearchCount(count);
                }
            }
        }
    }, [getClickCountLoading]);

    return(
        <Grid container spacing={1} direction="column">
            <Grid item>
                <Summary/>
            </Grid>
            <Grid item>
                <Profile keyword={uid} type='userProfile'/>
            </Grid>
            <Grid item container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center">
                <Grid item>
                    <Static number={searchCount} label={getRowText("searchTotals")} order="searchCountIcon" color="#5B8FF9"/>
                </Grid>
                <Grid item>
                    <Static number={readCount} label={getRowText("readTotals")} order="readCount" color="#5AD8A6"/>
                </Grid>
                <Grid item>
                    <Static number={sessionCount} label={getRowText("sessionTotals")} order="sessionCount" color="#FFA94C"/>
                </Grid>
                <Grid item>
                    <Static number={avgTime} label={getRowText("avgTime")} order="avgTime" color="#6DC8EC"/>
                </Grid>
            </Grid>

            <Grid item>
                <Activity/>
            </Grid>

            <Grid item>
                <Behaviour/>
            </Grid>
        </Grid>
    )
}