import React, { useState,useEffect,useContext }   from 'react';
import { Grid } from '@mui/material';
import Title from './title';
import UsageAnalysis from './usage.analysis';
import {useParams} from 'react-router';
import Profile from '../../../component/profile';
import jwt_decode from "jwt-decode";
import Static from "../../dashboard/static";
import {getRowText} from '../../../intl/provider';
import {AppContext} from "../../../privacy/AppContext";
import {DATAMAP_SUCCESS, LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../../constant";
import {useQueryDistribute} from "../../../service/datamap";

export default function DataSnap() {
    let papram = useParams();
    let papramArray=papram.id.split("&&");

    const {application, setMessage} = useContext(AppContext);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const user = jwt_decode(auth.token);

    const [{data: getUserCount, loading: getUserCountLoading, error: getUserCountError}, getUserCountApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getClickCount, loading: getClickCountLoading, error: getClickCountError}, getClickCountApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getAvgTime, loading: getAvgTimeLoading, error: getAvgTimeError}, getAvgTimeApi] = useQueryDistribute(
        {}, {manual: true});

    const [ usercount, setUserCount ] = useState();
    const [ clickcount, setClickCount ] = useState();
    const [ userAvgTime, setUserAvgTime ] = useState();

    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (!user || user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        let param = {
            appName: user.workspace + '_' + application,
            clientId: auth.clientId,
            docId: decodeURIComponent(papramArray[1])
        }

        getUserCountApi({
            url: '/user/count/user',
            params: param
        });

        getClickCountApi({
            url: '/click/count',
            params: param
        });

        getAvgTimeApi({
            url: '/click/avg/read/time',
            params: param
        });

    }, [])

    useEffect(() => {
        if (getAvgTimeLoading === false) {
            if (getAvgTimeError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getAvgTimeError")
                });
            } else if (getAvgTime) {
                if(getAvgTime.dmcode === DATAMAP_SUCCESS) {
                    let time= Math.round(getAvgTime.result.avgReadTime / 10) / 100;
                    setUserAvgTime(time + getRowText("seconds"));
                }
            }
        }
    }, [getAvgTimeLoading]);


    useEffect(() => {
        if (getClickCountLoading === false) {
            if (getClickCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getReadCountsError")
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
        if (getUserCountLoading === false) {
            if (getUserCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getReadUserCountError")
                });
            } else if (getUserCount) {
                if(getUserCount.dmcode === DATAMAP_SUCCESS) {
                    let count=getUserCount.result.count;
                    setUserCount(count);
                }
            }
        }
    }, [getUserCountLoading]);


    return(
        <Grid container spacing={1} direction="column">
            <Grid item>
                <Title/>
            </Grid>
            
            <Grid item>
                <Profile keyword={papramArray[0]} type='dataProfile'/>
            </Grid>
            <Grid item container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center">
                <Grid item>
                    <Static number={usercount} label={getRowText("readUserCount")} order="userTotal" color="#5AD8A6"/>
                </Grid>
                <Grid item>
                    <Static number={clickcount} label={getRowText("readCount")} order="clickcount" color="#FFA94C"/>
                </Grid>
                <Grid item>
                    <Static number={userAvgTime} label={getRowText("avgReadTime")} order="avgTime" color="#6DC8EC"/>
                </Grid>
            </Grid>

            <Grid item>
                <UsageAnalysis/>
            </Grid>
        </Grid>
    )
}