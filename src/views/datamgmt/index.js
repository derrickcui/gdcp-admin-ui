import React, {useContext, useEffect, useState} from 'react';
import {Divider, Grid, Typography} from "@mui/material";
import { useStyles } from './index.css';
import {useDataServiceGetAxios, useSearchEngineGetAxios} from "../../service/api.service";
import {MESSAGE_ERROR} from "../../constant";
import DataTable from "./data.table";
import {AppContext} from "../../privacy/AppContext";
import {DataManagementContext} from "../../privacy/DataManagentContext";
import {getRowText} from "../../intl/provider";
import {WorkspaceContext} from "../../privacy/WorkspaceContext";
import BeatLoader from "react-spinners/BeatLoader";

export default function DataManagement() {
    const classes = useStyles();

    const [{data: getAllFieldsData, loading: getAllFieldsLoading, error: getAllFieldsError}, getAllFieldsApi] = useSearchEngineGetAxios(
        {}, {manual: true});

    const [ { data:getFieldConfigData, loading:getFieldConfigLoading, error:getFieldConfigError, response: getFieldConfigResponse },
        getFieldConfigApi ] = useDataServiceGetAxios({}, { manual: true } );
    const [fields, setFields] = useState([]);
    const {application, setMessage} = useContext(AppContext);
    const { collectionList } = useContext(WorkspaceContext);
    const [fieldConfig, setFieldConfig] = useState([]);

    useEffect(() => {
        if (application && application !== '') {
            getAllFieldsApi({
                url: '/aux/' + application + "/field?type=client"
            });
        }
    }, [application]);

    useEffect(() => {

        if (collectionList && collectionList.length > 0) {
            getFieldConfigApi({
                url: '/collections/' + collectionList[0] + "/management/config"
            });
        }
    }, [collectionList]);


    useEffect(() => {
        if (!getFieldConfigLoading) {
            if (getFieldConfigData) {
                if(getFieldConfigData.status === 0) {
                    setFieldConfig(getFieldConfigData.result);
                }
            }
        }
    }, [getFieldConfigLoading, getFieldConfigData, getFieldConfigError]);


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

    if (getFieldConfigLoading) {
        return <div style={{
            width: 300,
            height: 200,
            position: 'absolute',
            top:0,
            textAlign: "center",
            alignItems: 'center',
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto'}}>
            <BeatLoader color="#f41024" size={30} margin={5}/>
            <Typography style={{ fontSize: 14 }}>
                正在导入管理字段配置信息
            </Typography>
        </div>
       }

    const datamanagementContext = {
        fields,
        fieldConfig,
        setFieldConfig
    }

    return (
       <DataManagementContext.Provider value={datamanagementContext}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography className={classes.title}>数据管理</Typography>
                    <Divider/>
                </Grid>
                <Grid item xs={12} container spacing={1} className={classes.root}>
                    <DataTable/>
                </Grid>
            </Grid>
        </DataManagementContext.Provider>
    )
}