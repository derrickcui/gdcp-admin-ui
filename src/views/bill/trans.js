import React, {useContext, useEffect, useState} from 'react';
import {Button, Divider, Grid, MenuItem, FormControl, Paper, Select} from "@mui/material";
import {useGetBillingApi} from "../../service/datamap";
import {LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import jwt_decode from "jwt-decode";
import MaterialTable from "material-table";
import tableIcons from "../../component/material.table.icon";
import moment from "moment-timezone";

export default function Trans() {
    const [year, setYear] = useState(moment().year());
    const yearList = [2023];
    const [accountId, setAccountId] = useState();

    const [data, setData] = useState([]);
    const [{data: getClientData, loading: getClientLoading, error: getClientError}, getClientApi] = useGetBillingApi(
        {}, {manual: true});
    const [{data: getBillData, loading: getBillLoading, error: getBillError}, getBillApi] = useGetBillingApi(
        {}, {manual: true});

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const {setMessage} = useContext(AppContext);

    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user && user.client_id && user.client_id.length > 0) {
            getClientApi({
                url: "/account/client?clientId=" + user.client_id
            });
        }
    }, []);

    useEffect(() => {
        if (!getClientLoading) {
            if (getClientError) {
                if (getClientError.response && getClientError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: getClientError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (getClientData) {
                setAccountId(getClientData.accountId);
            }
        }
    }, [getClientLoading, getClientData, getClientError]);

    useEffect(() => {
        if (!getBillLoading) {
            if (getBillError) {
                if (getBillError.response && getBillError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: getBillError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (getBillData) {
                setData(getBillData.result);
            }
        }
    }, [getBillLoading, getBillData, getBillError]);


    const handleChange = (event) => {
        setYear(event.target.value);
    };

    const handleClick = () => {
        if (!accountId || accountId.length === 0) {
            alert("请退出该菜单重新进入");
            return;
        }

        getBillApi({
            url: "/billing/trans?accountId=" + accountId + "&year=" + year
        });
    }

    return (
        <Paper variant={"outlined"} style={{padding: 10, fontSize: 14, minHeight: 300}}>
            <Grid container direction={"column"} columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={1}>
                <Grid item container direction={"row"} spacing={0}>
                    <Grid itme style={{paddingTop: 15}}>
                        费用发生年代：
                    </Grid>
                    <Grid item>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                                id="demo-select-small"
                                value={year}
                                onChange={handleChange}
                                style={{ height: 30 }}
                            >
                                {yearList.map((y, index) => {
                                    return <MenuItem key={index} value={y}>{y}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item style={{paddingLeft: 20, paddingTop: 8}}>
                        <Button variant="contained" size="small" onClick={handleClick}>
                            查询
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider/>
                </Grid>
                <Grid item>
                    <MaterialTable
                        icons={tableIcons}
                        isLoading={getBillLoading}
                        components={{
                            Container: props => <Paper {...props} elevation={0} variant={"outlined"}/>
                        }}
                        title="账单流水"
                        columns={[
                            {
                                title: '交易类型',
                                field: 'billType',
                                lookup: { 'credit':'充值', 'fee':'月结算'},
                            },
                            {
                                title: '账单日期',
                                field: 'billDate'
                            },
                            {
                                title: '金额',
                                field: 'amount',
                                type: "numeric",
                                render: row => <span>{new Intl.NumberFormat().format(row.amount.toFixed(2))}</span>
                            },
                            {
                                title: '状态',
                                field: 'status',
                                lookup: { 'paid':'已支付', 'unpaid':'未支付', 'pending':'等待', 'partPaid':'部分支付'}
                            },
                            {
                                title: '更新日期',
                                field: 'lastUpdateDate',
                                type: "date",
                                render: row => <span>{moment.utc(row.lastUpdateDate).tz('Asia/Shanghai').format("YYYY-MM-DD")}</span>
                            }
                        ]}
                        data={data}

                        options={{
                            headerStyle: {
                              backgroundColor:'#F5F5F5'
                            },
                            showTitle: false,
                            toolbar: false,
                            paging: false,
                            search: false,
                            padding:'dense',
                            tableLayout: "auto",
                            rowStyle: rowData => ({
                                fontSize: 14,
                                backgroundColor: ('credit' === rowData.billType) ? '#fff9e5' : '#FFFFFF'
                            }),
                            pageSize: 1000,
                            body: {
                                emptyDataSourceMessage: '该日期没有统计数据',
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}