import React,{ useEffect, useState,useContext } from 'react';
import { Skeleton } from '@mui/material';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import walden from '../../constant/walden.project.json';
import jwt_decode from "jwt-decode";
import {getRowText} from '../../intl/provider';
import makeStyle from "./index.css";
import {
    CURRENT_DATE,
    DATAMAP_SUCCESS, DATE_FORMAT,
    LOCAL_STORAGE_AUTH,
    MESSAGE_ERROR,
    ONE_MONTH_AGO_FROM_CURRENT_DATE
} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import {useQueryDistribute} from "../../service/datamap";



export default function VolumnChanges() {
    const classes = makeStyle();
    const [ dataTrendOption, setDataTrendOption ] = useState({});

    const {application, setMessage} = useContext(AppContext);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const [ startDate, setStartDate ] = useState(ONE_MONTH_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);


    const [{data: getDataTrend, loading: getDataTrendLoading, error: getDataTrendError}, getDataTrendApi] = useQueryDistribute(
        {}, {manual: true});

  useEffect(() => {
      const user = auth && auth.token && jwt_decode(auth.token);
      if (user === 'undefined' || user === null) return;
      if (!application || application === 'undefined' || application === null) return;


      const obj = {...walden};
      echarts.registerTheme('walden', obj.theme);

      getDataTrendApi({
          url: '/data/size/trend',
          params: {
              appName: user.workspace + '_'  + application,
              clientId:auth.clientId,
              startTime: DATE_FORMAT(startDate),
              endTime: DATE_FORMAT(endDate),
          }
      });
    }, []);


    useEffect(() => {
        if (getDataTrendLoading === false) {
            if (getDataTrendError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getDataTrendError")
                });
            } else if (getDataTrend) {
                if(getDataTrend.dmcode === DATAMAP_SUCCESS){
                    let category = getDataTrend.result.map((item) => {
                        return item.date
                    });

                    let data =  getDataTrend.result.map((item) => {
                        return item.docCount
                    });

                    let option = {
                        title: {
                            text: getRowText("dataChange"),
                            textStyle: {
                                fontSize: 14
                            }
                        },
                        grid: {
                            right: '5%',
                            top: '5%',
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
                            name: getRowText("dataCounts"),
                            data: data,
                            type: 'line',
                            stack: getRowText("allCount"),
                            areaStyle: {}
                        }]
                    };

                    setDataTrendOption(option);
                }
            }
        }
    }, [getDataTrendLoading]);


    return (
        <React.Fragment>
            { getDataTrendLoading.pending? <Skeleton variant="rect" height={220}/> :
                <ReactEcharts option={dataTrendOption} className={classes.chart} theme={"walden"}></ReactEcharts>
            }
        </React.Fragment>
    )
}