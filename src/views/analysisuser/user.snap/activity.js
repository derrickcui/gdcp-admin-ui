import React, { useState,useEffect,useContext } from 'react';
import { Grid, Divider, Paper,Skeleton } from '@mui/material';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import walden from '../../../constant/walden.project.json';
import {useParams} from 'react-router';
import jwt_decode from "jwt-decode";
import makeStyle from "./index.css";
import {
    CURRENT_DATE,
    DATAMAP_SUCCESS, DATE_FORMAT,
    LOCAL_STORAGE_AUTH,
    MESSAGE_ERROR,
    SEVEN_DAYS_AGO_FROM_CURRENT_DATE
} from "../../../constant";
import {AppContext} from "../../../privacy/AppContext";
import {getRowText} from "../../../intl/provider";
import {useQueryDistribute} from "../../../service/datamap";


export default function Activity() {
    const [ startDate, setStartDate ] = useState(SEVEN_DAYS_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);
    const classes = makeStyle();
    let papram = useParams();

    const {application, setMessage} = useContext(AppContext);
    let uid = decodeURIComponent(papram.id);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getClickTrend, loading: getClickTrendLoading, error: getClickTrendError}, getClickTrendApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getUserRange, loading: getUserRangeLoading, error: getUserRangeError}, getUserRangeApi] = useQueryDistribute(
        {}, {manual: true});

    const [ trendDataOption, setTrendDataOption ] = useState({});
    const [ userRangeOption, setUserRangeOption ] = useState({});
    
    useEffect(() => {

        const user = auth && auth.token && jwt_decode(auth.token);
        if (!user || user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        console.log("activity")
        const obj = {...walden};
        echarts.registerTheme('walden', obj.theme);

        getClickTrendApi({
            url: '/click/trend',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate),
                uid: uid
            }
        });

        getUserRangeApi({
            url: '/click/dateRange/count',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                uid: uid
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
                        return item.clickCount
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
                                name: getRowText("actionCount"),
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
        if (getClickTrendLoading === false) {
            if (getClickTrendError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getClickTrendError")
                });
            } else if (getClickTrend) {
                if(getClickTrend.dmcode === DATAMAP_SUCCESS) {
                    let category = getClickTrend.result.map((item) => {
                        return item.date
                    });

                    let data =  getClickTrend.result.map((item) => {
                        return item.clickCount
                    });

                    let option = {
                        title: {
                          text: getRowText("getClickTrend"),
                          textStyle: {
                              fontSize: 14
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
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: category
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: getRowText("actionCount"),
                            data: data,
                            type: 'line',
                            areaStyle: {}
                        }]
                    };

                    setTrendDataOption(option);
                }
            }
        }
    }, [getClickTrendLoading]);


    return (
        <Paper elevation={0} variant="outlined" className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={4} md={6} lg={8} className={classes.header}>
                    {getRowText("activeAnalysis")}
                </Grid>

                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={12} md={12} lg={6} className={classes.divider}>
                    { getClickTrendLoading.pending? <Skeleton variant="rect" height={200}/> :
                        <ReactEcharts option={trendDataOption} className={classes.chart} theme={"walden"}></ReactEcharts>
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