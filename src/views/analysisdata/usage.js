import React,{ useEffect, useState, useContext } from 'react';
import { Skeleton } from '@mui/material';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import walden from '../../constant/walden.project.json';
import jwt_decode from "jwt-decode";
import {getRowText} from '../../intl/provider';
import makeStyle from "./index.css";
import {DATAMAP_SUCCESS, LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import {useQueryDistribute} from "../../service/datamap";


export default function Usage() {
    const classes = makeStyle();
    const [ option, setOption ] = useState({});

    const {application, setMessage} = useContext(AppContext);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getDataUsage, loading: getDataUsageLoading, error: getDataUsageError}, getDataUsageApi] = useQueryDistribute(
        {}, {manual: true});

    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;


        const obj = {...walden};
        echarts.registerTheme('walden', obj.theme);

        getDataUsageApi({
            url: '/data/usage/distribute',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId
            }
        });
    }, []);

    useEffect(() => {
        if (getDataUsageLoading === false) {
            if (getDataUsageError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getDataUsageError")
                });
            } else if (getDataUsage) {
                if(getDataUsage.dmcode === DATAMAP_SUCCESS) {
                    let result = getDataUsage.result;
                    let count = result.unusedCount + result.usedCount + result.highLevel + result.midLevel + result.lowLevel;

                    let data = [
                        { name: getRowText("unusedCount"), value: result.unusedCount},
                        { name: getRowText("usedCount"), value: result.usedCount},
                        { name: getRowText("lowLevel"), value: result.lowLevel},
                        { name: getRowText("midLevel"), value: result.midLevel},
                        { name: getRowText("highLevel"), value: result.highLevel}
                    ]

                    setOption({
                        title: {
                            text: getRowText("dataUsage"),
                            textStyle: {
                                fontSize: 14
                            }
                        },
                        tooltip : {
                            trigger: 'item',
                            //提示框浮层内容格式器，支持字符串模板和回调函数形式。
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            right: 'left',
                            top: 'center',
                            data: [getRowText("unusedCount"),getRowText("usedCount"), getRowText("lowLevel"), getRowText("midLevel"), getRowText("highLevel")]
                        },
                        series : [
                            {
                                name:getRowText("dataUsed"),
                                type:'pie',
                                data: data,
                            }
                        ]
                    });
                }
            }
        }
    }, [getDataUsageLoading]);

    return (
        <React.Fragment>
            { getDataUsageLoading.pending?  <Skeleton variant="rect" height={220}/> :
                <ReactEcharts option={option} notMerge={false} style={{height: 220, width: '100%'}} theme={"walden"}/>
            }
        </React.Fragment>
    )
}