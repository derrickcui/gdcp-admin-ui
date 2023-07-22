import React, {useContext, useEffect, useState} from 'react';
import {Divider, Grid, TableCell, Table, TableBody, TableRow, TableHead} from "@mui/material";
import {useGetBillingApi} from "../../../service/datamap";
import {AppContext} from "../../../privacy/AppContext";
import moment from "moment";
import {MESSAGE_ERROR} from "../../../constant";
import PreDetail from "./predetail";
import Summary from "./summary";
import Detail from "./detail";

function ccyFormat(num) {
    return `${num.toFixed(2)}`;
}

export default function MonthBill(props) {
    const [{data: getBillData, loading: getBillLoading, error: getBillError}, getBillApi] = useGetBillingApi(
        {}, {manual: true});
    const [data, setData] = useState([]);
    const {setMessage} = useContext(AppContext);
    const [billStatus, setBillStatus] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (props && props.date && props.accountId) {
            const startDate = moment(props.date).startOf('month').format('YYYY-MM');
            getBillApi({
                url: "/billing/bill?accountId=" + props.accountId + "&type=fee&period=" + startDate
            });
        }
    }, [props.date, props.accountId]);

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
                setBillStatus(getBillData.status);
                props.status(getBillData.status);
                setError(getBillData.message);
                if(getBillData.status === 0 && getBillData.result) {
                    setData(getBillData.result[0]);
                }
            }
        }
    }, [getBillLoading, getBillData, getBillError]);


    if (billStatus !== 0) {
        return <div>
            <span style={{color: "red", fontSize: 14}}>{error}</span>
            <PreDetail accountId={props.accountId} date={props.date}/>
        </div>
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Table size="small" >
                    <TableHead>
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>收费服务</TableCell>
                            <TableCell align="right">总消费金额</TableCell>
                            <TableCell align="right">折扣金额</TableCell>
                            <TableCell align="right">实收金额</TableCell>
                            <TableCell align="right">已付款</TableCell>
                            <TableCell align="right">欠款金额</TableCell>
                            <TableCell align="right">状态</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{border: 0}}>
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                智能感知搜索服务
                            </TableCell>
                            <TableCell align="right">
                                {data && data.total && ccyFormat(data.total)}
                            </TableCell>
                            <TableCell align="right">
                                {data && data.discount && ccyFormat(data.discount)}
                            </TableCell>
                            <TableCell align="right">
                                {data && data.amount && ccyFormat(data.amount)}
                            </TableCell>
                            <TableCell align="right">
                                {data && data.payment && ccyFormat(data.payment)}
                            </TableCell>
                            <TableCell align="right">
                                {data && data.remain && data.remain > 0.0?  <span style={{color:'red'}}>{ccyFormat(data.remain)}</span>: data.remain}
                            </TableCell>
                            <TableCell align="right">
                                {data && data.status && 'paid' === data.status? '已付款': ('partPaid' === data.status? <span style={{color:'red'}}>部分支付</span>: data.status)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Grid>
            <Grid item xs={12}>
                <Divider/>
            </Grid>
            <Grid item xs={12}>
                <Summary accountId={props.accountId} date={props.date}/>
            </Grid>
            <Grid item xs={12}>
                <Detail accountId={props.accountId} date={props.date}/>
            </Grid>
        </Grid>
    )
}