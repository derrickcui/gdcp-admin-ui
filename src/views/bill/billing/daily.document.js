import React, {useEffect, useState} from 'react';
import {Paper} from "@mui/material";
import MaterialTable from "material-table";
import tableIcons from "../../../component/material.table.icon";

export default function DailyDocument(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);


    return (
        <MaterialTable
            icons={tableIcons}
            components={{
                Container: props => <Paper {...props} elevation={0} variant={"outlined"}/>
            }}
            title="账单流水"
            columns={[
                {
                    title: '内容仓库',
                    field: 'name'
                },
                {
                    title: '数据总量',
                    field: 'number',
                    type: "numeric",
                    filtering: false,
                    render: row => <span>{new Intl.NumberFormat().format(row.number)}</span>
                }
            ]}
            data={data}

            options={{
                showTitle: false,
                toolbar: false,
                paging: false,
                search: false,
                padding:'dense',
                tableLayout: "auto",
                rowStyle: {
                    fontSize: 14
                },
                pageSize: 1000,
                body: {
                    emptyDataSourceMessage: '该日期没有统计数据',
                }
            }}
        />)
}