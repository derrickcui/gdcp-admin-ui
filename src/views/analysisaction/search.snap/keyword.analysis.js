import React, { useState,useEffect,useContext }  from 'react';
import { Grid, Divider, Paper, Skeleton } from '@mui/material';
import DataTable from '../../../component/data.table';
import {useParams} from 'react-router';

import jwt_decode from "jwt-decode";
import ROUTES from "../../routes";
import {getRowText} from '../../../intl/provider';
import makeStyle from "./index.css";
import {
    CURRENT_DATE, DATAMAP_SUCCESS, DATAMAP_TITLE, DATAMAP_UID,
    DATE_FORMAT,
    LOCAL_STORAGE_AUTH,
    MESSAGE_ERROR,
    SEVEN_DAYS_AGO_FROM_CURRENT_DATE
} from "../../../constant";
import {useQueryDistribute} from "../../../service/datamap";
import {AppContext} from "../../../privacy/AppContext";

/**
 * 关键词分析
 */
export default function KeywordAnalysis() {
    const [ startDate, setStartDate ] = useState(SEVEN_DAYS_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);
    const classes = makeStyle();
    const [ click, setClick ] = useState("doc");

    const clickList = [
        {key:"doc", value: "全部"},
        {key:"doc/search/keyword", value: "关键词搜索结果点击"},
        {key:"doc/search/label", value: "标签搜索结果点击"},
        {key:"doc/search/tax", value: "分类搜索结果点击"}
    ]

    let papram = useParams();
    let keyword = decodeURIComponent(papram.id);
    const {application, setMessage} = useContext(AppContext);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getUidRank, loading: getUidRankLoading, error: getUidRankError}, getUidRankApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getDataRank, loading: getDataRankLoading, error: getDataRankError}, getDataRankApi] = useQueryDistribute(
        {}, {manual: true});

    const [ uidRank, setUidRank ] =useState({
        totalFound: 0,
        resultList: []
    })
    const [ dataRank, setDataRank ] = useState([ ]);

    const [  uidRankPage, setUidRankPage ] = useState(1);
    const [  dataRankPage, setDataRankPage ] = useState(1);


    useEffect(() => {
        queryUidRank();
        queryDataRank();

    }, [])

    useEffect(() => {
        queryDataRank();
    }, [ dataRankPage ])

    useEffect(() => {
        queryUidRank();
    }, [ uidRankPage ])

    const queryUidRank = () => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        getUidRankApi({
            url: '/user/rank',
            params: {
                appName: user.workspace + '_' + application,
                clientId: auth.clientId,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate),
                keyword: keyword,
                clickType: "search/keyword",
                pages: uidRankPage,
                pageSize: 10
            }
        });

    };

    const queryDataRank = () => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        getDataRankApi({
            url: '/data/rank',
            params: {
                appName: user.workspace + '_' + application,
                clientId: auth.clientId,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate),
                keyword: keyword,
                clickType: click,
                pages: dataRankPage,
                pageSize: 10
            }
        });
    };

    useEffect(() => {
        if (getDataRankLoading === false) {
            if (getDataRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getReadDataTopError")
                });
            } else if (getDataRank) {
                if(getDataRank.dmcode === DATAMAP_SUCCESS) {
                    let data = getDataRank.result.resultList;
                    data.map((item) => {
                        if(item[DATAMAP_TITLE] && item[DATAMAP_TITLE].length > 25){
                            let key = item[DATAMAP_TITLE].substr(0,25)+"...";
                            item.lessTitle = <a  title= {item[DATAMAP_TITLE]}  >  {key} </a>;

                        } else if ( item[DATAMAP_TITLE] ) {
                            item.lessTitle = item[DATAMAP_TITLE];
                        } else {
                            item.lessTitle = getRowText("noTitle")
                        }
                    })
                    let result = {};
                    result.totalFound = getDataRank.result.totalFound;
                    result.resultList = data;
                    setDataRank( getDataRank.result);
                }
            }
        }
    }, [getDataRankLoading]);

    useEffect(() => {
        if (getUidRankLoading === false) {
            if (getUidRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getSearchUidRankError")
                });
            } else if (getUidRank) {
                if(getUidRank.dmcode === DATAMAP_SUCCESS) {
                    let data = getUidRank.result.resultList;
                    data.map((item) => {
                        if(item[DATAMAP_UID].length > 15){
                            let key = item[DATAMAP_UID].substr(0,15)+"...";
                            item.lessUid = <a  title= {item[DATAMAP_UID]}  >  {key} </a>;

                        }else{
                            item.lessUid = item[DATAMAP_UID];
                        }
                    })
                    let result = {};
                    result.totalFound = getUidRank.result.totalFound;
                    result.resultList = data;
                    setUidRank( getUidRank.result);
                }
            }
        }
    }, [getUidRankLoading]);


    const handledDataRankChange = (value) => {
        setDataRankPage(value);
    };

    const handledUidRankChange = (value) => {
        setUidRankPage(value);
    };


    return (
        <Paper variant="outlined" className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={12} className={classes.header}>
                    {getRowText("keyWordAnalysis")}
                </Grid>

                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={6} sm container direction="column" className={classes.divider}>
                    <Grid item className={classes.subHeader}>
                         {getRowText("searchUidRank")}
                    </Grid>
                    <Grid item>
                        { getUidRankLoading.pending?  <Skeleton variant="rect" height={300}/> :
                            <DataTable
                                rowClick={ROUTES.APP_USER_SNAP.url}
                                jumpParam={ ['uid']}
                                columns={[
                                    { title: getRowText("userID"), field: 'lessUid' },
                                    { title: getRowText("searchCounts"), field: 'count' }
                                ]}
                                data={uidRank.resultList}
                                totalFound={uidRank.totalFound}
                                page={uidRankPage}
                                onChange={handledUidRankChange}
                            />
                        }
                    </Grid>
                </Grid>
                <Grid item xs={6} container>
                    <Grid item xs={12} className={classes.subHeader}>
                        {getRowText("readDataTop")}
                    </Grid>
                    <Grid item xs={12}>
                        { getDataRankLoading.pending? <Skeleton variant="rect" height={300}/> :
                            <DataTable
                                jumpParam={ ['title','docId']}
                                rowClick={ROUTES.APP_DATA_SNAP.url}
                                columns={[
                                    { title: getRowText("data"), field: 'lessTitle' },
                                    { title: getRowText("clickCounts"), field: 'actionCount' }
                                ]}
                                data={dataRank.resultList}
                                totalFound={dataRank.totalFound}
                                page={dataRankPage}
                                onChange={handledDataRankChange}
                            />}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}