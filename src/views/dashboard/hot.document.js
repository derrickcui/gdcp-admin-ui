import React, {useContext, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, Paper} from "@mui/material";
import dashboardStyles from "./index.css";
import {useQueryDistribute} from '../../service/datamap';
import {CURRENT_DATE, DATE_FORMAT, LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../constant";
import jwt_decode from "jwt-decode";
import {DATAMAP_SUCCESS,DATAMAP_TITLE}  from '../../constant/index';
import MaterialTable from "material-table";
import {getRowText} from '../../intl/provider';
import useStyles from "./active.user.css";
import {AppContext} from "../../privacy/AppContext";


export default function HotDocument() {
    const classes = dashboardStyles();
    const {application, setMessage} = useContext(AppContext);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
     const [ endDate, setEndDate ] = useState(CURRENT_DATE);
    const headerClasses = useStyles();


    const [ dataRank, setDataRank] =useState({
        totalFound: 0,
        resultList: []
    })


    const tableRef = React.createRef();

    const tableColumns = [
        { title: getRowText("data"), field: 'lessTitle', width: "50%"},
        { title: getRowText("readCount"), field: 'actionCount', width:"25%"},
        { title: getRowText("readUserCount"), field: 'uidCount', width:"25%"}
    ];

    const [{data: getDataRank, loading: getDataRankLoading, error: getDataRankError}, getDataRankApi] = useQueryDistribute(
        {}, {manual: true});

    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;

        if (!application || application === 'undefined' || application === null) return;

        getDataRankApi({
            url: '/data/rank',
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
        if (getDataRankLoading === false) {
            if (getDataRankError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getDataRankError")
                });
            } else if (getDataRank) {
                if(getDataRank.dmcode === DATAMAP_SUCCESS){
                    let result={};
                    let data = getDataRank.result.resultList;
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
                    result.totalFound = getDataRank.result.totalFound;
                    result.resultList = data;
                    setDataRank( result);
                }

            }
        }
    }, [getDataRankLoading]);

    return(
        <Card variant="outlined" className={classes.root}>
            <CardHeader title={<span style={{fontSize: 14}}>{getRowText("hotData")}</span>} className={headerClasses.header}/>
            <CardContent>
                <MaterialTable
                    components={{
                        Container: props => <Paper {...props} elevation={0}/>
                    }}
                    tableRef={tableRef}
                    columns={tableColumns}
                    data={dataRank.resultList}
                    options={{
                        tableLayout: "fixed",
                        toolbar: false,
                        paging: false,
                        minBodyHeight: 200,
                        padding: 'dense',
                        rowStyle: {
                            fontSize: 14,
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