import React, {useContext, useEffect, useState} from 'react';
import {useQueryDistribute} from '../../service/datamap';
import jwt_decode from "jwt-decode";
import MaterialTable from "material-table";
import {Paper} from "@mui/material";
import {
    CURRENT_DATE,
    DATAMAP_SUCCESS, DATE_FORMAT, LOCAL_STORAGE_AUTH, MESSAGE_ERROR
} from '../../constant/index';
import {getRowText} from '../../intl/provider';
import {AppContext} from "../../privacy/AppContext";

export default function TopUser() {
    const {application, setMessage} = useContext(AppContext);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);

    const [ hotUserRank, setUserRank] =useState({
        totalFound: 0,
        resultList: []
    })

    const tableRef = React.createRef();

    const tableColumns = [
        { title: getRowText("userName"), field: 'uid', width:"40%"},
        { title: getRowText("actionCount"), field: 'count', width:"25%"},
    ];


    const [{data: getUserRank, loading: getUserRankLoading, error: getUserRankError}, getUserRankApi] = useQueryDistribute(
        {}, {manual: true});

    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        getUserRankApi({
            url: '/user/rank',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                startTime: process.env.REACT_APP_APP_STARTTIME,
                endTime: DATE_FORMAT(endDate),
                pages:1,
                pageSize:10
            }
        });

    }, [application]);

    useEffect(() => {
        if (getUserRankLoading === false) {
            if (getUserRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserRankError")
                });
            } else if (getUserRank) {
                if(getUserRank.dmcode === DATAMAP_SUCCESS){
                    let result={};
                    let data = getUserRank.result.resultList;
                    result.totalFound = getUserRank.result.totalFound;
                    result.resultList = data;
                    setUserRank(result);
                }

            }
        }
    }, [getUserRankLoading]);


    return (
        <MaterialTable
            components={{
                Container: props => <Paper {...props} elevation={0}/>
            }}
            tableRef={tableRef}
            columns={tableColumns}
            data={hotUserRank.resultList}
            options={{
                tableLayout: "fixed",
                toolbar: false,
                paging: false,
                padding: 'dense',
                minBodyHeight: 200,
                rowStyle: {
                    fontSize: 14,
                },
                headerStyle: {
                    fontWeight: 'bold'
                }
            }}
        />
    );
}