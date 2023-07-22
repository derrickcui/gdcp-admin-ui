import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {forwardRef, useContext, useEffect, useImperativeHandle, useState} from "react";
import {useGetBillingApi} from "../../../service/datamap";
import {MESSAGE_ERROR} from "../../../constant";
import {AppContext} from "../../../privacy/AppContext";
import DailyDisk from "./daily.disk";
import DailyDocument from "./daily.document";
import DailyClick from "./daily.click";
import Grid from "@mui/material/Grid";

const DailyStats = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        showDailyDetail() {
            setOpen(!open);
        },
    }));

    const [{data: getUsageData, loading: getUsageLoading, error: getUsageError}, getUsageApi] = useGetBillingApi(
        {}, {manual: true});
    const {setMessage} = useContext(AppContext);
    const [data, setData] = useState({});
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        if (open && props.accountId && props.date) {
            getUsageApi({
                url: "/bill/stats-daily?accountId=" + props.accountId + "&date=" + props.date
            });
        }
    }, [open, props.accountId, props.date]);


    const handleClose = () => {
        setOpen(false);
    };

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
                if (getUsageData.status === 0 && getUsageData.result) {
                    setData(getUsageData.result);
                    setError();
                } else {
                    setError(getUsageData.message);
                }
            }
        }
    }, [getUsageLoading, getUsageData, getUsageError]);


    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={'lg'}
                open={open}
            >
                <DialogTitle>[{props.date}] 数据使用详细列表</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{minHeight: 400}}>
                        {getUsageLoading ? <div style={{paddingTop: '15%', color: 'red', textAlign:'center', width:'100%'}}>正在提取详细记录，请耐心等候</div> :
                        <Grid container spacing={2} direction={"column"}>
                            <Grid item>
                                {data && data.disk && <DailyDisk data={data.disk}/>}
                            </Grid>
                            <Grid item>
                                {data && data.document && <DailyDocument data={data.document}/>}
                            </Grid>
                            <Grid item>
                                {data && data.click && <DailyClick data={data.click}/>}
                            </Grid>
                        </Grid>}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <Button variant='contained' onClick={handleClose}>关闭</Button>
                    </div>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
});

export default DailyStats;
