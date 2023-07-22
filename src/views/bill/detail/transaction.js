import React, {forwardRef, useContext, useEffect, useImperativeHandle, useState} from 'react';
import MaterialTable from "material-table";
import {
    AddBox, ArrowDownward,
    Check, ChevronLeft,
    ChevronRight,
    Clear,
    DeleteOutline,
    Edit,
    FilterList,
    FirstPage, LastPage, Remove,
    SaveAlt, ViewColumn, Search
} from "@mui/icons-material";
import {PaginationItem, Paper, Typography} from "@mui/material";
import {useGetDataMapApi} from "../../../service/datamap";
import {AppContext} from "../../../privacy/AppContext";
import jwt_decode from "jwt-decode";
import moment from "moment-timezone";
import {LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../../constant";
import {Pagination} from "@mui/lab";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function Transaction (props, ref) {

    useImperativeHandle(ref, () => ({
        search() {doSearch(0)}
    }), []);

    const [{data: getTransactionData, loading: getTransactionLoading, error: getTransactionError}, getTransactionApi] = useGetDataMapApi(
        {}, {manual: true});
    const {application, setMessage} = useContext(AppContext);
    const [start, setStart] = useState(0);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const [data, setData] = useState([]);
    const [curPage, setCurPage] = useState(1);
    const [totalFound, setTotalFound] = useState(0)
    const [date, setDate] = useState(new Date());
    const [rows, setRows] = useState(10);

    useEffect(() => {
        if (props && props.date) {
            setDate(props.date);
        }
    }, [props.date]);

    useEffect(() => {
        if (!getTransactionLoading) {
            if (getTransactionError) {
                if (getTransactionError.response && getTransactionError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: getTransactionError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (getTransactionData) {
                if (getTransactionData.status === 0){
                    setData(getTransactionData.result.transactionList);
                    setTotalFound(getTransactionData.result.totalFound);
                } else {
                    if (getTransactionData.code || getTransactionData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + getTransactionData.code + ", 错误信息：" + getTransactionData.message
                        });
                    } else {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "系統错误，请联系Geelink技术支持"
                        });
                    }
                }
            }
        }
    }, [getTransactionLoading, getTransactionData, getTransactionError]);

    const handlePageChange = (event, value) => {
        setCurPage(value)
        doSearch(value - 1);
    }

    const handleChangeRowsPerPage = (event) => {
        setRows(parseInt(event.target.value, 10));
        setCurPage(1);
    };

    useEffect(() => {
        doSearch(0);
    } , [rows]);

    const doSearch = (page) => {
        const user = auth && auth.token && jwt_decode(auth.token);
        const startDate = moment(date).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(date).endOf('month').format('YYYY-MM-DD');
        const start = page * rows;
        getTransactionApi({
            url: '/bill/detail/' + user.workspace + "_" + application +
                "?startDate=" + startDate +
                "&endDate=" + endDate +
                "&start=" + start +
                "&rows=" + rows +
                "&fields=clickId,ip,requestTime,type"
        });
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', rowGap: 10}}>
        <MaterialTable
            icons={tableIcons}
            isLoading={getTransactionLoading}
            components={{
                Container: props => <Paper {...props} elevation={0} variant={"outlined"}/>
            }}
            title="账单流水"
            columns={[
                { title: '产品', field: 'name', width:'10%', cellStyle:{width: '10%'},
                    render: row => <span>{'搜索服务'}</span>
                },
                { title: '用户', field: 'ip', width:'20%', cellStyle:{width: '20%'},
                render: row => <span>{row['ip'].replace(", 39.105.132.155", "")}</span>},
                { title: '消费类型', field: 'type', width:'20%', cellStyle:{width: '20%'},
                    lookup: {'search': '搜索', 'document': '访问'}
                },
                {
                    title: '时间',
                    field: 'requestTime',
                    width:'40%', cellStyle:{width: '40%'},
                    render: row => <span>{ moment.utc(row["requestTime"]).clone().tz('Asia/Shanghai').format("YYYY-MM-DD HH:mm:ss")}</span>
                }
            ]}
            data={data}

            options={{
                paging: false,
                search: false,
                tableLayout: "auto",
                rowStyle: {
                    fontSize: 14
                },
                pageSize: rows
            }}
        />
        <div style={{display:'flex', flexDirection:'row', rowGap: 10}}>
            <Pagination
                page={curPage}
                color="primary"
                boundaryCount={0}
                siblingCount={10}
                count={Math.ceil(totalFound/rows)}
                showFirstButton
                showLastButton
                onChange={handlePageChange}
                renderItem={(item) => (
                    <PaginationItem
                        style={{selected: {backgroundColor:'red'}}}
                        {...item}
                    />
                )}
            />

            <FormControl sx={{ m: 1, minWidth: 50, height: 10 }} size="small">
                <Select
                    id="demo-select-small"
                    value={rows}
                    size='small'
                    onChange={handleChangeRowsPerPage}
                >
                    <MenuItem value={10}><Typography style={{fontSize: 14}}>10</Typography></MenuItem>
                    <MenuItem value={20}><Typography style={{fontSize: 14}}>20</Typography></MenuItem>
                    <MenuItem value={50}><Typography style={{fontSize: 14}}>50</Typography></MenuItem>
                </Select>
            </FormControl>
        </div>
        </div>
    )
}

export default forwardRef(Transaction);