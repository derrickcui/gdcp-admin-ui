import React, { useState,useEffect,useContext } from 'react';
import { Grid, Divider, Paper, Skeleton } from '@mui/material';
import DataTable from '../../component/data.table';
import jwt_decode from "jwt-decode";
import {getRowText} from '../../intl/provider';
import makeStyle from "./index.css";
import {
    CURRENT_DATE, DATAMAP_KEYWORD, DATAMAP_SUCCESS,
    DATE_FORMAT,
    LOCAL_STORAGE_AUTH,
    MESSAGE_ERROR,
    SEVEN_DAYS_AGO_FROM_CURRENT_DATE
} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import {useQueryDistribute} from "../../service/datamap";
import ROUTES from "../routes";



/**
 * 用户量分析
 */
export default function Analysis() {
    const [ startDate, setStartDate ] = useState(SEVEN_DAYS_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);
    const classes = makeStyle();

    const {application, setMessage} = useContext(AppContext);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getHotkeyWordRank, loading: getHotkeyWordRankLoading, error: getHotkeyWordRankError}, getHotkeyWordRankApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getKeyWordRank, loading: getKeyWordRankLoading, error: getKeyWordRankError}, getKeyWordRankApi] = useQueryDistribute(
        {}, {manual: true});

    const [ click, setClick ] = useState("");

    const clickList = [
        "关键词搜索",
        "GQL搜索",
        "分类筛选",
        "访问",
        "转发",
        "分享",
        "点赞",
        "收藏"
    ]
   

    const [ keyWordRank, setKeyWordRank] =useState({
        totalFound: 0,
        resultList: []
    })
    const [ hotKeyWordRank, setHotKeyWordRank] =useState({
        totalFound: 0,
        resultList: []
    })

    const [  hotkeyWordpage, setHotkeyWordpage ] = useState(1);
    const [  keyWordpage, setKeyWordpage ] = useState(1);

    useEffect(() => {
        queryHotkeyWordRank();
    }, [ hotkeyWordpage ])

    useEffect(() => {
        queryKeyWordRank();

    }, [ keyWordpage ])

    const handleChange = (value) => {
        setHotkeyWordpage(value);
    };

    const handleChangekeyWordpage = (value) => {
        setKeyWordpage(value);
    };

    useEffect(() => {
            queryHotkeyWordRank();
            queryKeyWordRank();
        
        
    }, [ startDate, endDate ]);

    const queryKeyWordRank = () => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;


        let param = {
            appName: user.workspace + '_'  + application,
            clientId:auth.clientId,
             clickType: "search/keyword",
            startTime: DATE_FORMAT(startDate),
            endTime: DATE_FORMAT(endDate),
            isSearchHit:-1,
            pages: keyWordpage,
            pageSize: 10
        }
        getKeyWordRankApi({
            url: '/click/keyword/rank',
            params: param
        });
        
    };

    const queryHotkeyWordRank = () => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        let param = {
            appName: user.workspace + '_'  + application,
            clientId:auth.clientId,
            clickType: "search/keyword",
            startTime: DATE_FORMAT(startDate),
            endTime: DATE_FORMAT(endDate),
            isSearchHit:1,
            pages: hotkeyWordpage,
            pageSize: 10
        }

        getHotkeyWordRankApi({
            url: '/click/keyword/rank',
            params: param
        });
    };

    useEffect(() => {
        if (getKeyWordRankLoading === false) {
            if (getKeyWordRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getNotFoundDataError")
                });
            } else if (getKeyWordRank) {
                let data = getKeyWordRank.result.resultList;
                data.map((item) => {
                    if(item[DATAMAP_KEYWORD].length > 15){
                        let key = item[DATAMAP_KEYWORD].substr(0,15)+"...";
                        item.lessKey=<a  title= {item[DATAMAP_KEYWORD]}  >  {key} </a>;

                    }else{
                        item.lessKey = item[DATAMAP_KEYWORD];
                    }
                })
                let result={};
                result.totalFound =getKeyWordRank.result.totalFound;
                result.resultList = data;
                setKeyWordRank( getKeyWordRank.result);
            }
        }
    }, [getKeyWordRankLoading]);

    useEffect(() => {
        if (getHotkeyWordRankLoading === false) {
            if (getHotkeyWordRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getHotDataRankError")
                });
            } else if (getHotkeyWordRank) {
                if(getHotkeyWordRank.dmcode === DATAMAP_SUCCESS) {
                    let data = getHotkeyWordRank.result.resultList;
                data.map((item) => {
                    if(item[DATAMAP_KEYWORD].length > 15){
                        let key = item[DATAMAP_KEYWORD].substr(0,15)+"...";
                        item.lessKey=<a  title= {item[DATAMAP_KEYWORD]}  >  {key} </a>;

                    }else{
                        item.lessKey = item[DATAMAP_KEYWORD];
                    }
                })
                let result={};
                result.totalFound = getHotkeyWordRank.result.totalFound;
                result.resultList = data;
                setHotKeyWordRank( result);
                }
            }
        }
    }, [getHotkeyWordRankLoading]);


    return (
        <Paper variant="outlined" className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={4} md={6} lg={8} className={classes.header}>
                    {getRowText("searchDataAnalysis")}
                </Grid>

                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={6} sm container direction="column" className={classes.divider}>
                    <Grid item className={classes.subHeader}>
                        {getRowText("hotSearch")}
                    </Grid>
                    <Grid item>
                   { getHotkeyWordRankLoading.pending? <Skeleton variant="rect" height={300}/> :
                        <DataTable
                            rowClick={ROUTES.APP_SEARCH_SNAP.url}
                            jumpParam={ ['keyword']}
                            columns={[
                                { title: getRowText("keyWord"), field: 'lessKey', width:"40%"},
                                { title: getRowText("searchCount"), field: 'clickCount', width:"30%"},
                                { title: getRowText("searchUserCount"), field: 'uidCount', width:"30%"}
                            ]}
                            data={hotKeyWordRank.resultList}
                            totalFound={hotKeyWordRank.totalFound}
                            page={hotkeyWordpage}
                            onChange={handleChange}
                        />} 
                    </Grid>
                </Grid>
                <Grid item xs={6} sm container direction="column">
                    <Grid item className={classes.subHeader}>
                        {getRowText("notFoundHotSearch")}
                    </Grid>
                    <Grid item>
                    { getKeyWordRankLoading.pending? <Skeleton variant="rect" height={300}/> :
                        <DataTable
                            rowClick={ROUTES.APP_SEARCH_SNAP.url}
                            jumpParam={ ['keyword']}
                            columns={[
                                { title: getRowText("keyWord"), field: 'lessKey', width:"40%"},
                                { title: getRowText("searchCount"), field: 'clickCount', width:"30%"},
                                { title: getRowText("searchUserCount"), field: 'uidCount', width:"30%"}
                            ]}
                            data={keyWordRank.resultList}
                            totalFound={keyWordRank.totalFound}
                            page={keyWordpage}
                            onChange={handleChangekeyWordpage}
                        />} 
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}