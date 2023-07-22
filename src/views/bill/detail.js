import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Divider, Grid} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Paper from "@mui/material/Paper";
import { useReactToPrint } from "react-to-print";
import Transaction from "./detail/transaction";
import {AntTab, AntTabs, TabPanel} from "../../component/ume.tab";
import ClickDetail from "./detail/click.detail";
import DiskDetail from "./detail/disk.usage";
import DocumentDetail from "./detail/document.detail";
import {useGetBillingApi} from "../../service/datamap";
import {LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import jwt_decode from "jwt-decode";

export default function Detail() {
    const [startDate, setStartDate] = useState(new Date());
    const [value, setValue] = useState(0);
    const [accountId, setAccountId] = useState('');

    const [{data: getClientData, loading: getClientLoading, error: getClientError}, getClientApi] = useGetBillingApi(
        {}, {manual: true});
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const {setMessage} = useContext(AppContext);
    const [client, setClient] = useState({});

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



    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClick = () => {
        detailRef.current.search();
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    const detailRef = useRef(null);

    return (
        <Paper variant={"outlined"} style={{padding: 10}} ref={componentRef}>
            <Grid container direction={"column"} columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={1}>
                <Grid item container direction={"row"} spacing={0}>
                    <Grid itme style={{paddingTop: 2}}>
                        费用日期：
                    </Grid>
                    <Grid item>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy/MM"
                            maxDate={new Date()}
                            showMonthYearPicker
                            showFullMonthYearPicker
                        />
                    </Grid>
                    <Grid item style={{paddingLeft: 20}}>
                        <Button variant="contained" size="small" onClick={handleClick}>
                            查询
                        </Button>
                    </Grid>
                    <Grid item style={{paddingLeft: 20}}>
                        <Button variant="contained" size="small" onClick={handlePrint}>
                            打印
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider/>
                </Grid>
                <Grid item>
                    <AntTabs value={value}
                             onChange={handleChange}
                             aria-label="ant example">
                        <AntTab label="磁盘空间"/>
                        <AntTab label="文档数据汇总"/>
                        <AntTab label="搜索次数统计"/>
                        <AntTab label="搜索清单"/>
                    </AntTabs>
                    <TabPanel value={value} index={0}>
                        <DiskDetail accountId={accountId} date={startDate}/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <DocumentDetail accountId={accountId} date={startDate}/>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <ClickDetail accountId={accountId} date={startDate}/>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Transaction ref={detailRef} date={startDate}/>
                    </TabPanel>
                </Grid>
            </Grid>
        </Paper>
    )
}