import React, { useState,useEffect,useContext } from 'react';
import { Grid, Divider, Paper, Skeleton } from '@mui/material';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import walden from '../../constant/walden.project.json';
import jwt_decode from "jwt-decode";
import {getRowText} from '../../intl/provider';
import makeStyle from "./index.css";
import {
    CURRENT_DATE, DATAMAP_SUCCESS,
    DATE_FORMAT,
    LOCAL_STORAGE_AUTH,
    MESSAGE_ERROR,
    SEVEN_DAYS_AGO_FROM_CURRENT_DATE
} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import {useQueryDistribute} from "../../service/datamap";



export default function Trend() {
    const classes = makeStyle();
    const {application, setMessage} = useContext(AppContext);
    const [ startDate, setStartDate ] = useState(SEVEN_DAYS_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getDateRange, loading: getDateRangeLoading, error: getDateRangeError}, getDateRangeApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getDateTrend, loading: getDateTrendLoading, error: getDateTrendError}, getDateTrendApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getTrend, loading: getTrendLoading, error: getTrendError}, getTrendApi] = useQueryDistribute(
        {}, {manual: true});

    const [ docStatic, setDocStatic ] = useState([]);
    const [ clickStatic, setClickStatic ] = useState([]);
    const [ dateStatic, setDateStatic ] = useState([]);

    const [ dataRange, setDataRange ] = useState([]);
   useEffect(() => {
       const user = auth && auth.token && jwt_decode(auth.token);
       if (user === 'undefined' || user === null) return;
       if (!application || application === 'undefined' || application === null) return;



       const obj = {...walden};
        echarts.registerTheme('walden', obj.theme);

       getDateRangeApi({
           url: '/click/dateRange/count',
           params: {
               appName: user.workspace + '_'  + application,
               clientId:auth.clientId,
               clickType: "doc"
           }
       });

       getDateTrendApi({
           url: '/data/size/trend',
           params: {
               appName: user.workspace + '_'  + application,
               clientId:auth.clientId,
               startTime: DATE_FORMAT(startDate),
               endTime: DATE_FORMAT(endDate),
               clickType:"doc"
           }
       });

       getTrendApi({
           url: '/data/trend',
           params: {
               appName: user.workspace + '_'  + application,
               clientId:auth.clientId,
               startTime: DATE_FORMAT(startDate),
               endTime: DATE_FORMAT(endDate),
               clickType:"doc"
           }
       });
    }, []);

    useEffect(() => {
        if (getTrendLoading === false) {
            if (getTrendError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getTrendError")
                });
            } else if (getTrend) {
                if(getTrend.dmcode === DATAMAP_SUCCESS) {
                    let clickStatic = getTrend.result.map((item) => {
                        return item.docCount
                    });
                    setClickStatic(clickStatic);
                }
            }
        }
    }, [getTrendLoading]);

    useEffect(() => {
        if (getDateTrendLoading === false) {
            if (getDateTrendError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getDateTrendError")
                });
            } else if (getDateTrend) {
                if(getDateTrend.dmcode === DATAMAP_SUCCESS) {
                    let documentStatic = getDateTrend.result.map((item) => {
                        return item.docCount
                    });
                    setDocStatic(documentStatic);

                    let dateKeys = getDateTrend.result.map((item) => {
                        return item.date
                    });

                    setDateStatic(dateKeys);
                }
            }
        }
    }, [getDateTrendLoading]);

    useEffect(() => {
        if (getDateRangeLoading === false) {
            if (getDateRangeError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getDateRangeError")
                });
            } else if (getDateRange) {
                if(getDateRange.dmcode === DATAMAP_SUCCESS) {
                    setDataRange(getDateRange.result);
                }
            }
        }
    }, [getDateRangeLoading]);


    let option = {
        title: {
            text: getRowText("readTrend"),
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
        legend: {
            data: [getRowText("clickAll"), getRowText("dataCounts")]
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: dateStatic
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: [
            {
                type: 'value',
                name: getRowText("dataTotal"),
                min: 0
            },
            {
                type: 'value',
                name: getRowText("clickTotal"),
                min: 0
            }
        ],
        series: [
            {
                name: getRowText("clickAll"),
                type: 'line',
                yAxisIndex: 1,
                data: clickStatic
            },
            {
                name: getRowText("dataCounts"),
                type: 'line',
                areaStyle: {
                    color:'#3fb1e3'
                },
                data: docStatic
            }
        ]
    };

    let optionReadDoc = {
        title: {
            text: getRowText("dateRangeTrend"),
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
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: dataRange.map(item => {return item.date}),

            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: getRowText("readCounts"),
                type: 'bar',
                barWidth: '60%',
                data: dataRange.map(item => {return item.clickCount})
            }
        ]
    };

    
    return (
        <Paper elevation={0} variant="outlined" className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={4} md={6} lg={8} className={classes.header}>
                    {getRowText("dataUsageTrend")}
                </Grid>

                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={12} md={12} lg={5} xl={6} className={classes.rihgtDivder}>
                    { getDateTrendLoading.pending?  <Skeleton variant="rect" height={300}/> :
                         <ReactEcharts option={option} className={classes.chart}></ReactEcharts>
                    }
                </Grid>
                <Grid item xs={12} md={12} lg={7} xl={6}>
                    { getDateRangeLoading.pending? <Skeleton variant="rect" height={300}/> :
                        <ReactEcharts option={optionReadDoc} className={classes.chart} theme={"walden"}></ReactEcharts>
                    }
                </Grid>
            </Grid>
        </Paper>
    )
}