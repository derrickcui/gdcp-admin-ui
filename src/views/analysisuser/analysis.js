import React, { useState,useEffect,useContext } from 'react';
import { Grid, Divider, Paper, Skeleton } from '@mui/material';
import DataTable from '../../component/data.table';
import jwt_decode from "jwt-decode";
import Map from '../../component/map/index';
import ROUTES from "../routes";
import {getRowText} from '../../intl/provider';
import makeStyle from './index.css';
import {
    CURRENT_DATE, DATAMAP_SUCCESS, DATAMAP_UID,
    DATE_FORMAT,
    LOCAL_STORAGE_AUTH,
    MESSAGE_ERROR,
    SEVEN_DAYS_AGO_FROM_CURRENT_DATE
} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import {useQueryDistribute} from "../../service/datamap";


/**
 * 用户分析
 */
export default function Analysis() {
    const classes = makeStyle();
    const [ startDate, setStartDate ] = useState(SEVEN_DAYS_AGO_FROM_CURRENT_DATE);
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);
    const {application, setMessage} = useContext(AppContext);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const user = jwt_decode(auth.token);

    const [{data: getUserRank, loading: getUserRankLoading, error: getUserRankError}, getUserRankApi] = useQueryDistribute(
        {}, {manual: true});

    const [ uidRank, setUidRank ] = useState({
        totalFound: 0,
        resultList: []
    });
    const [ page, setPage ] = useState(1);


    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        let param= {
            appName: user.workspace + '_'  + application,
            clientId:auth.clientId,
            startTime: DATE_FORMAT(startDate),
            endTime: DATE_FORMAT(endDate),
            pages: page,
            pageSize: 10
        }

        getUserRankApi({
            url: '/user/rank',
            params: param
        });

    }, []);

    useEffect(() => {
        if (getUserRankLoading === false) {
            if (getUserRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserTrendError")
                });
            } else if (getUserRank) {
                if(getUserRank.dmcode === DATAMAP_SUCCESS){
                    let data = getUserRank.result.resultList;
                    data.map((item) => {
                        if(item[DATAMAP_UID].length > 15){
                            let key = item[DATAMAP_UID].substr(0,15)+"...";
                            item.lessUid = <a  title= {item[DATAMAP_UID]}  >  {key} </a>;

                        }else{
                            item.lessUid = item[DATAMAP_UID];
                        }
                    })
                    let result = {};
                    result.totalFound = getUserRank.result.totalFound;
                    result.resultList = data;
                    setUidRank( getUserRank.result);
                }
            }
        }
    }, [getUserRankLoading]);

    useEffect(() => {
        let param= {
            appName: user.workspace + '_'  + application,
            clientId:auth.clientId,
            startTime: DATE_FORMAT(startDate),
            endTime: DATE_FORMAT(endDate),
            pages: page,
            pageSize: 10
        }

    }, [ page ])

    const handleChange = (value) => {
        setPage(value);
    };

    return (
            <Paper elevation={0} variant="outlined" >
            <Grid container spacing={2} className={classes.root}>
                <Grid item xs={12} sm={4} md={6} lg={6} className={classes.header}>
                    {getRowText("userAnalysis")}
                </Grid>
                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={12} md={12} lg={5} xl={6} container direction="column">
                    <Grid item className={classes.subHeader}>
                        {getRowText("topUser")}
                    </Grid>
                    <Grid item>
                       {getUserRankLoading.pending? <Skeleton variant="rect" height={200}/> :
                            <DataTable
                                columns={[
                                    { title: getRowText("userID"), field: 'lessUid' },
                                    { title: getRowText("actionCount"), field: 'count' }
                                ]}
                                data={uidRank.resultList}
                                totalFound={uidRank.totalFound}
                                page={page}
                                onChange={handleChange}
                                rowClick={ROUTES.APP_USER_SNAP.url}
                                jumpParam={ ['uid']}
                            />
                       }
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12} lg={7} xl={6} container direction="column">
                    <Grid item className={classes.subHeader}>
                        {getRowText("topMonthLocation")}
                    </Grid>
                    <Grid item>
                        <Map/>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}