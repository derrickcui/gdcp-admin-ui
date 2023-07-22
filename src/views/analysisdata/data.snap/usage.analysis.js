import React, { useState,useEffect,useContext } from 'react';
import { Grid, Divider, Paper, Skeleton } from '@mui/material';
import DataTable from '../../../component/data.table';
import {useParams} from 'react-router';

import jwt_decode from "jwt-decode";
import ROUTES from "../../routes";
import {getRowText} from '../../../intl/provider';
import makeStyle from "./index.css";
import {
    CURRENT_DATE, DATAMAP_KEYWORD, DATAMAP_SUCCESS, DATAMAP_UID,
    DATE_FORMAT,
    LOCAL_STORAGE_AUTH,
    MESSAGE_ERROR,
    SEVEN_DAYS_AGO_FROM_CURRENT_DATE
} from "../../../constant";
import {useQueryDistribute} from "../../../service/datamap";
import {AppContext} from "../../../privacy/AppContext";


/**
 * 行为分析
 */
export default function UsageAnalysis() {
    const classes = makeStyle();
    const [ startDate, setStartDate ] = useState(SEVEN_DAYS_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);
    const [ click, setClick ] = useState("doc");
    const clickList = [
        {key:"doc", value: "全部"},
        {key:"doc/search/keyword", value: "关键词搜索结果点击"},
        {key:"doc/search/label", value: "标签搜索结果点击"},
        {key:"doc/search/tax", value: "分类搜索结果点击"}
    ]


    const [ keyWordRank, setKeyWordRank] =useState({
        totalFound: 0,
        resultList: []
    })
    const [ uidRank, setUidRank] =useState({
        totalFound: 0,
        resultList: []
    })
    let papram = useParams();
    let papramArray=papram.id.split("&&");
    let keyword = decodeURIComponent(papramArray[1]);
    const {application, setMessage} = useContext(AppContext);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getkeyWordRank, loading: getkeyWordRankLoading, error: getkeyWordRankError}, getkeyWordRankApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getUidRank, loading: getUidRankLoading, error: getUidRankError}, getUidRankApi] = useQueryDistribute(
        {}, {manual: true});



    const [  uidRankPage, setUidRankPage ] = useState(1);
    const [  keyWordRankPage, setKeyWordRankPage ] = useState(1);

    useEffect(() => {
        queryKeyWordRank();
        queryUidRank();

    }, [])

    const queryUidRank = () => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (!user || user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        getUidRankApi({
            url: '/user/rank',
            params: {
                appName: user.workspace + '_' + application,
                clientId: auth.clientId,
                docId: keyword,
                clickType: click,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate),
                pages: uidRankPage,
                pageSize: 10
            }
        });
    };

    const queryKeyWordRank = () => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (!user || user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        getkeyWordRankApi({
            url: '/click/keyword/rank',
            params: {
                appName: user.workspace + '_' + application,
                clientId: auth.clientId,
                docId: keyword,
                clickType: "doc",
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate),
                pages: keyWordRankPage,
                pageSize: 10
            }
        });
    };

    useEffect(() => {
        queryKeyWordRank();
    }, [ keyWordRankPage ])

    useEffect(() => {
        queryUidRank();
    }, [ uidRankPage ])

    useEffect(() => {
        if (getUidRankLoading === false) {
            if (getUidRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUidRankError")
                });
            } else if (getUidRank) {
                if(getUidRank.dmcode === DATAMAP_SUCCESS) {
                    let data = getUidRank.result.resultList;
                    data.map((item) => {
                        if(item[DATAMAP_UID].length > 15){
                            let key = item[DATAMAP_UID].substr(0,15)+"...";
                            item.lessUid=<a  title= {item[DATAMAP_UID]}  >  {key} </a>;

                        }else{
                            item.lessUid = item[DATAMAP_UID];
                        }
                    })
                    let result={};
                    result.totalFound = getUidRank.result.totalFound;
                    result.resultList = data;
                    setUidRank( getUidRank.result);
                }
            }
        }
    }, [getUidRankLoading]);

    useEffect(() => {
        if (getkeyWordRankLoading === false) {
            if (getkeyWordRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text:  getRowText("getkeyWordRankError")
                });
            } else if (getkeyWordRank) {
                if(getkeyWordRank.dmcode === DATAMAP_SUCCESS) {
                    let data = getkeyWordRank.result.resultList;
                    data.map((item) => {
                        if(item[DATAMAP_KEYWORD].length > 15){
                            let key=item[DATAMAP_KEYWORD].substr(0,15)+"...";
                            item.lessKeyword = <a  title= {item[DATAMAP_KEYWORD]}  >  {key} </a>;

                        }else{
                            item.lessKeyword = item[DATAMAP_KEYWORD];
                        }
                    })
                    let result = {};
                    result.totalFound = getkeyWordRank.result.totalFound;
                    result.resultList = data;
                    setKeyWordRank( getkeyWordRank.result);
                }
            }
        }
    }, [getkeyWordRankLoading]);


    const handledKeyWordRankChange = (value) => {
        setKeyWordRankPage(value);
    };

    const handledUidRankChange = (value) => {
        setUidRankPage(value);
    };


    return (
        <Paper variant="outlined" className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={4} md={6} lg={8} className={classes.header}>
                    {getRowText("dataUseAnalysis")}
                </Grid>

                <Grid item xs={12}>
                    <Divider/>
                </Grid>

                <Grid item xs={6} container className={classes.divider}>
                    <Grid item xs={6} md={8} className={classes.subHeader}>
                        {getRowText("readUserTop")}
                    </Grid>
                    <Grid item xs={12}>
                        { getUidRankLoading.pending?  <Skeleton variant="rect" height={300}/> :
                        <DataTable
                            rowClick={ROUTES.APP_USER_SNAP.url}
                            jumpParam={ ['uid']}
                            columns={[
                                { title: getRowText("userID"), field: 'lessUid' },
                                { title: getRowText("readCounts"), field: 'count' }
                            ]}
                            data={uidRank.resultList}
                            totalFound={uidRank.totalFound}
                            page={uidRankPage}
                            onChange={handledUidRankChange}
                        />}
                    </Grid>
                </Grid>

                <Grid item xs={6} sm container direction="column" className={classes.divider}>
                    <Grid item className={classes.subHeader}>
                         {getRowText("relatedKeyword")}
                    </Grid>
                    <Grid item>
                    { getkeyWordRankLoading.pending?  <Skeleton variant="rect" height={300}/> :
                        <DataTable
                            status={getkeyWordRankLoading.pending}
                            rowClick={ROUTES.APP_SEARCH_SNAP.url}
                            jumpParam={ ['keyword']}
                            columns={[
                                { title: getRowText("keyWord"), field: 'lessKeyword' },
                                { title: getRowText("searchCounts"), field: 'clickCount' }
                            ]}
                            data={keyWordRank.resultList}
                            totalFound={keyWordRank.totalFound}
                            page={keyWordRankPage}
                            onChange={handledKeyWordRankChange}
                        />}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}