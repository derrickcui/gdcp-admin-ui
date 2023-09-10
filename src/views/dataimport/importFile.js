import React, {useContext, useEffect, useState} from 'react';
import {
    Grid,
    Typography,
    Divider,
    InputLabel,
    MenuItem,
    Select, ListItem, List,
    FormControlLabel,
    RadioGroup,
    ListItemText,
    Radio, Checkbox,
    FormControl, Paper, TextField
} from '@mui/material';
import {useDataServiceGetAxios, useDataServicePostAxios} from "../../service/api.service";
import {WorkspaceContext} from "../../privacy/WorkspaceContext";
import isURI from "@stdlib/assert-is-uri";
import {MESSAGE_ERROR, MESSAGE_SUCCESS} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import { styled } from '@mui/material/styles';
import useStyles from './index.css';
import SubmitButton from "../../component/submit.button";
import Document from './document';
import Helper from "./helper";
import './styles.css';
import 'font-awesome/css/font-awesome.min.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function ImportFile() {
    const {message, setMessage} = useContext(AppContext);
    const { pipelineList, collectionList } = useContext(WorkspaceContext);

    const [{data: indexFileData, loading: indexFileLoading, error: indexFileError}, indexFile] = useDataServicePostAxios(
        {}, {manual: true});
    const [{data: indexByConnectorData, loading: indexByConnectorLoading, error: indexByConnectorError}, indexByConnector] = useDataServicePostAxios(
        {}, {manual: true});

    const [{data: previewFileData, loading: previewFileLoading, error: previewFileError}, previewFileApi] = useDataServicePostAxios(
        {}, {manual: true});

    const [{data: previewUriData, loading: previewUriLoading, error: previewUriError}, previewUriApi] = useDataServicePostAxios(
        {}, {manual: true});

    const [{data: listFileData, loading: listFileLoading, error: listFileError}, listFileApi] = useDataServiceGetAxios(
        {}, {manual: true});
    const [{data: listFolderData, loading: listFolderLoading, error: listFolderError}, listFolderApi] = useDataServiceGetAxios(
        {}, {manual: true});

    const [selectedPipeline, setSelectedPipeline] = useState("none");
    const [selectedDate, handleDateChange] = useState(new Date());
    const [selectedFile, setSelectedFile] = useState();
    const [indexType, setIndexType] = useState("local");
    const [execType, setExecType] = useState("sync");
    const [uri, setUri] = useState('');
    const [error, setError] = useState();
    const [collection, setCollection] = useState('');
    const [previewDocs, setPreviewDocs] = useState([]);
    const [remoteFileList, setRemoteFileList] = useState([]);

    const [indexFileList, setIndexFileList] = React.useState([]);

    const handleUriChange = (e) => {
        let fileUri = e.target.value;
        if ( fileUri && isURI(fileUri) ) {
            setUri(fileUri);
            setError("");
        } else {
            setError("URI地址错误");
        }
    }

    const classes = useStyles();

    useEffect(() => {
        if (collectionList && collectionList.length > 0) {
            setCollection(collectionList[0]);
        }
    }, [ collectionList ]);

    const handleIndexTypeChange = (e) => {
        setMessage({
            type: 'init',
            text: ""
        });
        setError('');
        setIndexFileList([]);
        setUri('');
        setIndexType(e.target.value);
        if ( e.target.value === 'uri' ) {
            setSelectedFile(null);
        } else if ( e.target.value === 'local' ) {
            setExecType("sync");
            setUri('');
        } else if (e.target.value === 'remoteFile') {
            listFileApi({
                url: '/apps/file'
            });
            setRemoteFileList([]);
        } else if (e.target.value === 'remoteFolder') {
            listFolderApi({
                url: '/apps/folder'
            });
        }
        setSelectedFile(null);
    }


    const handleRemoteChange = (event) => {
        const {
            target: { value },
        } = event;
        setIndexFileList(
            // On autofill we get a string field value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleSubmit = () => {
        if ( indexType === "local" || indexType === "database") {
            const fileData = new FormData()
            fileData.append('file', selectedFile);

            indexFile({
                url: 'index/upload-file/' + collection,
                data: fileData,
                params: {
                    collection: collection,
                    indexPipelineAlias: selectedPipeline,
                    persist: true
                }
            });

            return;
        }

        // else
        let payload;
        if ( indexType === "bdf" ) {
            const fileData = new FormData()
            fileData.append('file', selectedFile);

            indexFile({
                url: 'index/bdf/file/' + collection,
                data: fileData,
                params: {
                    indexPipelineAlias: selectedPipeline,
                    uri: ''
                }
            });

            return;
        }

        let iType = '';
        if (indexType === 'remoteFile') {
            if (indexFileList.length === 0) {
                setError("请选择索引文件");
                return;
            }
            payload = indexFileList.map((item) => {return {id: "", file: item}});
            iType = 'file';
        } else if ( indexType === 'uri' ) {
            if (!uri || uri.length === 0 || uri === '') {
                setError("请填写URI");
                return;
            }

            payload = [{
                id: "",
                uri: uri
            }];

            iType = 'uri';
        }

        let isAsync = (execType === "async");

        let startTime = null;
        if ( isAsync ) {
            startTime =  selectedDate.getFullYear() + "-" +
                ("00" + (selectedDate.getMonth() + 1)).slice(-2) + "-" +
                ("00" + selectedDate.getDate()).slice(-2) + " " +
                ("00" + selectedDate.getHours()).slice(-2) + ":" +
                ("00" + selectedDate.getMinutes()).slice(-2) + ":" +
                ("00" + selectedDate.getSeconds()).slice(-2);
        }

        payload = {
            async: isAsync,
            parameter: {
                batchSize: 100,
                indexPipelineAlias: selectedPipeline,
                scheduled: isAsync,
                startTime: startTime,
                thread: 1
            },
            payload: payload,
            type: iType
        }

        indexByConnector({
            url: '/index/connector/' + collection,
            data: payload
        });
    }

    const handleUploadFile = (event) => {
        setSelectedFile(event.target.files[0]);
    }


    useEffect(() => {
        if (!indexFileLoading) {
            if (indexFileError) {
                if (indexFileError.response && indexFileError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: indexFileError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (indexFileData) {
                if (indexFileData.status === 0){
                    setMessage({
                        type: MESSAGE_SUCCESS,
                        text: "数据索引成功：" + JSON.stringify(indexFileData.result)
                    });
                } else {
                    if (indexFileData.code || indexFileData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + indexFileData.code + ", 错误信息：" + indexFileData.message
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
    }, [indexFileLoading, indexFileData, indexFileError]);

    const  handlePreview = () => {

        if ( indexType === "local" ) {
            const fileData = new FormData()
            fileData.append('file', selectedFile);

            previewFileApi({
                url: '/index/preview/upload-file/' + collection,
                data: fileData,
                params: {
                    indexPipelineAlias: selectedPipeline === 'none' ? '' : selectedPipeline
                }
            });

            return;
        }

        let payload;
        if ( indexType === 'uri' ) {
            payload = [{
                id: "",
                uri: uri
            }];
        }

        payload = {
            async: false,
            parameter: {
                batchSize: 100,
                indexPipelineAlias: selectedPipeline,
                scheduled: false,
                startTime: null,
                thread: 1
            },
            payload: payload,
            type: 'uri'
        }

        previewUriApi({
            url: '/index/preview/connector/' + collection,
            data: payload
        });
    }


    useEffect(() => {
        if (!previewFileLoading) {
            if (previewFileError) {
                if (previewFileError.response && previewFileError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: previewFileError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (previewFileData) {
                if (previewFileData.status === 0){
                    setPreviewDocs(previewFileData.result);
                } else {
                    if (previewFileData.code || previewFileData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + previewFileData.code + ", 错误信息：" + previewFileData.message
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
    }, [previewFileLoading, previewFileData, previewFileError]);

    useEffect(() => {
        if (!previewUriLoading) {
            if (previewUriError) {
                if (previewUriError.response && previewUriError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: previewUriError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (previewUriData) {
                if (previewUriData.status === 0){
                    setPreviewDocs(previewUriData.result);
                } else {
                    if (previewUriData.code || previewUriData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + previewUriData.code + ", 错误信息：" + previewUriData.message
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
    }, [previewUriLoading, previewUriData, previewUriError]);


    useEffect(() => {
        if (!indexByConnectorLoading) {
            if (indexByConnectorError) {
                if (indexByConnectorError.response && indexByConnectorError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: indexByConnectorError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (indexByConnectorData) {
                if (indexByConnectorData.status === 0){
                    setMessage({
                        type: MESSAGE_SUCCESS,
                        text: "数据索引成功：" + JSON.stringify(indexByConnectorData.result)
                    });
                } else {
                    if (indexByConnectorData.code || indexByConnectorData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + indexByConnectorData.code + ", 错误信息：" + indexByConnectorData.message
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
    }, [indexByConnectorLoading, indexByConnectorData, indexByConnectorError]);


    useEffect(() => {
        if (!listFileLoading) {
            if (listFileError) {
                if (listFileError.response && listFileError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: listFileError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (listFileData) {
                if (listFileData.status === 0){
                    setRemoteFileList(listFileData.result);
                } else {
                    if (listFileData.code || listFileData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + listFileData.code + ", 错误信息：" + listFileData.message
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
    }, [listFileLoading, listFileData, listFileError]);


    const handlePiplineChange = (e) => {
        setSelectedPipeline(e.target.value);
    }
    return(
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography className={classes.title}>文件导入</Typography>
                <Divider/>
            </Grid>
            <Grid item container spacing={1} xs={12} md={8}>
                <Grid item xs={12} container spacing={1} className={classes.root}>
                    <Grid item xs={3} md={2} style={{paddingTop: 20}}>
                        <InputLabel id="field"><Typography style={{fontSize: 14, color: 'black'}}>数据处理管道列表</Typography></InputLabel>
                    </Grid>
                    <Grid item xs={9} md={10}>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                                id="pipeline"
                                style={{fontSize: 14, width: 300}}
                                value={selectedPipeline}
                                onChange={handlePiplineChange}
                                size={"small"}
                            >
                                {
                                    pipelineList && pipelineList.length > 0 && pipelineList.map((item, index) => {
                                        return <MenuItem key={index} value={item.key}  style={{fontSize: 12}}>{item.value}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item xs={3} md={2} style={{paddingTop: 15}}>
                        <InputLabel id="field"><Typography style={{fontSize: 14, color: 'black'}}>数据导入方式</Typography></InputLabel>
                    </Grid>
                    <Grid item xs={9} md={10} container>
                        <Grid item xs={12}>
                            <RadioGroup row aria-label="indexType" name="indexType"value={indexType} onChange={handleIndexTypeChange}>
                                <FormControlLabel
                                    value="local"
                                    control={<Radio color="primary" size="small"/>}
                                    label={<Typography style={{fontSize: 14, color: 'black'}}>本地文件</Typography>}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="uri"
                                    control={<Radio color="primary" size="small"/>}
                                    label={<Typography style={{fontSize: 14, color: 'black'}}>URI</Typography>}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="bdf"
                                    control={<Radio color="primary" size="small"/>}
                                    label={<Typography style={{fontSize: 14, color: 'black'}}>URI批量导入</Typography>}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="database"
                                    control={<Radio color="primary" size="small"/>}
                                    label={<Typography style={{fontSize: 14, color: 'black'}}>表格文件(excel,csv)</Typography>}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="remoteFile"
                                    control={<Radio color="primary" size="small"/>}
                                    label={<Typography style={{fontSize: 14, color: 'black'}}>远程文件</Typography>}
                                    labelPlacement="end"
                                />
                               {/* <FormControlLabel
                                    value="remoteFolder"
                                    control={<Radio color="primary" size="small"/>}
                                    label={<Typography style={{fontSize: 14, color: 'black'}}>远程目录</Typography>}
                                    labelPlacement="end"
                                />*/}
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12}>
                            {
                                (indexType === "local" || indexType === 'bdf') &&
                                <div style={styles}>
                                    <label className="custom-file-upload">
                                        <input type="file" onChange={handleUploadFile} accept={indexType === 'bdf'? '.json': "*"} />
                                        <i className="fa fa-cloud-upload" /> 上传文件
                                    </label>
                                    <div className="file-preview">{selectedFile && selectedFile.name}</div>
                                </div>
                            }
                            {
                                (indexType === "database") &&
                                <div style={styles}>
                                    <label className="custom-file-upload">
                                        <input type="file" onChange={handleUploadFile} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                                        <i className="fa fa-cloud-upload" /> 上传文件
                                    </label>
                                    <div className="file-preview">{selectedFile && selectedFile.name}</div>
                                </div>
                            }
                            {
                                indexType === "uri" &&
                                <TextField
                                    fullWidth
                                    size={"small"}
                                    id="uri"
                                    value={uri}
                                    variant="standard"
                                    onChange={handleUriChange}
                                />
                            }
                            {
                                indexType === 'remoteFile' && <div><div style={{display:'flex', flexDirection: 'row', alignItems:'center'}}>
                                    <FormControl sx={{ m: 1, width: 300 }} size="small">
                                        <Select
                                            disabled={listFileLoading}
                                            multiple
                                            value={indexFileList}
                                            onChange={handleRemoteChange}
                                            renderValue={(selected) => '导入文件: ' + selected.length}
                                            MenuProps={MenuProps}
                                        >
                                            {remoteFileList.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    <Checkbox checked={indexFileList.indexOf(name) > -1} size='small'/>
                                                    <ListItemText primary={name}/>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {listFileLoading && <span style={{color:'red', fontSize: 14}}>正在从服务器读取文件列表，请稍等...</span>}
                                </div>

                                    {
                                        indexFileList && indexFileList.length > 0 &&  <List
                                        sx={{
                                            border: '1px solid #EDEDED',
                                            width: '100%',
                                            minHeight: 100,
                                            maxWidth: 360,
                                            bgcolor: 'background.paper',
                                            position: 'relative',
                                            overflow: 'auto',
                                            maxHeight: 200,
                                            '& ul': { padding: 0 },
                                        }}
                                        subheader={<li />}
                                    > <li>
                                                <ul>
                                                    {indexFileList.map((item, index) => (
                                                        <ListItem key={index} disablePadding={true}>
                                                            <ListItemText primary={item}/>
                                                        </ListItem>
                                                    ))}
                                                </ul>
                                            </li>
                                    </List>
                                    }
                                </div>

                            }
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Item elevation={0} style={{display: 'flex', flexDirection: 'rows', columnGap: 10, justifyContent: 'center'}}>
                            <SubmitButton loading={previewFileLoading} handleButtonClick={handlePreview} size="small" sx={{width: 100}}
                                          className={classes.submit} disabled={indexType === 'bdf' || indexType === 'remoteFile' || indexType === "database"}>预览数据</SubmitButton>
                            <SubmitButton loading={indexFileLoading || indexByConnectorLoading} handleButtonClick={handleSubmit} size="small" sx={{width: 100}}
                                          className={classes.submit}>导入文件</SubmitButton>
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{maxHeight: 500, overflowY: 'scroll'}}>
                            {previewFileLoading || previewUriLoading? <div style={{color: 'red'}}>正在解析文件中，请耐心等待......</div>:<Document data={previewDocs}/>}
                        </div>
                    </Grid>
                    <Grid item xs={12} style={{fontWeight: 'bold'}}>
                        {message && message.type === 'error' && message.text.length > 10 && <span style={{color:'red'}}>{message.text}</span>}
                        {message && message.type === 'success' && message.text.length > 10 && <span style={{color:'green'}}>{message.text}</span>}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
                <Helper indexType={indexType}/>
            </Grid>
        </Grid>
    )
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center',
    display: 'flex',
};