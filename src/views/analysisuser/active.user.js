import React,{ useEffect, useState, useContext }  from 'react';
import { Grid, Paper, Skeleton } from '@mui/material';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import walden from '../../constant/walden.project.json';
import dashboardStyles from './index.css';
import jwt_decode from "jwt-decode";
import {getRowText} from '../../intl/provider';
import {
    CURRENT_DATE,
    DATAMAP_SUCCESS,
    DATE_FORMAT,
    LOCAL_STORAGE_AUTH, MESSAGE_ERROR,
    ONE_MONTH_AGO_FROM_CURRENT_DATE
} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import {useQueryDistribute} from "../../service/datamap";

/**
 * 活跃用户
 */
export default function ActiveUser() {
    const [ userTrendOption, setUserTrendOption ] = useState({});
    const [ userCount, setUserCount ] = useState();
    const classes = dashboardStyles();

    const [ startDate, setStartDate ] = useState(ONE_MONTH_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);
    const {application, setMessage} = useContext(AppContext);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const [{data: getUserTrend, loading: getUserTrendLoading, error: getUserTrendError}, getUserTrendApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getUserCount, loading: getUserCountLoading, error: getUserCountError}, getUserCountApi] = useQueryDistribute(
        {}, {manual: true});

    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        const obj = {...walden};
        echarts.registerTheme('walden', obj.theme);

        getUserTrendApi({
            url: '/user/trend',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate)
            }
        });

        getUserCountApi({
            url: '/user/isRegister/count',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate)
            }
        });
    }, []); 


    useEffect(() => {
        if (getUserCountLoading === false) {
            if (getUserCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserMonthCountError")
                });
            } else if (getUserCount) {
                if(getUserCount.dmcode === DATAMAP_SUCCESS) {
                    setUserCount(getUserCount.result.allUserCnt);
                }
            }
        }
    }, [getUserCountLoading]);

    useEffect(() => {
        if (getUserTrendLoading === false) {
            if (getUserTrendError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserTrendError")
                });
            } else if (getUserTrend) {
                if(getUserTrend.dmcode === DATAMAP_SUCCESS){
                    let category = getUserTrend.result.map((item) => {
                        return item.date
                    });

                    let data =  getUserTrend.result.map((item) => {
                        return item.userCount
                    });

                    let option = {
                        grid: {
                            top: '5%',
                            left: '5%',
                            right: '4%',
                            bottom: '10%'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: category
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: getRowText("userCount"),
                                type: 'bar',
                                data: data
                            }
                        ]
                    };

                    setUserTrendOption(option);
                }

            }
        }
    }, [getUserTrendLoading]);

    return (
        <Paper variant="outlined">
            <Grid container spacing={2} className={classes.root}>
                <Grid item xs={6} className={classes.header}>
                    {getRowText("topUser")}
                </Grid>
                <Grid item xs={6} className={classes.header}>
                     {getRowText("topMonthUser")}（<span className={classes.count}>{userCount}</span>）
                </Grid>
                <Grid item xs={12}>
                    { getUserTrendLoading.pending? <Skeleton variant="rect" height={180}/> :
                        <ReactEcharts option={userTrendOption} style={{height: 180}} theme={"walden"}></ReactEcharts>
                    }
                </Grid>
            </Grid>
        </Paper>
    )
}
