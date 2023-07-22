import React, {useContext, useEffect, useState} from 'react';
import dashboardStyles from "./index.css";
import {useQueryDistribute} from '../../service/datamap';
import {CURRENT_DATE, DATE_FORMAT, LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../constant";
import jwt_decode from "jwt-decode";
import MaterialTable from "material-table";
import {Card, CardContent, CardHeader, Paper} from "@mui/material";
import {DATAMAP_SUCCESS,DATAMAP_KEYWORD}  from '../../constant';
import {getRowText} from '../../intl/provider';
import useStyles from "./active.user.css";
import {AppContext} from "../../privacy/AppContext";

export default function NoFoundKeyword() {
    const classes = dashboardStyles();
    const {application, setMessage} = useContext(AppContext);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const [ endDate, setEndDate ] = useState(CURRENT_DATE);
    const headerClasses = useStyles();


    const [ hotKeyWordRank, setHotKeyWordRank] =useState({
        totalFound: 0,
        resultList: []
    })

    const tableRef = React.createRef();

    const tableColumns = [
        { title: getRowText("keyWord"), field: 'lessKey', width:"40%"},
    ];


    const [{data: getHotkeyWordRank, loading: getHotkeyWordRankLoading, error: getHotkeyWordRankError}, getHotkeyWordRankApi] = useQueryDistribute(
        {}, {manual: true});

    useEffect(() => {

        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        getHotkeyWordRankApi({
            url: '/click/keyword/rank',
            params: {
                appName: user.workspace + '_'  + application,
                clientId:auth.clientId,
                startTime: process.env.REACT_APP_APP_STARTTIME,
                endTime: DATE_FORMAT(endDate),
                clickType:"search/keyword",
                isSearchHit:-1,
                pages:1,
                pageSize:10
            }
        });

    }, [application]);

    useEffect(() => {
        if (getHotkeyWordRankLoading === false) {
            if (getHotkeyWordRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getnotHotkeyWordRankError")
                });
            } else if (getHotkeyWordRank) {
                if(getHotkeyWordRank.dmcode === DATAMAP_SUCCESS){
                    let result={};
                    let data = getHotkeyWordRank.result.resultList;
                    data.map((item) => {
                        if(item[DATAMAP_KEYWORD].length > 15){
                            let key = item[DATAMAP_KEYWORD].substr(0,15)+"...";
                            item.lessKey=<a  title= {item[DATAMAP_KEYWORD]}  >  {key} </a>;

                        }else{
                            item.lessKey = item[DATAMAP_KEYWORD];
                        }
                    })
                    result.totalFound = getHotkeyWordRank.result.totalFound;
                    result.resultList = data;
                    setHotKeyWordRank(result);
                }

            }
        }
    }, [getHotkeyWordRankLoading]);


    return(
        <Card variant="outlined" className={classes.root}>
            <CardHeader title={<span style={{fontSize: 14}}>{getRowText("notFound")}</span>} className={headerClasses.header}>
            </CardHeader>
            <CardContent>
                <MaterialTable
                    components={{
                        Container: props => <Paper {...props} elevation={0}/>
                    }}
                    tableRef={tableRef}
                    columns={tableColumns}
                    data={hotKeyWordRank.resultList}
                    options={{
                        tableLayout: "fixed",
                        toolbar: false,
                        paging: false,
                        minBodyHeight: 200,
                        rowStyle: {
                            height: 20,
                            fontSize: 13,
                        },
                        headerStyle: {
                            fontWeight: 'bold'
                        }
                    }}

                    localization={{
                        pagination: {
                            labelDisplayedRows: '{from}-{to} of {count}'
                        },
                        body: {
                            emptyDataSourceMessage: getRowText("noDataMessage"),
                            filterRow: {
                                filterTooltip: 'Filter'
                            }
                        }
                    }}
                />
            </CardContent>
        </Card>
    )
}