import React, {useContext, useEffect, useRef, useState} from 'react';
import {useGetBillingApi} from "../../../service/datamap";
import moment from "moment-timezone";
import {MESSAGE_ERROR} from "../../../constant";
import {AppContext} from "../../../privacy/AppContext";
import {Tooltip, Paper} from "@mui/material";
import MaterialTable from "material-table";
import tableIcons from "../../../component/material.table.icon";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DailyStats from "./daily.stats";

export default function Detail(props) {
    const [{data: getUsageData, loading: getUsageLoading, error: getUsageError}, getUsageApi] = useGetBillingApi(
        {}, {manual: true});
    const [data, setData] = useState([]);
    const {setMessage} = useContext(AppContext);
    const [total, setTotal] = useState(0.0);
    const [statsDate, setStatsDate] = useState('');

    const dailyStatsRef = useRef();

    useEffect(() => {
        if (props && props.date && props.accountId) {
            const startDate = moment(props.date).startOf('month').format('YYYY-MM');
            getUsageApi({
                url: "/billing/detail?accountId=" + props.accountId + "&period=" + startDate
            });
        }
    }, [props.date, props.accountId]);

    useEffect(() => {
        if (!getUsageLoading) {
            if (getUsageError) {
                if (getUsageError.response && getUsageError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: getUsageError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (getUsageData) {
                if (getUsageData.status === 0 && getUsageData.result && getUsageData.result.billDetailList) {
                    setData(getUsageData.result.billDetailList);
                    setTotal(getUsageData.result.total);
                } else {

                }
            }
        }
    }, [getUsageLoading, getUsageData, getUsageError]);

    const handleClick = (value) => {
        setStatsDate(value);
        dailyStatsRef.current.showDailyDetail();
    }

    return (<div>
        <MaterialTable
            icons={tableIcons}
            isLoading={getUsageLoading}
            components={{
                Container: props => <Paper {...props} elevation={0} variant={"outlined"}/>
            }}
            title="账单流水"
            columns={[
                {
                    title: '日期',
                    field: 'date',
                    type: "date",
                    cellStyle: {
                        textAlign: "center"
                    },
                    render: row => <Tooltip title="查看详细清单">
                        <Button size="small" onClick={() => handleClick(moment.utc(row.date).tz('Asia/Shanghai').format("YYYY-MM-DD"))}>
                        { moment.utc(row.date).tz('Asia/Shanghai').format("YYYY-MM-DD")}
                    </Button></Tooltip>
                },
                {
                    title: '磁盘使用空间(G)',
                    field: 'diskUsage',
                    type: "numeric",
                    render: row => <span>{row.diskUsage.toFixed(2)}</span>
                },
                {
                    title: '磁盘费用',
                    field: 'diskFee',
                    type: "numeric",
                    render: row => <span>{row.diskFee.toFixed(2)}</span>
                },
                {
                    title: '文档数据量',
                    field: 'documentCount',
                    type: "numeric",
                    render: row => <span>{row.documentCount}</span>
                },
                {
                    title: '搜索次数',
                    field: 'clickCount',
                    type: "numeric",
                    render: row => <span>{row.clickCount}</span>
                },
                {
                    title: '搜索费用',
                    field: 'clickFee',
                    type: "numeric",
                    render: row => <span>{row.clickFee.toFixed(2)}</span>
                },
                {
                    title: '小计',
                    field: 'sumTotal',
                    type: "numeric",
                    render: row => <span>{row.subTotal.toFixed(2)}</span>
                }
            ]}
            data={data}

            options={{
                headerStyle:{
                    textAlign: "center"
                },
                showTitle: false,
                toolbar: false,
                paging: false,
                search: false,
                padding:'dense',
                tableLayout: "auto",
                rowStyle: {
                    fontSize: 14
                },
                pageSize: 1000
            }}
        />
        <div style={{padding: 15}}>
        <Grid container spacing={1} style={{fontWeight:'bold', fontSize: 14}}>
            <Grid item xs={10} style={{textAlign:'right'}}>
                总计消费金额
            </Grid>
            <Grid item xs={2} style={{textAlign:'right'}}>
                {total && total.toFixed(2)}
            </Grid>
        </Grid>
        </div>
        <DailyStats ref={dailyStatsRef} accountId={props.accountId} date={statsDate}/>
    </div>)
}