import React, { useState,useEffect,useContext } from 'react';
import { Grid, Divider, Paper, Hidden,Skeleton } from '@mui/material';
import DataTable from '../../component/data.table';
import jwt_decode from "jwt-decode";
import {useMountedState} from 'react-use';
import {getRowText} from '../../intl/provider';
import makeStyle from "./index.css";
import {
    CURRENT_DATE, DATAMAP_CATEGOTY, DATAMAP_SUCCESS, DATAMAP_TAG, DATAMAP_TITLE,
    DATE_FORMAT,
    LOCAL_STORAGE_AUTH,
    MESSAGE_ERROR,
    ONE_MONTH_AGO_FROM_CURRENT_DATE
} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import {useQueryDistribute} from "../../service/datamap";
import ROUTES from "../routes";


/**
 * 用户量分析
 */
export default function Analysis() {
    const isMounted = useMountedState();
    const classes = makeStyle();
    const {application, setMessage} = useContext(AppContext);
    const [ startDate, setStartDate ] = useState(ONE_MONTH_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getDateRank, loading: getDateRankLoading, error: getDateRankError}, getDateRankApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getDataCategory, loading: getDataCategoryLoading, error: getDataCategoryError}, getDataCategoryApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getTagRank, loading: getTagRankLoading, error: getTagRankError}, getTagRankApi] = useQueryDistribute(
        {}, {manual: true});

    const [ dataRank, setDataRank ] =useState({
        totalFound: 0,
        resultList: []
    })
    const [ category, setCategory ] =useState({
        totalFound: 0,
        resultList: []
    })
    const [ tagRank, setTagRank ]=useState({
        totalFound: 0,
        resultList: []
    })


    const [  dataRankPage, setDataRankPage ] = useState(1);
    const [  categoryRankPage, setCategoryRankPage ] = useState(1);
    const [  tagRankPage, setTagRankPage ] = useState(1);


    useEffect(() => {

        queryDataRank();
        queryCategoryRank();
        queryTagRank();

    }, []);


    useEffect(() => {
        if (getTagRankLoading === false) {
            if (getTagRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getTagRankError")
                });
            } else if (getTagRank) {
                if(getTagRank.dmcode === DATAMAP_SUCCESS) {
                    let data = getTagRank.result.resultList;
                    data.map((item) => {
                        if(item[DATAMAP_TAG].length > 25){
                            let key = item[DATAMAP_TAG].substr(0,25)+"...";
                            item.lessTag = <a  title= {item[DATAMAP_TAG]}  >  {key} </a>;

                        }else{
                            item.lessTag = item[DATAMAP_TAG];
                        }
                    })
                    let result = {};
                    result.totalFound = getTagRank.result.totalFound;
                    result.resultList = data;
                    if ( isMounted() ) {
                        setTagRank( getTagRank.result);
                    }
                }
            }
        }
    }, [getTagRankLoading]);

    useEffect(() => {
        if (getDataCategoryLoading === false) {
            if (getDataCategoryError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getDataCategoryError")
                });
            } else if (getDataCategory) {
                if(getDataCategory.dmcode === DATAMAP_SUCCESS) {
                    let data = getDataCategory.result.resultList;
                    data.map((item) => {
                        if(item[DATAMAP_CATEGOTY].length > 25){
                            let key=item[DATAMAP_CATEGOTY].substr(0,25)+"...";
                            item.lessCategory = <a  title= {item[DATAMAP_CATEGOTY]}  >  {key} </a>;

                        }else{
                            item.lessCategory = item[DATAMAP_CATEGOTY];
                        }
                    })
                    let result = {};
                    result.totalFound = getDataCategory.result.totalFound;
                    result.resultList = data;
                    if ( isMounted() ) {
                        setCategory( getDataCategory.result);
                    }
                }
            }
        }
    }, [getDataCategoryLoading]);

    useEffect(() => {
        if (getDateRankLoading === false) {
            if (getDateRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getDateRankError")
                });
            } else if (getDateRank) {
                if(getDateRank.dmcode === DATAMAP_SUCCESS) {
                    let data = getDateRank.result.resultList;
                    data.map((item) => {
                        if ( !item.hasOwnProperty(DATAMAP_TITLE) ) {
                            item[DATAMAP_TITLE] = "No Title"
                        }

                        if( item[DATAMAP_TITLE].length > 25 ){
                            let key=item[DATAMAP_TITLE].substr(0,25)+"...";
                            item.lessTitle = <a  title= {item[DATAMAP_TITLE]}  >  {key} </a>;

                        } else {
                            item.lessTitle = item[DATAMAP_TITLE];
                        }
                    })
                    let result = {};
                    result.totalFound = getDateRank.result.totalFound;
                    result.resultList = data;
                    if ( isMounted() ) {
                        setDataRank( getDateRank.result);
                    }
                }
            }
        }
    }, [getDateRankLoading]);

    useEffect(() => {
        queryTagRank();
    }, [ tagRankPage ])

    const queryTagRank = () => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        getTagRankApi({
            url: '/click/tag/rank',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate),
                pages: tagRankPage,
                pageSize: 10
            }
        });
    };

    const queryCategoryRank = () => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        getDataCategoryApi({
            url: '/click/category/rank',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate),
                pages: categoryRankPage,
                pageSize: 10
            }
        });
    };

    const queryDataRank = () => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        getDateRankApi({
            url: '/data/rank',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                startTime: DATE_FORMAT(startDate),
                endTime: DATE_FORMAT(endDate),
                pages: dataRankPage,
                pageSize: 10
            }
        });

    };

    useEffect(() => {
       queryCategoryRank();
    }, [ categoryRankPage ])

    useEffect(() => {
        queryDataRank();
    }, [ dataRankPage ])


    const handledTagRankChange = (value) => {
        setTagRankPage(value);
    };

    const handledCategoryRankChange = (value) => {
        setCategoryRankPage(value);
    };

    const handledDataRankChange = (value) => {
        setDataRankPage(value);
    };

    return (
        <Paper elevation={0} variant="outlined" className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={4} md={6} lg={8} className={classes.header}>
                        {getRowText("dataAnalysis")}
                </Grid>

                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={12} >
                    <Grid item className={classes.subHeader}>
                        {getRowText("hotData")}
                    </Grid>
                    <Grid item>
                    { getDateRankLoading.pending? <Skeleton variant="rect" height={300}/> :
                        <DataTable
                            jumpParam={ ['title','docId']}
                            rowClick={ROUTES.APP_DATA_SNAP.url}
                            columns={[
                                { title: getRowText("data"), field: 'lessTitle', width: "50%"},
                                { title: getRowText("readCount"), field: 'actionCount', width:"25%"},
                                { title: getRowText("readUserCount"), field: 'uidCount', width:"25%"}
                            ]}
                            data={dataRank.resultList}
                            totalFound={dataRank.totalFound}
                            page={dataRankPage}
                            onChange={handledDataRankChange}
                        />}
                    </Grid>
                </Grid>
                <Hidden smUp={tagRank.totalFound === 0}>
                <Grid item xs={12} >
                    <Grid item className={classes.subHeader}>
                        {getRowText("hotTag")}
                    </Grid>
                    <Grid item>
                   { getTagRankLoading.pending? <Skeleton variant="rect" height={300}/> :
                        <DataTable
                            columns={[
                                { title: getRowText("tag"), field: 'lessTag', width: "50%"  },
                                { title: getRowText("clickTotals"), field: 'clickCnt', width:"25%"},
                                { title: getRowText("clickUser"), field: 'userCnt', width:"25%"}
                            ]}
                            data={tagRank.resultList}
                            totalFound={tagRank.totalFound}
                            page={tagRankPage}
                            onChange={handledTagRankChange}
                        />
                    }
                    </Grid>
                </Grid>
                </Hidden>
                <Hidden smUp={category.totalFound === 0}>
                <Grid item xs={12} >
                    <Grid item className={classes.subHeader}>
                        {getRowText("hotTags")}
                    </Grid>
                    <Grid item>
                        { getDataCategoryLoading.pending? <Skeleton variant="rect" height={300}/> :
                            <DataTable
                                columns={[
                                    { title: getRowText("tax"), field: 'lessCategory', width: "50%" },
                                    { title: getRowText("clickTotals"), field: 'clickCnt', width:"25%" },
                                    { title: getRowText("clickUser"), field: 'userCnt' , width:"25%"}
                                ]}
                                data={category.resultList}
                                totalFound={category.totalFound}
                                page={categoryRankPage}
                                onChange={handledCategoryRankChange}
                            />
                        }
                    </Grid>
                </Grid>
                </Hidden>
            </Grid>
        </Paper>
    )
}