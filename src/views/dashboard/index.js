import React, {useContext, useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import Static from "./static";
import ActiveUser from "./active.user";
import HotKeyword from "./hot.keyword";
import NoFoundKeyword from "./nofount.keyword";
import HotDocument from "./hot.document";
import {useQueryDistribute} from '../../service/datamap';
import {CURRENT_DATE, DATE_FORMAT, LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../constant";
import jwt_decode from "jwt-decode";
import {
    DATAMAP_SUCCESS
}  from '../../constant';
import {getRowText} from '../../intl/provider';
import {AppContext} from "../../privacy/AppContext";

export  default function Dashboard() {
    const {application, setMessage} = useContext(AppContext);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [ endDate, setEndDate ] = useState(CURRENT_DATE);

    const [allUserCnt, setAllUserCnt] = useState(0);

    const [userVolumn, setUserVolumn] = useState(0);

    const [clickCount, setClickCount] = useState(0);

    const [dataSize, setDataSize] = useState(0);

    const [Conversion, setConversion] = useState(0);


    const [{data: getUserCount, loading: getUserCountLoading, error: getUserCountError}, getUserCountApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getUserVolumn, loading: getUserVolumnLoading, error: getUserVolumnError}, getUserVolumnApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getClickCount, loading: getClickCountLoading, error: getClickCountError}, getClickCountApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getDataSize, loading: getDataSizeLoading, error: getDataSizeError}, getDataSizeApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getConversion, loading: getConversionLoading, error: getConversionError}, getConversionApi] = useQueryDistribute(
        {}, {manual: true});

    useEffect(() => {
        console.log("bbbbb");
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;
        console.log(">>> " + application)
        getUserCountApi({
            url: '/user/isRegister/count',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId
            }
        });

        getUserVolumnApi({
            url: '/user/isRegister/trend',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                startTime: DATE_FORMAT(endDate),
                endTime: DATE_FORMAT(endDate)
            }
        });

        getClickCountApi({
            url: '/click/count',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                clickType: "search"
            }
        });

        getDataSizeApi({
            url: '/data/size/trend',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                startTime: DATE_FORMAT(endDate),
                endTime: DATE_FORMAT(endDate),
                clickType:"doc"
            }
        });

        getConversionApi({
            url: '/session/search/conversion/rate',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
            }
        });
    }, [application]);


    useEffect(() => {
        if (getUserCountLoading === false) {
            if (getUserCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserCountError")
                });
            } else if (getUserCount) {
                if(getUserCount.dmcode === DATAMAP_SUCCESS){
                    setAllUserCnt(getUserCount.result["allUserCnt"]);
                }

            }
        }
    }, [getUserCountLoading]);

    useEffect(() => {
        if (getUserVolumnLoading === false) {
            if (getUserVolumnError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserVolumnError")
                });
            } else if (getUserVolumn && getUserVolumn.result && getUserVolumn.result.length > 0) {
                let isRegister = getUserVolumn.result[0]["isRegister"];

                if(getUserVolumn.dmcode === DATAMAP_SUCCESS && getUserVolumn.result.length>0 ){
                    let userVolumn=isRegister.unregister +isRegister.register
                    setUserVolumn(userVolumn);
                }

            }
        }
    }, [getUserVolumnLoading]);

    useEffect(() => {
        if (getClickCountLoading === false) {
            if (getClickCountError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getClickCountError")
                });
            } else if (getClickCount) {
                if(getClickCount.dmcode === DATAMAP_SUCCESS ){
                    setClickCount(getClickCount.result.count);
                }
            }
        }
    }, [getClickCountLoading]);

    useEffect(() => {
        if (getDataSizeLoading === false) {
            if (getDataSizeError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getDataSizeError")
                });
            } else if (getDataSize) {
                if(getDataSize.dmcode === DATAMAP_SUCCESS && getDataSize.result.length>0){
                    setDataSize(getDataSize.result[0]["docCount"]);
                }
            }
        }
    }, [getDataSizeLoading]);


    useEffect(() => {
        if (getConversionLoading === false) {
            if (getConversionError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getConversionError")
                });
            } else if (getConversion) {
                if(getConversion.dmcode === DATAMAP_SUCCESS){
                    setConversion(getConversion.result["searchConversionRate"]);
                }

            }
        }
    }, [getConversionLoading]);
    return(
        <Grid container direction={"column"} spacing={1}>
            <Grid item container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center">
                <Grid item>
                    <Static number={allUserCnt} label={getRowText("allUser")} order="allUser" color="#5B8FF9"/>
                </Grid>
                <Grid item>
                    <Static number={userVolumn} label={getRowText("userTotal")} order="userTotal" color="#5AD8A6"/>
                </Grid>
                <Grid item>
                    <Static number={clickCount} label={getRowText("searchTotal")}  order="searchTotal" color="#FFA94C"/>
                </Grid>
                <Grid item>
                    <Static number={dataSize} label={getRowText("dataSize")} order="searchCount" color="#6DC8EC"/>
                </Grid>
                <Grid item>
                    <Static number={Conversion} label={getRowText("searchRate")} order="searchRate" color="#FF99C3"/>
                </Grid>
            </Grid>
            <Grid item container spacing={1}>
                <Grid item xs={12} md={8}>
                    <ActiveUser/>
                </Grid>
                <Grid item xs={12} md={4} container spacing={1} direction={"column"}>
                    <Grid item>
                        <HotKeyword/>
                    </Grid>
                    <Grid item>
                        <NoFoundKeyword/>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item>
                <HotDocument/>
            </Grid>
        </Grid>
    )
}