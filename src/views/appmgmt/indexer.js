import React, {useContext, useEffect, useState} from 'react';
import {Divider, Grid, Typography} from "@mui/material";
import useStyles from "../dataimport/index.css";
import {useSearchEngineGetAxios} from "../../service/api.service";
import {AppContext} from "../../privacy/AppContext";
import {MESSAGE_ERROR} from "../../constant";
import {getRowText} from "../../intl/provider";

export default function Indexer() {
    const classes = useStyles();
    const [{data: getAllFieldsData, loading: getAllFieldsLoading, error: getAllFieldsError}, getAllFieldsApi] = useSearchEngineGetAxios(
        {}, {manual: true});
    const [fields, setFields] = useState([]);
    const {application, setMessage} = useContext(AppContext);

    useEffect(() => {
        if (application && application !== '') {
            getAllFieldsApi({
                url: '/aux/' + application + "/field?type=client"
            });
        }
    }, [application]);

    useEffect(() => {
        if (!getAllFieldsLoading) {
            if (getAllFieldsError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserMonthCountError")
                });
            } else if (getAllFieldsData) {
                if(getAllFieldsData.status === 0) {
                    setFields(getAllFieldsData.result);
                }
            }
        }
    }, [getAllFieldsLoading, getAllFieldsData, getAllFieldsError]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography className={classes.title}>字段管理</Typography>
                <Divider/>
            </Grid>
            <Grid item xs={12}>
                asdfasdf
            </Grid>
        </Grid>)
}