import React, {useContext, useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import jwt_decode from "jwt-decode";
import {LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import * as moment from "moment";
import {useGetBillingApi} from "../../service/datamap";

export default function Basic(props) {
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
               setClient(getClientData);
               props.accountId(getClientData.accountId);
            }
        }
    }, [getClientLoading, getClientData, getClientError]);

    return(
        <Grid container spacing={1} style={{fontSize: 14}}>
            <Grid item xs={12}>
                账单基本信息
            </Grid>
            <Grid item xs={3} md={2}>
                账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号
            </Grid>
            <Grid item xs={9} md={10}>
                {client.accountId}
            </Grid>
            <Grid item xs={3} md={2}>
                客户名称
            </Grid>
            <Grid item xs={3} md={4}>
                {client.name}
            </Grid>
            <Grid item xs={3} md={2}>
                客户地址
            </Grid>
            <Grid item xs={3} md={4}>
                {client.address}
            </Grid>
            <Grid item xs={3} md={2}>
                联&nbsp;&nbsp;系&nbsp;&nbsp;人
            </Grid>
            <Grid item xs={3} md={4}>
                {client.contact}
            </Grid>
            <Grid item xs={3} md={2}>
                电子邮件
            </Grid>
            <Grid item xs={3} md={4}>
                {client.email}
            </Grid>

            <Grid item xs={3} md={2}>
                账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期
            </Grid>
            <Grid item xs={3} md={4}>
                {moment(props.date).format("YYYY-MM")}
            </Grid>
            <Grid item xs={3} md={2}>
                出账日期
            </Grid>
            <Grid item xs={3} md={4}>
                {moment().format("YYYY-MM-DD")}
            </Grid>
            <Grid item xs={3} md={2}>
                账户余额
            </Grid>
            <Grid item xs={3} md={4}>
                {client.balance && client.balance.toFixed(2)}
            </Grid>
            <Grid item xs={3} md={2}>
                币&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种
            </Grid>
            <Grid item xs={3} md={4}>
                人民币
            </Grid>
        </Grid>
    )
}