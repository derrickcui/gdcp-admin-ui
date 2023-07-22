import React, { useState,useEffect,useContext } from 'react';
import { Grid, Divider, Paper, Skeleton } from '@mui/material';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import walden from '../../constant/walden.project.json';
import jwt_decode from "jwt-decode";
import {getRowText} from '../../intl/provider';
import makeStyle from './index.css';
import {
    CURRENT_DATE, DATAMAP_SUCCESS,
    DATE_FORMAT,
    LOCAL_STORAGE_AUTH,
    MESSAGE_ERROR,
    SEVEN_DAYS_AGO_FROM_CURRENT_DATE
} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import {useQueryDistribute} from "../../service/datamap";


/**
 * 用户量分析
 */
export default function Volume() {
    const classes = makeStyle();
    const [ startDate, setStartDate ] = useState(SEVEN_DAYS_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);
    const {application, setMessage} = useContext(AppContext);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));


    const [{data: getUserVolumn, loading: getUserVolumnLoading, error: getUserVolumnError}, getUserVolumnApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getUserRange, loading: getUserRangeLoading, error: getUserRangeError}, getUserRangeApi] = useQueryDistribute(
        {}, {manual: true});

    const [ userRangeOption, setUserRangeOption ] = useState({});
    const [ userVolumnOption, setUserVolumnOption ] = useState({});

    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        const obj = {...walden};
        echarts.registerTheme('walden', obj.theme);

        getUserVolumnApi({
            url: '/user/isRegister/trend',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate)
            }
        });

        getUserRangeApi({
            url: '/user/dateRange/count',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId
            }
        });
    }, []);

    useEffect(() => {
        if (getUserRangeLoading === false) {
            if (getUserRangeError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserRangeError")
                });
            } else if (getUserRange) {
                if(getUserRange.dmcode === DATAMAP_SUCCESS) {
                    let category = getUserRange.result.map((item) => {
                        return item.date
                    });

                    let data =  getUserRange.result.map((item) => {
                        return item.userCount
                    });

                    let option = {
                        title: {
                            text: getRowText("getUserRange"),
                            textStyle: {
                                fontSize: 14
                            }
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
                                boundaryGap: true,
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

                    setUserRangeOption(option);
                }
            }
        }
    }, [getUserRangeLoading]);

    useEffect(() => {
        if (getUserVolumnLoading === false) {
            if (getUserVolumnError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserVolumn")
                });
            } else if (getUserVolumn) {
                if(getUserVolumn.dmcode === DATAMAP_SUCCESS) {
                    let category = getUserVolumn.result.map(item => {
                        return item.date;
                    });

                    let registerUser = getUserVolumn.result.map(item => {
                        return item.isRegister.register;
                    });

                    let unRegisterUser = getUserVolumn.result.map(item => {
                        return item.isRegister.unregister;
                    });

                    let option = {
                        title: {
                            text: getRowText("UserVolumnCount"),
                            textStyle: {
                                fontSize: 14,
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        legend: {
                            data: [getRowText("registerUserCnt"), getRowText("unregisterUserCnt")]
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
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
                                name: getRowText("registerUserCnt"),
                                type: 'line',
                                stack: getRowText("allCount"),
                                areaStyle: {},
                                data: registerUser
                            },
                            {
                                name: getRowText("unregisterUserCnt"),
                                type: 'line',
                                stack: getRowText("allCount"),
                                areaStyle: {},
                                data: unRegisterUser
                            }
                        ]
                    };

                    setUserVolumnOption(option);
                }
            }
        }
    }, [getUserVolumnLoading]);


    return (
        <Paper elevation={0} variant="outlined">
            <Grid container spacing={2} className={classes.root}>
                <Grid item xs={4} md={6} lg={8} className={classes.header}>
                    {getRowText("userCountAnalysis")}
                </Grid>
                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={12} md={12} lg={6} className={classes.rihgtDivder}>
                    { getUserVolumnLoading.pending? <Skeleton variant="rect" height={100}/> :
                        <ReactEcharts option={userVolumnOption} className={classes.chart} theme={"walden"}></ReactEcharts>
                    }
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    { getUserRangeLoading.pending? <Skeleton variant="rect" height={200}/> :
                        <ReactEcharts option={userRangeOption} className={classes.chart} theme={"walden"}></ReactEcharts>
                    }
                </Grid>
            </Grid>
        </Paper>
    )
}