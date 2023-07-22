import React,{ useEffect, useState, useContext }  from 'react';
import { Grid, Paper, Skeleton } from '@mui/material';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import walden from '../../constant/walden.project.json'
import jwt_decode from "jwt-decode";
import {getRowText} from '../../intl/provider';
import makeStyle from "./index.css";
import {AppContext} from "../../privacy/AppContext";
import {DATAMAP_SUCCESS, LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../constant";
import {useQueryDistribute} from "../../service/datamap";



/**
 * 用户分布
 */
export default function UserDistribution() {
    const classes = makeStyle();
    const {application, setMessage} = useContext(AppContext);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getUserCount, loading: getUserCountLoading, error: getUserCountError}, getUserCountApi] = useQueryDistribute(
        {}, {manual: true});
    
    useEffect(() => {
        const obj = {...walden};
        echarts.registerTheme('walden', obj.theme);
    }, [])    

    const [ userCount, setUserCount ] = useState( [
        { name: getRowText("unregisterUserCnt"), value: 0},
        { name: getRowText("registerUserCnt"), value: 0}
    ]);

    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        getUserCountApi({
            url: '/user/isRegister/count',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId
            }
        });
    }, []);

    useEffect(() => {
        if (getUserCountLoading === false) {
            if (getUserCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserCountError")
                });
            } else if (getUserCount) {
                if(getUserCount.dmcode === DATAMAP_SUCCESS){
                   // setAllUserCnt(getUserCount.result["allUserCnt"]);
                    let result = getUserCount.result;
                    let data=[
                        { name: getRowText("registerUserCnt"), value: result.registerUserCnt},
                        { name: getRowText("unregisterUserCnt"), value: result.unregisterUserCnt}
                    ]
                    setUserCount(data);
                }

            }
        }
    }, [getUserCountLoading]);

    const option = {
        tooltip : {
            trigger: 'item',
            //提示框浮层内容格式器，支持字符串模板和回调函数形式。
            formatter: "{a} <br/>{b} : {c} ({d}%)" 
        },
        legend: {
            orient: 'vertical',
            right: 'left',
            top: 'center',
            data: [getRowText("registerUserCnt"),getRowText("unregisterUserCnt")]
        },
        series : [
            {
                name:getRowText("userLocation"),
                type:'pie',
                data: userCount,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    return (
        <Paper variant="outlined">
            <Grid container spacing={2} className={classes.root}>
                <Grid item xs={6} className={classes.header}>
                    {getRowText("userLocation")}
                </Grid>
                <Grid item xs={6} className={classes.header}>
                    {getRowText("userTotalAllTime")} （<span className={classes.count}>{userCount[0].value + userCount[1].value}</span>）
                </Grid>
                <Grid item xs={12}>
                    { getUserCountLoading.pending? <Skeleton variant="rect" height={180}/> :
                        <ReactEcharts option={option} style={{height: 180, width: '100%'}} theme={"walden"}/>
                    }
                </Grid>
            </Grid>
        </Paper>
    )
}