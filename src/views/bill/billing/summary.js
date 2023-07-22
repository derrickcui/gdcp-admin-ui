import React, {useContext, useEffect, useState} from 'react';
import {useGetBillingApi} from "../../../service/datamap";
import {AppContext} from "../../../privacy/AppContext";
import moment from "moment-timezone";
import {MESSAGE_ERROR} from "../../../constant";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function ccyFormat(num) {
    return `${num.toFixed(2)}`;
}

export default function Summary(props) {
    const [{data: getBillData, loading: getBillLoading, error: getBillError}, getBillApi] = useGetBillingApi(
        {}, {manual: true});
    const [disk, setDisk] = useState({});
    const [click, setClick] = useState({});
    const {setMessage} = useContext(AppContext);
    const [billStatus, setBillStatus] = useState(0);
    const [error, setError] = useState('');
    const [period, setPeriod] = useState('');

    useEffect(() => {
        if (props && props.date && props.accountId) {
            const startDate = moment(props.date).startOf('month').format('YYYY-MM');
            setPeriod(startDate);
            getBillApi({
                url: "/billing/summary?accountId=" + props.accountId + "&period=" + startDate
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
                setError(getBillData.message);
                if(getBillData.status === 0 && getBillData.result) {
                    setClick(getBillData.result.filter(m => m.usageType === 'click')[0]);
                    setDisk(getBillData.result.filter(m => m.usageType === 'disk')[0]);
                }
            }
        }
    }, [getBillLoading, getBillData, getBillError]);

    if (billStatus !== 0) {
        return <span style={{color: "red", fontSize: 14}}>{error}</span>
    }

    return (
        <TableContainer component={Paper} elevation={0} variant={'outlined'}>
            <Table aria-label="spanning table" size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={6}>
                            <span style={{fontWeight:'bold'}}>{period}</span> 账号消费汇总
                        </TableCell>
                    </TableRow>
                    <TableRow style={{backgroundColor:'#f9f9f9'}}>
                        <TableCell>收费项目</TableCell>
                        <TableCell align="right">使用量</TableCell>
                        <TableCell align="right">单价</TableCell>
                        <TableCell align="right">总金额</TableCell>
                        <TableCell align="right">折扣金额</TableCell>
                        <TableCell align="right">实收金额</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key='1'>
                        <TableCell>硬盘空间</TableCell>
                        <TableCell align="right">{disk && disk.unitAmount && '平均' + ccyFormat(disk.unitAmount)}G/天</TableCell>
                        <TableCell align="right">{disk && disk.unitPrice && ccyFormat(disk.unitPrice)}/G/天</TableCell>
                        <TableCell align="right">{disk && disk.amount && ccyFormat(disk.amount)}</TableCell>
                        <TableCell align="right">{disk && disk.discount && ccyFormat(disk.discount)}</TableCell>
                        <TableCell align="right">{disk && disk.fee && ccyFormat(disk.fee)}</TableCell>
                    </TableRow>
                    <TableRow key='2'>
                        <TableCell>搜索次数</TableCell>
                        <TableCell align="right">{click && click.unitAmount && ccyFormat(click.unitAmount)} 次</TableCell>
                        <TableCell align="right">{click && click.unitPrice && ccyFormat(click.unitPrice)}/次</TableCell>
                        <TableCell align="right">{click && click.amount && ccyFormat(click.amount)}</TableCell>
                        <TableCell align="right">{click && click.discount && ccyFormat(click.discount)}</TableCell>
                        <TableCell align="right">{click && click.fee && ccyFormat(click.fee)}</TableCell>
                    </TableRow>
                    <TableRow key='3'>
                        <TableCell colSpan={3} align="right">总计金额</TableCell>
                        <TableCell align="right">{ccyFormat(disk.amount + click.amount)}</TableCell>
                        <TableCell align="right">{ccyFormat(disk.discount + click.discount)}</TableCell>
                        <TableCell align="right">{ccyFormat(disk.fee + click.fee)}</TableCell>
                    </TableRow>
                    <TableRow key='4'>
                        <TableCell colSpan={4} align="left" style={{fontSize: 12, color:'grey'}}>备注：磁盘单价是年磁盘总价除以365天</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}