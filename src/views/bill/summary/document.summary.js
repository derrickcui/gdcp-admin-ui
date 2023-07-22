import React, {useContext, useEffect, useState} from 'react';
import {useGetBillingApi} from "../../../service/datamap";
import moment from "moment-timezone";
import {MESSAGE_ERROR} from "../../../constant";
import {AppContext} from "../../../privacy/AppContext";
import {Paper} from "@mui/material";
import MaterialTable from "material-table";
import tableIcons from "../../../component/material.table.icon";

export default function DocumentSummary(props) {
    const [{data: getUsageData, loading: getUsageLoading, error: getUsageError}, getUsageApi] = useGetBillingApi(
        {}, {manual: true});
    const [data, setData] = useState([]);
    const {setMessage} = useContext(AppContext);

    useEffect(() => {
        if (props && props.date && props.accountId) {
            const startDate = moment(props.date).startOf('month').format('YYYY-MM');
            getUsageApi({
                url: "/bill/stats-summary?accountId=" + props.accountId + "&type=document&period=" + startDate
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
                setData(getUsageData);
            }
        }
    }, [getUsageLoading, getUsageData, getUsageError]);

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
                    render: row => <span>{ moment.utc(row.date).tz('Asia/Shanghai').format("YYYY-MM-DD")}</span>
                },
                {
                    title: '数据总量',
                    field: 'number',
                    type: "numeric",
                    cellStyle: {
                        textAlign: "center"
                    },
                    render: row => <span>{new Intl.NumberFormat().format(row.number)}</span>
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
                tableLayout: "auto",
                rowStyle: {
                    fontSize: 14
                },
                pageSize: 1000
            }}
        />

    </div>)
}