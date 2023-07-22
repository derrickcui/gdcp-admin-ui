import React, {useEffect, useRef, useState} from 'react';
import {Button, Divider, Grid, Stack} from "@mui/material";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Paper from "@mui/material/Paper";
import Basic from "./basic";
import MonthBill from "./billing";
import FileSaver from 'file-saver';
import el from 'date-fns/locale/zh-CN';
import {useGetBillingApi} from "../../service/datamap";
import * as moment from "moment";
import Typography from "@mui/material/Typography";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

registerLocale("el", el);

export default function Bill() {
    const [startDate, setStartDate] = useState(new Date());
    const [accountId, setAccountId] = useState('');
    const [open, setOpen] = React.useState(false);

    const [{data: downloadFileData, loading: downloadFileLoading, error: downloadFileError}, downloadFileApi] = useGetBillingApi(
        {}, {manual: true});
    const [billStatus, setBillStatus] = useState(1);

    function Callback (value){
        setAccountId(value);
    }

    const componentRef = useRef();
    const handlePrint = () => {
        let period = moment(startDate).format("YYYYMM");
        downloadFileApi({
            url: "/billing/download?accountId=" + accountId + "&period=" + period,
            responseType: 'blob'
        });
        setOpen(true);
    }

    useEffect(() => {
        if (!downloadFileLoading) {
            if (downloadFileData) {
                let blob =new Blob([downloadFileData],   {type: 'application/pdf'});
                let period = moment(startDate).format("YYYYMM");
                FileSaver.saveAs(blob, accountId + "-" + period + "-月账单.pdf");
                setOpen(false);
            }
        }
    }, [downloadFileLoading, downloadFileData, downloadFileError]);

    return (
        <Paper variant={"outlined"} style={{padding: 10}} ref={componentRef}>
            <Grid container direction={"column"} columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={1}>
                <Grid item container direction={"row"} spacing={0}>
                    <Grid itme style={{paddingTop: 2, fontSize: 14}}>
                        费用日期：
                    </Grid>
                    <Grid item>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy-MM"
                            locale="el"
                            maxDate={new Date()}
                            showMonthYearPicker
                            showFullMonthYearPicker
                        />
                    </Grid>
                    <Grid item style={{paddingLeft: 20}}>
                        {billStatus === 0 &&
                        <Button variant="contained" size="small" onClick={handlePrint}>
                            下载
                        </Button>
                        }
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider/>
                </Grid>
                <Grid item>
                    <Basic accountId={Callback} date={startDate}/>
                </Grid>
                <Grid item>
                    <Divider/>
                </Grid>
                <Grid item>
                    <MonthBill accountId={accountId} date={startDate} status={setBillStatus}/>
                </Grid>
            </Grid>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <Stack gap={1} justifyContent="center" alignItems="center">
                    <CircularProgress color="inherit" />
                    <Typography>正在下载，请耐心等待...</Typography>
                </Stack>
            </Backdrop>
        </Paper>
    )
}