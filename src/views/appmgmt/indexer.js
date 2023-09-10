import React, {useContext, useEffect, useState} from 'react';
import {
    Button, Divider, Grid, TextField, Typography, IconButton,
    FormGroup, FormControlLabel, Checkbox, FormControl, Select, MenuItem, Paper
} from "@mui/material";
import {useDataServiceGetAxios, useDataServicePostAxios, useSearchEngineGetAxios} from "../../service/api.service";
import {AppContext} from "../../privacy/AppContext";
import {MESSAGE_ERROR} from "../../constant";
import {getRowText} from "../../intl/provider";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from "@mui/styles";
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import SubmitButton from "../../component/submit.button";
import {WorkspaceContext} from "../../privacy/WorkspaceContext";
import tableIcons from "../../component/material.table.icon";
import MaterialTable from "material-table";

const useStyles = makeStyles({
    drawer: {
        position: "relative",
        marginLeft: "auto",
        marginRight: 20,
        width: 300,
        "& .MuiBackdrop-root": {
            display: "none",
        },
        "& .MuiDrawer-paper": {
            width: 300,
            marginTop: -80,
            position: "relative",
            transition: "none !important"
        }
    }
});

export default function Indexer() {
    //const classes = useStyles();
  /*  const [{data: getAllFieldsData, loading: getAllFieldsLoading, error: getAllFieldsError}, getAllFieldsApi] = useSearchEngineGetAxios(
        {}, {manual: true});*/
    const [{data: getFieldData, loading: getFieldLoading, error: getFieldError}, getFieldApi] = useDataServiceGetAxios(
        {}, {manual: true});
    const [fields, setFields] = useState([{name: 'id', type: 'string'}]);
    const {application, setMessage} = useContext(AppContext);
    const { collectionList } = useContext(WorkspaceContext);
    const [add, setAdd] = useState(false);
    const [field, setField] = useState({
        name: '',
        type: 'string',
        props: []
    });
    const classes = useStyles();
    const toggleDrawer = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setAdd(!add);
    };

    const handleNameChange = (e) => {
        field.name = e.target.value;
    }

    const handleTypeChange = (e) => {
        field.type = e.target.value;
    }

    const handlePropsChange = (e) => {
        let selected = e.target.checked;
        let value = e.target.value;

        if (selected) {
            if (field.props.includes(value)) {
                console.warn("value is existing, ignore it");
            } else {
                field.props.push(value);
            }

            setField(Object.assign({}, field));

            return;
        }

        if (!selected) {
            if (field.props.includes(value)) {
                field.props.splice(field.props.indexOf(value), 1)
            } else {
                console.warn("value doesn't exist, ignore it");
            }


            setField(Object.assign({}, field));
        }
    }


    const handleSubmit = () => {
        let newFields = Object.assign({}, fields);
        newFields.push(field);
        setFields(Object.assign({}, newFields));
        alert(JSON.stringify(fields));
    }

    useEffect(() => {
        console.log('aaaa');

        if (collectionList && collectionList.length > 0) {
            if (collectionList.length === 1) {
                getFieldApi({
                    url: '/schema/' + collectionList[0] + '/field'
                });
            }
        }
    }, [application]);

    useEffect(() => {
        if (!getFieldLoading) {
            if (getFieldError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUserMonthCountError")
                });
            } else if (getFieldData) {
                if(getFieldData.status === 0 && getFieldData.result && getFieldData.result.length > 0) {
                    fields.push(getFieldData.result);
                    setFields(Object.assign({}, fields));
                }
            }
        }
    }, [getFieldLoading, getFieldData, getFieldError]);

    return (
        <div>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography className={classes.title}>字段管理</Typography>
                    <Divider/>
                </Grid>
                <Grid item xs={12} container direction={"row"} spacing={2}>
                    <Grid item>
                        <Button startIcon={<AddIcon />} onClick={toggleDrawer} size={"small"}>
                            增加字段
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button startIcon={<DeleteIcon />} size={"small"}>
                            删除字段
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <div style={{width: '78%'}}>
                    <MaterialTable
                        icons={tableIcons}
                        isLoading={getFieldLoading}
                        components={{
                            Container: props => <Paper {...props} elevation={0} variant={"outlined"}/>
                        }}
                        title="账单流水"
                        columns={[
                            {
                                title: '字段名称',
                                field: 'name',
                                cellStyle: {
                                    textAlign: 'center'
                                },
                                headerStyle: {
                                    borderRight: '1px solid #ebebeb',
                                    textAlign: 'center'
                                }
                            },
                            {
                                title: '字段类型',
                                field: 'type',
                                cellStyle: {
                                    textAlign: 'center'
                                },
                                headerStyle: {
                                    borderRight: '1px solid #ebebeb',
                                    textAlign: 'center'
                                }
                            },
                            {
                                title: '可读取',
                                field: 'amount',
                                cellStyle: {
                                    textAlign: 'center'
                                },
                                headerStyle: {
                                    borderRight: '1px solid #ebebeb',
                                    textAlign: 'center'
                                }
                            },
                            {
                                title: '过滤',
                                field: 'status',
                                cellStyle: {
                                    textAlign: 'center'
                                },
                                headerStyle: {
                                    borderRight: '1px solid #ebebeb',
                                    textAlign: 'center'
                                }
                            },
                            {
                                title: '排序',
                                field: 'lastUpdateDate',
                                cellStyle: {
                                    textAlign: 'center'
                                },
                                headerStyle: {
                                    borderRight: '1px solid #ebebeb',
                                    textAlign: 'center'
                                }
                            },
                            {
                                title: '分类',
                                field: 'lastUpdateDate',
                                cellStyle: {
                                    textAlign: 'center'
                                },
                                headerStyle: {
                                    borderRight: '1px solid #ebebeb',
                                    textAlign: 'center'
                                }
                            },
                            {
                                title: '搜索',
                                field: 'lastUpdateDate',
                                cellStyle: {
                                    textAlign: 'center'
                                },
                                headerStyle: {
                                    borderRight: '1px solid #ebebeb',
                                    textAlign: 'center'
                                }
                            },
                            {
                                title: '推荐',
                                field: 'lastUpdateDate',
                                cellStyle: {
                                    textAlign: 'center'
                                },
                                headerStyle: {
                                    borderRight: '1px solid #ebebeb',
                                    textAlign: 'center'
                                }
                            },
                            {
                                title: '提示',
                                field: 'lastUpdateDate',
                                cellStyle: {
                                    textAlign: 'center'
                                },
                                headerStyle: {
                                    borderRight: '1px solid #ebebeb',
                                    textAlign: 'center'
                                }
                            }
                        ]}
                        data={fields}

                        options={{
                            headerStyle: {
                                backgroundColor:'#F5F5F5'
                            },
                            showTitle: false,
                            toolbar: false,
                            paging: false,
                            search: false,
                            padding:'dense',
                            tableLayout: "auto",
                            rowStyle: rowData => ({
                                fontSize: 14,
                                backgroundColor: ('credit' === rowData.billType) ? '#fff9e5' : '#FFFFFF'
                            }),
                            pageSize: 1000,
                            body: {
                                emptyDataSourceMessage: '该日期没有统计数据',
                            }
                        }}
                    />
                    </div>
                </Grid>
            </Grid>
            <Drawer
                anchor="right"
                open={add}
                className={classes.drawer}
                variant="temporary"
                onClose={toggleDrawer}
            >
                <Grid container direction={"column"} spacing={1} style={{padding: 10, fontSize: 14}}>
                    <Grid item style={{display:'flex', justifyContent: 'space-between', borderBottom:'1px solid #ebebeb'}}>
                        <span>新增字段</span> <IconButton aria-label="delete" size="small" onClick={toggleDrawer}><CloseIcon fontSize={"small"}/></IconButton>
                    </Grid>
                    <Grid item>
                        字段名称
                    </Grid>
                    <Grid item>
                        <TextField
                            id="filled-size-small"
                            defaultValue={field.name}
                            onChange={handleNameChange}
                            style={{marginRight: 2, maxWidth: '100%', minWidth: 100}}
                            InputProps={{ style: {fontSize: 14}}}
                            size="small"
                        />
                    </Grid>
                    <Grid item>
                        字段类型
                    </Grid>
                    <Grid item>
                        <FormControl sx={{ m: 1, minWidth: 190 }} size="small">
                            <Select
                                size={"small"}
                                id="demo-select-small"
                                defaultValue={field.type}
                                onChange={handleTypeChange}
                                style={{ height: 30 }}
                            >
                                <MenuItem key={1} value='string'>{<Typography style={{fontSize: 14}}>字符串</Typography>}</MenuItem>
                                <MenuItem key={2} value='integer'>{<Typography style={{fontSize: 14}}>整型数字</Typography>}</MenuItem>
                                <MenuItem key={3} value='float'>{<Typography style={{fontSize: 14}}>小数数字</Typography>}</MenuItem>
                                <MenuItem key={4} value='date'>{<Typography style={{fontSize: 14}}>日期</Typography>}</MenuItem>
                                <MenuItem key={5} value='geography'>{<Typography style={{fontSize: 14}}>地理位置</Typography>}</MenuItem>
                                <MenuItem key={6} value='boolean'>{<Typography style={{fontSize: 14}}>布尔类型</Typography>}</MenuItem>

                                <MenuItem key={1} value='strings'>{<Typography style={{fontSize: 14}}>字符串（多值）</Typography>}</MenuItem>
                                <MenuItem key={2} value='integers'>{<Typography style={{fontSize: 14}}>整型数字（多值）</Typography>}</MenuItem>
                                <MenuItem key={3} value='floats'>{<Typography style={{fontSize: 14}}>小数数字（多值）</Typography>}</MenuItem>
                                <MenuItem key={4} value='dates'>{<Typography style={{fontSize: 14}}>日期（多值）</Typography>}</MenuItem>
                                <MenuItem key={5} value='geographys'>{<Typography style={{fontSize: 14}}>地理位置（多值）</Typography>}</MenuItem>
                                <MenuItem key={6} value='booleans'>{<Typography style={{fontSize: 14}}>布尔类型（多值）</Typography>}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        配置参数
                    </Grid>
                    <Grid item>
                        <FormGroup>
                            <FormControlLabel value='save' control={<Checkbox value='save' size="small" onChange={handlePropsChange}/>} label={<Typography style={{fontSize: 14}}>保存读取</Typography>}/>
                            <FormControlLabel value='filter' control={<Checkbox value='filter' size="small" onChange={handlePropsChange}/>} label={<Typography style={{fontSize: 14}}>过滤</Typography>}/>
                            <FormControlLabel value='sort' control={<Checkbox value='sort' size="small" onChange={handlePropsChange}/>} label={<Typography style={{fontSize: 14}}>排序</Typography>}/>
                            <FormControlLabel value='facet' control={<Checkbox value='facet' size="small" onChange={handlePropsChange}/>} label={<Typography style={{fontSize: 14}}>分类</Typography>}/>
                            <FormControlLabel value='search' control={<Checkbox value='search' size="small" onChange={handlePropsChange}/>} label={<Typography style={{fontSize: 14}}>搜索</Typography>}/>
                            <FormControlLabel value='recommend' control={<Checkbox value='recommend' size="small" onChange={handlePropsChange}/>} label={<Typography style={{fontSize: 14}}>推荐</Typography>}/>
                            <FormControlLabel value='suggest' control={<Checkbox value='suggest' size="small" onChange={handlePropsChange}/>} label={<Typography style={{fontSize: 14}}>搜索提示</Typography>}/>
                        </FormGroup>
                    </Grid>
                </Grid>
                <Grid item style={{display: 'flex', justifyContent: 'flex-start'}}>
                    <SubmitButton  handleButtonClick={handleSubmit}
                                  size="small"
                                  className={classes.submit}>保存</SubmitButton>
                    <Button variant="outlined" size="small" style={{height: 30, marginTop: 9}} onClick={toggleDrawer}
                         >
                        取消
                    </Button>
                </Grid>

            </Drawer>
        </div>
            )
}