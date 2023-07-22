import React, { useState,useEffect,useContext }  from 'react';
import {Grid, Paper} from '@mui/material';
import KeywordAnalysis from './keyword.analysis';
import {useParams} from 'react-router';
import Profile from '../../../component/profile';
import jwt_decode from "jwt-decode";
import Static from "../../dashboard/static";
import makeStyle from "./index.css";
import {AppContext} from "../../../privacy/AppContext";
import {useQueryDistribute} from "../../../service/datamap";
import {DATAMAP_SUCCESS, LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../../constant";


export default function SearchSnap() {
    let papram = useParams();
    let keyword = decodeURIComponent(papram.id);
    const classes = makeStyle();


    const {application, setMessage} = useContext(AppContext);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getClickRate, loading: getClickRateLoading, error: getClickRateError}, getClickRateApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getAvgClickPosition, loading: getAvgClickPositionLoading, error: getAvgClickPositionError}, getAvgClickPositionApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getUserCount, loading: getUserCountLoading, error: getUserCountError}, getUserCountApi] = useQueryDistribute(
        {}, {manual: true});

    const [ clickRate, setClickRate ] = useState();
    const [ avgClickPosition, setAvgClickPosition ] = useState();
    const [ usercount, setUserCount ] = useState();

    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;


        let param = {
            appName: user.workspace + '_' + application,
            clientId: auth.clientId,
            keyword: keyword
        }

        getClickRateApi({
            url: '/click/rate',
            params: param
        });

        getAvgClickPositionApi({
            url: '/click/avg/click/position',
            params: param
        });


        param.clickType = "search";
        getUserCountApi({
            url: '/user/count/user',
            params: param
        });

    }, [])

    useEffect(() => {
        if (getUserCountLoading === false) {
            if (getUserCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: "获取搜索用户数失败"
                });
            } else if (getUserCount) {
                if(getUserCount.dmcode === DATAMAP_SUCCESS) {
                    let count= getUserCount.result.count;
                    setUserCount(count);
                }
            }
        }
    }, [getUserCountLoading]);

    useEffect(() => {
        if (getAvgClickPositionLoading === false) {
            if (getAvgClickPositionError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: "获取平均搜索点击失败"
                });
            } else if (getAvgClickPosition) {
                if(getAvgClickPosition.dmcode === DATAMAP_SUCCESS) {
                    let count= getAvgClickPosition.result.avgClickPosition;
                    setAvgClickPosition(count);
                }
            }
        }
    }, [getAvgClickPositionLoading]);

    useEffect(() => {
        if (getClickRateLoading === false) {
            if (getClickRateError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: "获取搜索点击率失败"
                });
            } else if (getClickRate) {
                if(getClickRate.dmcode === DATAMAP_SUCCESS) {
                    let count= getClickRate.result.clickRate;
                    setClickRate(count);
                }
            }
        }
    }, [getClickRateLoading]);


    return(
        <Grid container spacing={1} direction="column">
            <Grid item>
                <Paper variant="outlined" className={classes.title}>
                    {keyword}
                </Paper>
            </Grid>
            <Grid item>
                <Profile keyword={keyword} type='keywordProfile'/>
            </Grid>
            <Grid item container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center">
                <Grid item>
                    <Static style={{backgroundColor: '#90CAF9'}} number={clickRate} label="搜索点击率" order="clickRate" color="#5AD8A6"/>
                </Grid>
                <Grid item>
                    <Static number={avgClickPosition} label="平均点击位置" order="avgClickPosition" color="#FFA94C"/>
                </Grid>
                <Grid item>
                    <Static number={usercount} label="搜索用户数" order="userTotal" color="#6DC8EC"/>
                </Grid>
            </Grid>

            <Grid item>
                <KeywordAnalysis/>
            </Grid>
        </Grid>
    )
}