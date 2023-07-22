import React, { useState,useEffect,useContext }  from 'react';
import { Grid, Divider, Paper,Skeleton } from '@mui/material';
import DataTable from '../../../component/data.table';
import {useParams} from 'react-router';
import jwt_decode from "jwt-decode";
import makeStyle from "./index.css";
import {
    CURRENT_DATE, DATAMAP_KEYWORD, DATAMAP_TITLE,
    DATE_FORMAT,
    LOCAL_STORAGE_AUTH,
    MESSAGE_ERROR,
    SEVEN_DAYS_AGO_FROM_CURRENT_DATE
} from "../../../constant";
import {AppContext} from "../../../privacy/AppContext";
import {useQueryDistribute} from "../../../service/datamap";
import {getRowText} from "../../../intl/provider";
import ROUTES from "../../routes";


/**
 * 用户量分析
 */
export default function Behaviour() {
    const classes = makeStyle();
    const [ startDate, setStartDate ] = useState(SEVEN_DAYS_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);
    const [ click, setClick ] = useState("doc");

    let papram = useParams();

    const {application, setMessage} = useContext(AppContext);
    let uid = decodeURIComponent(papram.id);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const user = jwt_decode(auth.token);

    const [{data: getkeyWordRank, loading: getkeyWordRankLoading, error: getkeyWordRankError}, getkeyWordRankApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getDataRank, loading: getDataRankLoading, error: getDataRankError}, getDataRankApi] = useQueryDistribute(
        {}, {manual: true});

    const clickList = [
        {key:"doc", value: "全部"},
        {key:"doc/recommend", value: "推荐结果点击"},
        {key:"doc/topic", value: "主题搜索结果点击"},
        {key:"doc/search/keyword", value: "关键词搜索结果点击"},
        {key:"doc/search/label", value: "标签搜索结果点击"},
        {key:"doc/search/tax", value: "分类搜索结果点击"}
    ]


    const [ keyWordRank, setKeyWordRank]  =useState({
        totalFound: 0,
        resultList: []
    });
    const [ dataRank, setDataRank ]  =useState({
        totalFound: 0,
        resultList: []
    });

    const [  keyWordRankPage, setKeyWordRankPage ] = useState(1);
    const [  dataRankPage, setDataRankPage ] = useState(1);


    useEffect(() => {
        queryKeyWordRank();
        queryDataRank();

    }, [])

    useEffect(() => {
        queryKeyWordRank();
    }, [ keyWordRankPage ])

    const queryKeyWordRank = () => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (!user || user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        getkeyWordRankApi({
            url: '/click/keyword/rank',
            params: {
                appName: user.workspace + '_' + application,
                clientId: auth.clientId,
                uid: uid,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate),
                clickType: "search/keyword",
                pages: keyWordRankPage,
                pageSize: 10
            }
        });
    };

    const queryDataRank = () => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (!user || user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;


        getDataRankApi({
            url: '/data/rank',
            params: {
                appName: user.workspace + '_' + application,
                clientId: auth.clientId,
                uid: uid,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate),
                clickType: "doc",
                pages: dataRankPage,
                pageSize: 10
            }
        });
    };

    useEffect(() => {
        queryDataRank();
    }, [ dataRankPage ])

    useEffect(() => {
        if (getDataRankLoading === false) {
            if (getDataRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getDataRank")
                });
            } else if (getDataRank) {
                let data = getDataRank.result.resultList;
                data.map((item) => {
                    if ( item.hasOwnProperty(DATAMAP_TITLE) ) {
                        if(item[DATAMAP_TITLE].length > 25){
                            let key = item[DATAMAP_TITLE].substr(0,25)+"...";
                            item.lessTitle = <a  title= {item[DATAMAP_TITLE]}  >  {key} </a>;

                        }else{
                            item.lessTitle = item[DATAMAP_TITLE];
                        }
                    } else {
                        item.lessTitle = item['docId'];
                    }
                })
                let result = {};
                result.totalFound = getDataRank.result.totalFound;
                result.resultList = data;
                setDataRank( getDataRank.result);
            }
        }
    }, [getDataRankLoading]);

    useEffect(() => {
        if (getkeyWordRankLoading === false) {
            if (getkeyWordRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getkeyWordRankError")
                });
            } else if (getkeyWordRank) {
                let data = getkeyWordRank.result.resultList;
                data.map((item) => {
                    if(item[DATAMAP_KEYWORD].length > 15){
                        let key = item[DATAMAP_KEYWORD].substr(0,15)+"...";
                        item.lessKey = <a  title= {item[DATAMAP_KEYWORD]}  >  {key} </a>;

                    }else{
                        item.lessKey = item[DATAMAP_KEYWORD];
                    }
                })
                let result = {};
                result.totalFound = getkeyWordRank.result.totalFound;
                result.resultList = data;
                setKeyWordRank( getkeyWordRank.result);
            }
        }
    }, [getkeyWordRankLoading]);


    const handledDataRankChange = (value) => {
        setDataRankPage(value);
    };

    const handledKeyWordRankChange = (value) => {
        setKeyWordRankPage(value);
    };


    return (
        <Paper elevation={0} variant="outlined" className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={4} md={6} lg={8} className={classes.header}>
                    {getRowText("actionAnalysis")}
                </Grid>

                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={6} sm container direction="column" className={classes.divider}>
                    <Grid item className={classes.subHeader}>
                         {getRowText("topKeywordSort")}
                    </Grid>
                    <Grid item>
                        { getkeyWordRankLoading.pending? <Skeleton variant="rect" height={300}/> :
                        <DataTable
                            rowClick={ROUTES.APP_SEARCH_SNAP.url}
                            jumpParam={ ['keyword']}
                            columns={[
                                { title: getRowText("keyWord"), field: 'lessKey',width:"70%" },
                                { title: getRowText("searchCounts"), field: 'clickCount',width:"30%" }
                            ]}
                            data={keyWordRank.resultList}
                            totalFound={keyWordRank.totalFound}
                            page={keyWordRankPage}
                            onChange={handledKeyWordRankChange}
                        />}
                    </Grid>
                </Grid>
                <Grid item xs={6} container>
                    <Grid item xs={6} md={8} className={classes.subHeader}>
                        {getRowText("topClickData")}
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