import React, { useState, useEffect, useMemo } from 'react';
import { Paper, Grid, Pagination } from '@mui/material';
import MaterialTable from 'material-table';
import { useNavigate } from "react-router-dom";
import useStyles from "./data.table.css";

export default function DataTable(props) {
    const classes = useStyles();
    const history = useNavigate();
    const [ rowClick, setRowClick ] = useState("");
    const [ columns, setColumns ] = useState([]);
    const [ data, setData ] = useState([]);
    const [ jumpParam, setJumpParam ] = useState([]);
    const [ page, setPage ] = useState(1);

    useEffect(() => {
        console.log("data table");
        setRowClick(props.rowClick);
        setColumns(props.columns);
        setData(props.data);
        setJumpParam(props.jumpParam);
        setPage(props.page);
    }, [ props.rowClick, props.columns, props.data, props.jumpParam, props.page ]);

    const handlePageChange = (event, value) => {
        setPage(value);
        props.onChange(value);
    }

    return useMemo(() => (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MaterialTable
                    isLoading={props.status}
                    components={{
                        Container: props => <Paper {...props} elevation={0}/>
                    }}
                    columns={columns}
                    data={data}        
                    onRowClick={(event, rowData) =>{
                        let jumpUrl = rowClick;
                        if (typeof jumpParam !== 'undefined' &&jumpParam.length>0) {
                            jumpUrl=rowClick+"/";
                            let i=0;
                            jumpParam.map((item) => {
                                if(i===0){
                                    jumpUrl=jumpUrl + encodeURIComponent(rowData[item]);
                                }else{
                                    jumpUrl=jumpUrl + "&&" + encodeURIComponent(rowData[item]);
                                }
                                i=i+1;
                            });
                        
                            history(jumpUrl)
                        } else if (props.queryParam && props.queryParam !== '' > 0) {
                            history({
                                pathname:  rowClick,
                                param: rowData[props.queryParam]
                            })
                        }
                    }}                        
                    options={{
                        sorting: true,
                        search: false,
                        showTitle: false,
                        toolbar: false,
                        padding: 'dense',
                        paging: false,
                        rowStyle: {
                            fontSize: 12,
                            border: 0
                        }
                    }}
                    localization={{
                        pagination: {
                            labelDisplayedRows: '{from}-{to} of {count}'
                        },
                        body: {
                            emptyDataSourceMessage: '没有相关数据',
                            filterRow: {
                                filterTooltip: 'Filter'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                    <Pagination 
                        count={props.totalFound%10===0?props.totalFound/10:parseInt(props.totalFound/10)+1}
                        page={page} 
                        onChange={handlePageChange}
                        variant="outlined" 
                        shape="rounded" 
                        size="small"/>
                </Paper>
            </Grid>
        </Grid>
      ),[props.status, data, page, jumpParam])
}