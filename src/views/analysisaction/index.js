import React, { useState,useEffect,useContext }  from 'react';
import {Grid} from '@mui/material'
import Trend from './trend';
import Analysis from './analysis';
import Summary from './summary';
import jwt_decode from "jwt-decode";
import Static from "../dashboard/static";
import makeStyle from "./index.css";
import {AppContext} from "../../privacy/AppContext";
import {
    CURRENT_DATE,
    DATAMAP_SUCCESS,
    LOCAL_STORAGE_AUTH,
    MESSAGE_ERROR,
    ONE_MONTH_AGO_FROM_CURRENT_DATE
} from "../../constant";
import {useQueryDistribute} from "../../service/datamap";



export default function SearchStatistics() {
    const classes = makeStyle();
    const {application, setMessage} = useContext(AppContext);
    const [ startDate, setStartDate ] = useState(ONE_MONTH_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [ clickRate, setClickRate ] = useState();
    const [ searchConversion, setSearchConversion ] = useState();
    const [ avgClickPosition, setAvgClickPosition ] = useState();

    const [{data: getClickRate, loading: getClickRateLoading, error: getClickRateError}, getClickRateApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getSearchConversion, loading: getSearchConversionLoading, error: getSearchConversionError}, getSearchConversionApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getAvgClickPosition, loading: getAvgClickPositionLoading, error: getAvgClickPositionError}, getAvgClickPositionApi] = useQueryDistribute(
            {}, {manual: true});


        useEffect(() => {
            const user = auth && auth.token && jwt_decode(auth.token);
            if (user === 'undefined' || user === null) return;
            if (!application || application === 'undefined' || application === null) return;


            getClickRateApi({
                url: '/click/rate',
                params: {
                    appName: user.workspace + '_'  + application,
                    clientId:auth.clientId,
                }
            });

            getSearchConversionApi({
                url: '/session/search/conversion/rate',
                params: {
                    appName: user.workspace + '_'  + application,
                    clientId:auth.clientId,
                }
            });

            getAvgClickPositionApi({
                url: '/click/avg/click/position',
                params: {
                    appName: user.workspace + '_'  + application,
                    clientId:auth.clientId,
                }
            });
    
        }, []);

        useEffect(() => {
            if (getAvgClickPositionLoading === false) {
                if (getAvgClickPositionError) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "获取平均搜索点击位置失败"
                    });
                } else if (getAvgClickPosition) {
                    if(getAvgClickPosition.dmcode === DATAMAP_SUCCESS) {
                        let count = getAvgClickPosition.result.avgClickPosition;
                        setAvgClickPosition(count);
                    }
                }
            }
        }, [getAvgClickPositionLoading]);

        useEffect(() => {
            if (getSearchConversionLoading === false) {
                if (getSearchConversionError) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "获取搜索转换率失败"
                    });
                } else if (getSearchConversion) {
                    if(getSearchConversion.dmcode === DATAMAP_SUCCESS) {
                        let count = getSearchConversion.result.searchConversionRate;
                         setSearchConversion(count);
                    }
                }
            }
        }, [getSearchConversionLoading]);

        useEffect(() => {
            if (getClickRateLoading === false) {
                if (getClickRateError) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "获取搜索点击率失败"
                    });
                } else if (getClickRate) {
                    if(getClickRate.dmcode === DATAMAP_SUCCESS) {
                        let count = getClickRate.result.clickRate;
                        setClickRate(count);
                    }
                }
            }
        }, [getClickRateLoading]);

    return(
        <Grid container spacing={1}>
            <Grid item container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center">
                <Grid item>
                    <Static number={clickRate} label="搜索点击率" order="clickRate" color="#5AD8A6"/>
                </Grid>
                <Grid item>
                    <Static number={searchConversion} label="搜索转化率" order="searchCountIcon" color="#5B8FF9"/>
                </Grid>
                <Grid item>
                    <Static number={avgClickPosition} label="平均点击位置" order="avgClickPosition" color="#FFA94C"/>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Summary/>
            </Grid>

            <Grid item xs={12}>
                <Trend/>
            </Grid>

            <Grid item xs={12}>
                <Analysis/>
            </Grid>
        </Grid>
    )
}