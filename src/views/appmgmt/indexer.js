import React, {useContext, useEffect, useState} from 'react';
import {
    Button, Divider, Grid, TextField, Typography, IconButton,TablePagination,
    FormGroup, FormControlLabel, Checkbox, FormControl, Select, MenuItem, Paper
} from "@mui/material";
import {useDataServiceGetAxios, useDataServicePostAxios, useDataServicePutAxios} from "../../service/api.service";
import {AppContext} from "../../privacy/AppContext";
import {MESSAGE_ERROR, MESSAGE_SUCCESS} from "../../constant";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from "@mui/styles";
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import SubmitButton from "../../component/submit.button";
import {WorkspaceContext} from "../../privacy/WorkspaceContext";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyIcon from '@mui/icons-material/Key';
import CheckIcon from '@mui/icons-material/Check';
import Link from '@mui/material/Link';
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const useStyles = makeStyles({
    drawer: {
        position: "absolute",
        marginLeft: "auto",
        marginRight: 20,
        marginTop: 120,
        width: 300,
        "& .MuiBackdrop-root": {
            display: "none",
        },
        "& .MuiDrawer-paper": {
            width: 300,
            height: 560,
            position: "relative",
            transition: "none !important"
        }
    }
});

export default function Indexer() {
    //const classes = useStyles();
    const [{data: deleteFieldData, loading: deleteFieldLoading, error: deleteFieldError}, deleteFieldApi] = useDataServicePutAxios(
        {}, {manual: true});
    const [{data: getFieldData, loading: getFieldLoading, error: getFieldError}, getFieldApi] = useDataServiceGetAxios(
        {}, {manual: true});
    const [{data: addFieldData, loading: addFieldLoading, error: addFieldError}, addFieldApi] = useDataServicePostAxios(
        {}, {manual: true});

    const [fields, setFields] = useState([]);
    const {application, setMessage} = useContext(AppContext);
    const {collectionList, setProcessing} = useContext(WorkspaceContext);
    const [add, setAdd] = useState(false);
    const [page, setPage] = React.useState(0);
    const [selected, setSelected] = useState([]);
    const [action, setAction] = useState('add');
    const [actionResult, setActionResult] = useState({
        "success": [],
        "fail": [],
        "status": -1,
    });

    const [field, setField] = useState({
        name: '',
        type: 'string',
        store: false,
        sort: false,
        facet: false,
        search: false,
        recommend: false,
        suggest: false
    });
    const classes = useStyles();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const toggleDrawer = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setAdd(!add);
    };

    const handleNameChange = (e) => {
        setField({
            ...field,
            [e.target.name]: e.target.type === 'checkbox'? e.target.checked: e.target.value
        })
    }

    const handleSubmit = () => {
        let isMultipleValues = field.type.endsWith("s")
        let data = {
            name: field.name,
            type: field.type,
            required: false,
            multiValue: isMultipleValues,
            facet: field.facet,
            sort: field.sort,
            scoreSearch: field.scoreSearch,
            search: field.search,
            recommend: field.recommend,
            suggest: field.suggest
        };

        addFieldApi({
            url: '/schema/' + collectionList[0] + '/field',
            data: data
        });
        setProcessing(true);
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
    }, [collectionList]);

    useEffect(() => {
        if (!getFieldLoading) {
            if (getFieldError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: "错误代码:" + getFieldError.code + ", 错误信息：" + getFieldError.message
                });
            } else if (getFieldData) {
                if(getFieldData.status === 0 && getFieldData.result && getFieldData.result.length > 0) {
                    setFields(getFieldData.result);
                }
            }
        }
    }, [getFieldLoading, getFieldData, getFieldError]);

    useEffect(() => {
        if (!addFieldLoading) {
            setProcessing(false);
            if (addFieldError) {
                if (addFieldError.response && addFieldError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "错误代码:" + addFieldError.response.data.code + ", 错误信息：" + addFieldError.response.data.message
                    });
                    setActionResult({
                        "fail": [field.name],
                        "status": 1
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (addFieldData) {
                if(addFieldData.status === 0) {
                    setMessage({
                        type: MESSAGE_SUCCESS,
                        text: "增加字段成功"
                    });
                    setActionResult({
                        "success": [field.name],
                        "status": 0
                    });
                    getFieldApi({
                        url: '/schema/' + collectionList[0] + '/field'
                    });
                    setAdd(!add);
                }
            }
        }
    }, [addFieldLoading, addFieldData, addFieldError]);

    useEffect(() => {
        if (!deleteFieldLoading) {
            setProcessing(false);
            if (deleteFieldError) {
                if (deleteFieldError.response && deleteFieldError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "错误代码:" + deleteFieldError.response.data.code + ", 错误信息：" + deleteFieldError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (deleteFieldData) {
                if(deleteFieldData.status === 0) {
                    setMessage({
                        type: MESSAGE_SUCCESS,
                        text: "删除字段成功"
                    });
                    setFields(deleteFieldData.result.fields);
                    setActionResult({
                        "success": deleteFieldData.result.success,
                        "fail": deleteFieldData.result.fail,                        
                        "status": 0
                    });
                }
            }
        }
    }, [deleteFieldLoading, deleteFieldData, deleteFieldError]);

    const handleClick = (event, row) => {
        setField(
            {
                name: row.name,
                type: row.type,
                store: row.store,
                sort: row.sort,
                facet: row.facet,
                search: row.search,
                recommend: row.recommend,
                suggest: row.suggest
            }
        );
        if (!add) {
            setAdd(true);
        }
        setAction('view');
    };

    const handleAddClick = (event) => {
        setField({
            name: '',
            type: 'text',
            store: false,
            sort: false,
            facet: false,
            search: false,
            recommend: false,
            suggest: false
        });
        
        if(!add) {
            setAdd(true);
        }
        
        setAction('add');
    }

    const handleDeleteClick = (name) => {
        if (selected.includes(name)) {
            setSelected(selected.filter(a => {return a !== name}));
        } else {
            setSelected([...selected, name]);
        }
    }

    const handleDeleteAction = () => {
        if (selected.length === 0) {
            setMessage('请选择要删除的字段');
            return;
        }

        deleteFieldApi({
            url: '/schema/field/' + collectionList[0],
            data: selected
        });
        setProcessing(true);
    }

    const getDataType = (type) => {
        if (type === '' || !type) {
            return "未定义类型"
        }

        if (type === 'text') return '字符串';
        if (type === 'integer') return '整型数字';
        if (type === 'float') return '小数数字';
        if (type === 'date') return '日期';
        if (type === 'geography') return '地理位置';
        if (type === 'boolean') return '布尔类型';

        if (type === 'texts') return '字符串（多值）';
        if (type === 'integers') return '整型数字（多值）';
        if (type === 'floats') return '小数数字（多值）';
        if (type === 'dates') return '日期（多值）';
        if (type === 'geographys') return '地理位置（多值）';
        if (type === 'booleans') return '布尔类型（多值）';

        return "未定义类型"
    }

    return (
        <div>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography className={classes.title}>字段管理</Typography>
                    <Divider/>
                </Grid>
                <Grid item xs={12} container direction={"row"} spacing={2}>
                    <Grid item>
                        <Button startIcon={<AddIcon />} onClick={handleAddClick} size={"small"}>
                            增加字段
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button disabled={selected.length === 0} onClick={handleDeleteAction} startIcon={<DeleteIcon />} size={"small"}>
                            删除字段
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper} style={{width: '75%'}}>
                        <Table sx={{ minWidth: 650 }} size='small' aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                <TableCell style={{borderRight: '1px solid #ebebeb'}}></TableCell>
                                    <TableCell style={{borderRight: '1px solid #ebebeb'}}>名称</TableCell>
                                    <TableCell align="center" style={{borderRight: '1px solid #ebebeb'}}>类型</TableCell>
                                    <TableCell align="center" style={{borderRight: '1px solid #ebebeb'}}>是否保存</TableCell>
                                    <TableCell align="center" style={{borderRight: '1px solid #ebebeb'}}>排序</TableCell>
                                    <TableCell align="center" style={{borderRight: '1px solid #ebebeb'}}>分类</TableCell>
                                    <TableCell align="center" style={{borderRight: '1px solid #ebebeb'}}>搜索</TableCell>
                                    <TableCell align="center" style={{borderRight: '1px solid #ebebeb'}}>推荐</TableCell>
                                    <TableCell align="center">搜索提示</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    key='id'
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align='center' style={{width: 10}}>
                                        <KeyIcon fontSize={"small"}></KeyIcon>
                                    </TableCell>
                                    <TableCell align='left'>
                                        id
                                    </TableCell>
                                    <TableCell align="left">字符串</TableCell>
                                    <TableCell align="center"><CheckIcon color="primary" fontSize='small'/></TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                                {fields.map((row) => (
                                    <TableRow
                                        hover
                                        key={row.name}
                                    >
                                        <TableCell align="center">
                                            <Checkbox size='small' onClick={() => handleDeleteClick(row.name)}/>
                                        </TableCell>
                                        <TableCell align="left" 
                                        onClick={(event) => handleClick(event, row)}
                                        >
                                           <Link href="#" underline="hover"> {row.name}</Link>
                                        </TableCell>
                                        <TableCell align="left">{getDataType(row.type)}</TableCell>
                                        <TableCell align="center">{row.store? <CheckIcon color="primary" fontSize='small'/>:<CloseIcon color="disabled" fontSize='small'/>}</TableCell>
                                        <TableCell align="center">{row.sort? <CheckIcon color="primary" fontSize='small'/>:<CloseIcon color="disabled" fontSize='small'/>}</TableCell>
                                        <TableCell align="center">{row.facet? <CheckIcon color="primary" fontSize='small'/>:<CloseIcon color="disabled" fontSize='small'/>}</TableCell>
                                        <TableCell align="center">{row.search? <CheckIcon color="primary" fontSize='small'/>:<CloseIcon color="disabled" fontSize='small'/>}</TableCell>
                                        <TableCell align="center">{row.recommend? <CheckIcon color="primary" fontSize='small'/>:<CloseIcon color="disabled" fontSize='small'/>}</TableCell>
                                        <TableCell align="center">{row.suggest? <CheckIcon color="primary" fontSize='small'/>:<CloseIcon color="disabled" fontSize='small'/>}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={20}
                        style={{width: '75%'}}
                        component="div"
                        count={fields.length}
                        rowsPerPage={20}
                        page={page}
                        onPageChange={handleChangePage}
                    />
                </Grid>
                
                <Grid item>
                    {(actionResult.status === 0 || actionResult.status === 1) && <Grid container direction="column">
                            <Grid item>
                                执行结果
                            </Grid>
                            <Grid item>
                                {actionResult.success && actionResult.success.length > 0 &&
                                    <div key='success' style={{display:'flex', fontSize: 14, flexDirection: 'row', spacing: 5}}>成功{action === 'add'? '新增':'删除'}字段:{actionResult.success.map(item => {return <div key={item} style={{color: 'green', marginLeft: 10}}>{item}</div>})}</div>
                                }
                            </Grid>    
                            <Grid item>
                                {actionResult.fail && actionResult.fail.length > 0 &&
                                    <div key='fail' style={{display:'flex', fontSize: 14, flexDirection: 'row', spacing: 5}}>失败{action === 'add'? '新增':'删除'}字段:{actionResult.fail.map(item => {return <div key={item} style={{color: 'red', marginLeft: 10}}>{item}</div>})}</div>
                                }
                            </Grid>    
                        </Grid>}
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
                        <span>{action === 'add'? '新增字段':'查看字段'}</span> <IconButton aria-label="delete" size="small" onClick={toggleDrawer}><CloseIcon fontSize={"small"}/></IconButton>
                    </Grid>
                    <Grid item>
                        字段名称
                    </Grid>
                    <Grid item>
                        <TextField
                            id="filled-size-small"
                            name='name'
                            value={field.name}
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
                                name='type'
                                value={field.type}
                                onChange={handleNameChange}
                                style={{ height: 30 }}
                            >
                                <MenuItem key={1} value='text'>{<Typography style={{fontSize: 14}}>字符串</Typography>}</MenuItem>
                                <MenuItem key={2} value='integer'>{<Typography style={{fontSize: 14}}>整型数字</Typography>}</MenuItem>
                                <MenuItem key={3} value='float'>{<Typography style={{fontSize: 14}}>小数数字</Typography>}</MenuItem>
                                <MenuItem key={4} value='date'>{<Typography style={{fontSize: 14}}>日期</Typography>}</MenuItem>
                                <MenuItem key={5} value='geography'>{<Typography style={{fontSize: 14}}>地理位置</Typography>}</MenuItem>
                                <MenuItem key={6} value='boolean'>{<Typography style={{fontSize: 14}}>布尔类型</Typography>}</MenuItem>

                                <MenuItem key={1} value='texts'>{<Typography style={{fontSize: 14}}>字符串（多值）</Typography>}</MenuItem>
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
                            <FormControlLabel control={<Checkbox name='store' checked={field.store} size="small" onChange={handleNameChange}/>} label={<Typography style={{fontSize: 14}}>保存读取</Typography>}/>
                            <FormControlLabel control={<Checkbox name='filter' checked={field.filter} size="small" onChange={handleNameChange}/>} label={<Typography style={{fontSize: 14}}>过滤</Typography>}/>
                            <FormControlLabel control={<Checkbox name='sort' checked={field.sort} size="small" onChange={handleNameChange}/>} label={<Typography style={{fontSize: 14}}>排序</Typography>}/>
                            <FormControlLabel control={<Checkbox name='facet' checked={field.facet} size="small" onChange={handleNameChange}/>} label={<Typography style={{fontSize: 14}}>分类</Typography>}/>
                            <FormControlLabel control={<Checkbox name='search' checked={field.search} size="small" onChange={handleNameChange}/>} label={<Typography style={{fontSize: 14}}>搜索</Typography>}/>
                            <FormControlLabel control={<Checkbox name='recommend' checked={field.recommend} size="small" onChange={handleNameChange}/>} label={<Typography style={{fontSize: 14}}>推荐</Typography>}/>
                            <FormControlLabel control={<Checkbox name='suggest' checked={field.suggest} size="small" onChange={handleNameChange}/>} label={<Typography style={{fontSize: 14}}>搜索提示</Typography>}/>
                        </FormGroup>
                    </Grid>
                </Grid>
                <Grid item style={{display: 'flex', justifyContent: 'flex-start'}}>
                    <SubmitButton  handleButtonClick={handleSubmit} disabled={action !== 'add'}
                                  size="small"
                                  className={classes.submit}>保存</SubmitButton>
                    <Button variant="outlined" size="small" style={{height: 30, marginTop: 9}} onClick={toggleDrawer}
                         >
                        取消
                    </Button>
                </Grid>

            </Drawer>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={getFieldLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
            )
}