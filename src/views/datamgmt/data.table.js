import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import {forwardRef, useContext, useEffect, useRef, useState} from "react";
import {
    alpha,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import moment from "moment";
import {getRowText} from "../../intl/provider";
import {
    AddBox, ArrowDownward,
    Check, ChevronLeft,
    ChevronRight,
    Clear,
    Edit,
    FilterList,
    FirstPage, LastPage, Remove,
    SaveAlt, ViewColumn
} from "@mui/icons-material";
import Search from "../analysisaction/search.analysis";
import MaterialTable, { MTableToolbar } from 'material-table';
import {DataManagementContext} from "../../privacy/DataManagentContext";
import {Autocomplete, Pagination} from "@mui/lab";
import {useDataServicePostAxios, useSolrQueryAxios} from "../../service/api.service";
import {WorkspaceContext} from "../../privacy/WorkspaceContext";
import {LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import jwt_decode from "jwt-decode";
import Document from "./document";
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import Setting from "./setting";
import SettingStep2 from "./setting.step2";
import { ConfigContext } from './ConfigProvider';
import { red } from '@mui/material/colors';

const EnhancedTableToolbar = (props) => {
    const {fields, fieldConfig} = useContext(DataManagementContext);
    const { numSelected, clickDelete, clickSearch, totalFound } = props;
    const [column, setColumn] = useState('');
    const [value, setValue] = useState('');
    const [open, setOpen] = React.useState(false);
    const [step, setStep] = useState(1);
    const [returnFields, setReturnFields] = useState([]);

    const handleClose = () => {
        setOpen(false);

        setReturnFields(fieldConfig.map(item => item.id));
    };

    const handleValueChange = (event) => {
        setValue(event.target.value);
    }

    const handleSubmit = () => {
        if (!value || value === '') {
            clickSearch("*:*")
            return;
        }

        if (column === '') {
            clickSearch(value)
        } else {
            clickSearch(column + ":" + value);
        }
    }

    const handleSetting = () => {
        setOpen(true);
        setStep(1);
    }

    const handleSubmitConfig = () => {
        docViewRef.current.handleSubmit();
    }

    const handlePeriousStep = () => {
        setStep(1);
    }

    useEffect(() => {
        setReturnFields(fieldConfig.map(item => item.id));
    }, [fieldConfig]);

    const docViewRef = useRef(null);

    const config = {
        setStep,
        setReturnFields,
        returnFields
    }
    return (
        <ConfigContext.Provider value={config}>
        <React.Fragment>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >

                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%', fontSize: 14 }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        已选择[{numSelected}]条数据
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%', fontSize: 14, flexDirection:'row' }}
                        id="tableTitle"
                        component="div"
                    >
                         <div style={{display: 'flex'}}>
                             <span style={{fontWeight:'bold'}}>数据列表</span>
                             (搜索到数据：<Typography style={{fontSize: 14, color: 'red'}}>{totalFound}</Typography>)
                         </div>
                    </Typography>
                )}

                {(typeof numSelected === 'undefined' || numSelected === 0) && <div style={{display:'flex', flexDirection:'row', fontSize: 14, columnGap: 10, paddingRight: 30}}>
                    <Typography style={{padding: 5, whiteSpace: 'nowrap', fontSize: 14, margin:'auto'}}>
                        内容字段名：
                    </Typography>
                    <Autocomplete
                        disablePortal
                        size={"small"}
                        id="combo-box-demo"
                        options={fields}
                        sx={{ width: 200 }}
                        value={column}
                        onChange={(event, newInputValue) => {
                            setColumn(newInputValue);
                        }}
                        renderInput={(params) => <TextField {...params}  InputProps={{
                            ...params.InputProps,
                            type: 'search',
                            style:{fontSize: 14}
                        }}/>}
                    />

                    <Typography style={{padding: 5, whiteSpace: 'nowrap', fontSize: 14, margin:'auto'}}>
                        搜索内容:
                    </Typography>
                    <TextField
                            id="outlined-size-small"
                            size="small"
                            value={value}
                            sx={{minWidth: 200}}
                            onChange={handleValueChange}
                    />

                    <Button variant="contained" size="small" onClick={handleSubmit}>搜索</Button>

                    <Tooltip title="管理内容配置">
                        <IconButton onClick={handleSetting}>
                            <DisplaySettingsIcon sx={{ color: red[500] }} />
                        </IconButton>
                    </Tooltip>
                </div>
                }


                {numSelected > 0 &&
                <Tooltip title="删除数据">
                    <IconButton onClick={clickDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>}

            </Toolbar>
            <Dialog
                open={open}
                // onClose={handleClose}
                scroll={'paper'}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            minHeight: 350,
                            width: "100%",
                            maxWidth: "1200px",  // Set your width here
                        },
                    },
                }}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title" style={{fontSize: 14}}>数据管理配置</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        //ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        {step === 1 && <Setting ref={docViewRef} close={handleClose}/>}
                        {step === 2 && <SettingStep2 ref={docViewRef} close={handleClose}/>}
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{display:'flex', flexDirection: 'row', columnGap: 10, justifyContent:"center", padding: 10}}>
                    <Button variant={"contained"} onClick={handleClose}>取消</Button>
                    { step === 2 && <Button variant={"contained"} onClick={handlePeriousStep}>上一步</Button>}
                    <Button variant={"contained"} disabled={returnFields.length === 0} onClick={handleSubmitConfig}>{step === 1? '下一步':'保存'}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
        </ConfigContext.Provider>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteIcon {...props} ref={ref} />),
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
export default function DataTable() {
    const [{data: delDocByIdsData, loading: delDocByIdsLoading, error: delDocByIdsError}, delDocByIdsApi] = useDataServicePostAxios(
        {}, {manual: true});
    const [{data: searchDataData, loading: searchDataLoading, error: searchDataError}, searchDataApi] = useSolrQueryAxios(
        {}, {manual: true});
    const [selected, setSelected] = React.useState([]);
    const { collectionList } = useContext(WorkspaceContext);
    const {setMessage} = useContext(AppContext);
    const { fieldConfig } = useContext(DataManagementContext);
    const [page, setPage] = React.useState(1);
    const [rows, setRows] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const tableRef = React.createRef();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate ] = useState('');
    const [collection, setCollection] = useState('');
    const [query, setQuery] = useState();
    const [open, setOpen] = React.useState(false);
    const [doc, setDoc] = useState({});

    const handleClickOpen = (row) => {
        setOpen(true);
        setDoc(row);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate = () => {
        docViewRef.current.handleSubmit();
    }

    const handleAdd = () => {
        docViewRef.current.handleAddField();
    }
    const handleOpenTag = () => {
        docViewRef.current.handleManageTag();
    }

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const handleQuery = () => {
        const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
        const user = jwt_decode(auth.token);

        let myquery;
        if (query && query.trim().length > 0) {
            myquery = query;
        } else {
            myquery = "*:*";
        }

        let fieldList = ['id', '_gl_created_dt'];
        if (fieldConfig && fieldConfig.length > 0) {
            fieldList = fieldConfig.map(item => item.id);
            if (!fieldList.includes('id')) {
                fieldList.unshift('id');
            }
            if (!fieldList.includes('_gl_created_dt')) {
                fieldList.unshift('_gl_created_dt');
            }
        }

        let start = (page - 1) < 0? 0: (page - 1);

        let param = {
            "q": myquery,
            "sort": 'id desc',
            "rows": 10,
            "start": start * 10,
            "fl": fieldList.join(",")
        };

        let filterQuery;
        if (startDate && endDate) {
            filterQuery = '_gl_created_dt:[' + moment(startDate).format('YYYY-MM-DD') + 'T00:00:00Z TO ' + moment(endDate).format('YYYY-MM-DD') + 'T00:00:00Z}';

            param = {
                ...param,
                fq: filterQuery
            }
        }

        if (collection && collection.length > 0) {
            searchDataApi({
                url: '/' + user.workspace + '_' + collection + '/select',
                params: param
            });
        }
    }

    const handleFieldQuery = (query) => {
        if (query && query !== '') {
            setQuery(query);
            setPage(1);
        }
    }

    useEffect(() => {
        handleQuery();
    }, [page, query, fieldConfig])

    useEffect(() => {
        if (!searchDataLoading) {
            if (searchDataError) {
                if (searchDataError.response) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: searchDataError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (searchDataData) {
                if (searchDataData && searchDataData.responseHeader && searchDataData.responseHeader.status === 0){
                    setRows(searchDataData.response.docs);
                    setTotal(searchDataData.response.numFound);
                } else {
                    if (searchDataData.code || searchDataData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + searchDataData.code + ", 错误信息：" + searchDataData.message
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
        // eslint-disable-next-line
    }, [searchDataLoading, searchDataData, searchDataError]);

    useEffect(() => {
        if (fieldConfig && fieldConfig.length > 0) {
            setTableColumns(
                fieldConfig.map(item => {
                    return {
                        title: item.label && item.label.trim().length > 0? item.label: item.column,
                        field: item.column,
                        cellStyle: {
                            textOverflow: 'ellipsis', maxWidth: 400, whiteSpace: 'nowrap', overflow: 'hidden'
                        }
                    }
                })
            );
        } else {
            setTableColumns([
                { title: getRowText("id"), field: 'id', width:"40%"},
                {
                    title: getRowText("content"), field: 'content', width: "50%",
                    cellStyle: {
                        textOverflow: 'ellipsis', maxWidth: 400, whiteSpace: 'nowrap', overflow: 'hidden'
                    }
                },
                {
                    title: getRowText("_gl_created_dt"), field: '_gl_created_dt', width:"10%",
                    render: rowData => moment(rowData).format('YYYY-MM-DD hh:mm:ss')
                }
            ]);
        }
    }, [fieldConfig]);

    useEffect(() => {
        if (collectionList && collectionList.length > 0) {
            setCollection(collectionList[0]);
        }
    }, [collectionList]);

    useEffect(() => {
        if (collection && collection.length > 0) {
            handleQuery();
        }
    }, [collection]);

    const [tableColumns, setTableColumns] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSelectChanges = (rows) => {
        if (rows && rows.length > 0) {
            setSelected(rows);
        } else {
            setSelected([]);
        }
    }

    const handleDelete = () => {
        let idList = selected.map(item => item.id);

        if (collectionList && collectionList.length > 0) {
            delDocByIdsApi({
                url: '/document/' + collectionList[0] + "/delete/id-list",
                data: {
                    idList: idList
                }
            });
        }
    }

    useEffect(() => {
        if (!delDocByIdsLoading) {
            if (delDocByIdsError) {
                if (delDocByIdsError.response) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: delDocByIdsError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (delDocByIdsData) {
                if (delDocByIdsData.status === 0){
                 /*   setMessage({
                        type: MESSAGE_SUCCESS,
                        text: '删除数据成功'
                    });*/
                    setSelected([]);
                    handleQuery();
                } else {
                    if (delDocByIdsData.code || delDocByIdsData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + delDocByIdsData.code + ", 错误信息：" + delDocByIdsData.message
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
        // eslint-disable-next-line
    }, [delDocByIdsLoading, delDocByIdsData, delDocByIdsError]);


    const docViewRef = useRef(null);

    // Avoid a layout jump when reaching the last page with empty rows.
    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }} elevation={0}>
                <EnhancedTableToolbar numSelected={selected.length} clickDelete={handleDelete} clickSearch={handleFieldQuery} totalFound={total}/>
                <MaterialTable
                    isLoading={searchDataLoading || delDocByIdsLoading}
                    icons={tableIcons}
                    components={{
                        Toolbar: props => (
                            <div style={{ backgroundColor: '#e8eaf5', height: "40px", border: '1px solid red', fontSize: 10,
                                display: "flex",
                                alignItems: "center"}}>
                                <MTableToolbar {...props} />
                            </div>
                        ),
                        Container: props => <Paper {...props} elevation={0}/>
                    }}

                    tableRef={tableRef}
                    columns={tableColumns}
                    data={rows}
                    onRowClick={(event, rowData) => handleClickOpen(rowData)}
                    options={{
                        selection: true,
                        tableLayout: "fixed",
                        toolbar: false,
                        search: false,
                        paging: false,
                        minBodyHeight: 200,
                        rowStyle: {
                            fontSize: 14,
                        }
                    }}

                    localization={{
                        pagination: {
                            labelDisplayedRows: '{from}-{to} of {count}'
                        },
                        toolbar: {
                            nRowsSelected: '已经选择{0}行数据',
                        },
                        body: {
                            emptyDataSourceMessage: getRowText("noDataMessage"),
                            filterRow: {
                                filterTooltip: 'Filter'
                            }
                        }
                    }}
                    onSelectionChange={(rows) => handleSelectChanges(rows)}
                />

                <Paper elevation={0} style={{display:'flex', justifyContent:'center', paddingTop: 10}}>
                    <Pagination
                        count={total%10 === 0? total/10:Math.ceil(total/10)}
                        page={page}
                        onChange={handleChangePage}
                        shape="rounded"
                        color="primary"
                        size="small"/>
                </Paper>

            </Paper>

            <Dialog
                open={open}
               // onClose={handleClose}
                maxWidth={'lg'}
                fullWidth={true}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">{doc.id}</DialogTitle>
                <DialogContent dividers={true} style={{minHeight: 400}}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <Document data={doc} ref={docViewRef} close={handleClose}/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{display:'flex', flexDirection: 'row', columnGap: 10, justifyContent:"center", padding: 10}}>
                    <Button variant={"contained"} onClick={handleAdd}>增加数据</Button>
                    <Button variant={"contained"} onClick={handleClose}>取消</Button>
                    <Button variant={"contained"} onClick={handleUpdate}>保存</Button>
                    <Button variant={"contained"} onClick={handleOpenTag}>标签管理</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}