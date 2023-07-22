import React, {forwardRef, useContext, useEffect, useImperativeHandle, useState} from 'react';

import {
    Backdrop,
    Button, Checkbox, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControlLabel,
    Grid,
    IconButton,
    TextField
} from "@mui/material";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Tooltip from "@mui/material/Tooltip";
import {
    useDataServicePutAxios,
    useSearchEngineGetAxios,
    useSolrQueryAxios
} from "../../service/api.service";
import {WorkspaceContext} from "../../privacy/WorkspaceContext";
import {LOCAL_STORAGE_AUTH, MESSAGE_ERROR, MESSAGE_SUCCESS} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import DeleteIcon from '@mui/icons-material/Delete';
import jwt_decode from "jwt-decode";

const Document = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        handleSubmit () {
            let updatedObject = findDiff(oldData, data);
            let deleteKeys = [];
            let updatekeys = [];
            let addKeys = [];

            if (updatedObject) {
                let keys = Object.keys(updatedObject);
                for (let i = 0; i < keys.length; i++) {
                    if (Array.isArray(updatedObject[keys[i]])) {
                        let values = updatedObject[keys[i]];
                        let newValues = values.filter(m => m !== "" && m !== null && m.trim() !== "");
                        if (Object.keys(oldData).includes(keys[i])) {
                            if (newValues.length === 0) {
                                deleteKeys.push(keys[i]);
                            } else {
                                updatekeys.push(keys[i]);
                            }
                        } else {
                            addKeys.push(keys[i]);
                        }
                    } else {
                        if (Object.keys(oldData).includes(keys[i])) {
                            if (updatedObject[keys[i]] === null || updatedObject[keys[i]] === "" || updatedObject[keys[i]].trim() === "") {
                                deleteKeys.push(keys[i]);
                            } else {
                                updatekeys.push(keys[i]);
                            }
                        } else {
                            addKeys.push(keys[i]);
                        }
                    }
                }
            }

            // delete existing field
            if (deleteKeys && deleteKeys.length > 0) {

                let deleteObj = {};
                for(let i=0; i<deleteKeys.length; i++) {
                    deleteObj[deleteKeys[i]] = oldData[deleteKeys[i]];
                }

                deleteObj.id = data.id;

                // deleting
                updateDocApi({
                    url: '/document/' + collectionList[0] + "?action=CLEARALL",
                    data: [deleteObj]
                });

                setOpen2(true);
            }

            // add new field
            let addObj = {};
            for(let i=0; i< addKeys.length; i++) {
                if (Array.isArray(updatedObject[addKeys[i]])) {
                    addObj[addKeys[i]] = updatedObject[addKeys[i]].filter(m => m !== '' && m.trim() !== '');
                } else {
                    addObj[addKeys[i]] = updatedObject[addKeys[i]];
                }
            }

            if (addObj && Object.keys(addObj).length > 0) {
                addObj.id = data.id;
                // deleting
                updateDocApi({
                    url: '/document/' + collectionList[0] + "?action=ADD",
                    data: [addObj]
                });

                setOpen2(true);
            }

            // update existing field
            let uppObj = {};
            for(let i=0; i< updatekeys.length; i++) {
                if (Array.isArray(updatedObject[updatekeys[i]])) {
                    uppObj[updatekeys[i]] = updatedObject[updatekeys[i]].filter(m => m !== '' && m.trim() !== '');
                } else {
                    uppObj[updatekeys[i]] = updatedObject[updatekeys[i]];
                }
            }

            if (uppObj && Object.keys(uppObj).length > 0) {
                uppObj.id = data.id;
                // deleting
                updateDocApi({
                    url: '/document/' + collectionList[0] + "?action=UPDATE",
                    data: [uppObj]
                });
                setOpen2(true);
            }
        },
        handleAddField() {
            handleClickOpen();
        },

        handleManageTag() {
            handleClickOpenTag();
        }
    }))

    const [{data: updateDocData, loading: updateDocLoading, error: updateDocError}, updateDocApi] = useDataServicePutAxios(
        {}, {manual: true});
    const [{data: getTaxonomyFieldData, loading: getTaxonomyFieldLoading, error: getTaxonomyFieldError}, getTaxonomyFieldApi] = useSearchEngineGetAxios(
        {}, {manual: true});
    const [{data: getDocumentData, loading: getDocumentLoading, error: getDocumentError}, getDocumentApi] = useSolrQueryAxios(
        {}, {manual: true});
    const {collectionList} = useContext(WorkspaceContext);
    const {setMessage} = useContext(AppContext);
    const [data, setData] = useState({});
    const [oldData, setOldData] = useState({});
    const [open, setOpen] = React.useState(false);
    const [openTag, setOpenTag] = React.useState(false);
    const [field, setField] = useState('');
    const [fieldError, setFieldError] = useState('');
    const [multiValue, setMultiValue] = useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [taxonomyField, setTaxonomyField] = useState([]);

    const handleCheckChange = (event) => {
        setMultiValue(event.target.checked);
    };

    const handleFieldChange = (e) => {
        let value = e.target.value;

        setField(value);
        if (Object.keys(data).includes(value)) {
            setFieldError("该字段已经存在");
        } else {
            setFieldError('');
        }

    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenTag = () => {
        setOpenTag(true);
    };

    const handleCloseTag = () => {
        setOpenTag(false);
    };

    const handleAddNewField = () => {
        let nd = Object.assign({}, data);
        let newField = field;
        if (multiValue) {
            nd[newField] = [''];
        } else {
            nd[newField] = '';
        }
        setData(nd);
        setField('');
        handleClose();
    }
    useEffect(() => {
        if (!updateDocLoading) {
            setOpen2(false);
            if (updateDocError) {
                if (updateDocError.response) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: updateDocError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (updateDocData) {
                if (updateDocData.status === 0){
                    setMessage({
                        type: MESSAGE_SUCCESS,
                        text: '更新数据成功'
                    });
                    props.close();
                } else {
                    if (updateDocData.code || updateDocData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + updateDocData.code + ", 错误信息：" + updateDocData.message
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
    }, [updateDocLoading, updateDocData, updateDocError]);


    useEffect(() => {
        if (props && props.data) {
            getTaxonomyFieldApi({
                url: '/aux/' + collectionList[0]  + '/field?type=taxonomy'
            })
            const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
            const user = jwt_decode(auth.token);

            let param = {
                "q": "id:" + props.data.id,
                "fl": "*"
            };


            if (collectionList && collectionList.length > 0) {
                getDocumentApi({
                    url: '/' + user.workspace + '_' + collectionList[0]  + '/select',
                    params: param
                });
            }

        }
    }, [props]);


    useEffect(() => {
        if (!getDocumentLoading) {
            if (getDocumentError) {
                if (getDocumentError.response) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: getDocumentError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (getDocumentData) {
                if (getDocumentData && getDocumentData.responseHeader && getDocumentData.responseHeader.status === 0){
                    let docData = getDocumentData.response.docs[0];
                    setData(docData);
                    setOldData(JSON.parse(JSON.stringify(docData)));
                } else {
                    if (getDocumentData.code || getDocumentData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + getDocumentData.code + ", 错误信息：" + getDocumentData.message
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
    }, [getDocumentLoading, getDocumentData, getDocumentError]);


    useEffect(() => {
        if (!getTaxonomyFieldLoading) {
            if (getTaxonomyFieldError) {
                if (getTaxonomyFieldError.response) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: getTaxonomyFieldError.response
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (getTaxonomyFieldData) {
                if (getTaxonomyFieldData && getTaxonomyFieldData.status === 0){
                    setTaxonomyField(getTaxonomyFieldData.result)
                } else {
                    if (getTaxonomyFieldData.status || getTaxonomyFieldData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + getTaxonomyFieldData.status + ", 错误信息：" + getTaxonomyFieldData.message
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
    }, [getTaxonomyFieldLoading, getTaxonomyFieldData, getTaxonomyFieldError]);


    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
        e.target.style = {
            border: '1px solid red'
        }
    }

    const handleMultiChange = (e) => {
        let keys = e.target.name.split('>>');
        let oldArrays = data[keys[0]];
        oldArrays[keys[1]] = e.target.value;
        setData({
            ...data,
            [keys[0]]: oldArrays
        });
    }

    const findDiff = (obj1, obj2) => {
        const isNativeType1 = typeof obj1 !== "object";
        const isNativeType2 = typeof obj2 !== "object";
        if (isNativeType1 && isNativeType2) {
            return obj1 === obj2 ? null : obj2;
        }
        if (isNativeType1 && !isNativeType2) {
            return obj2;
        }
        if (!isNativeType1 && isNativeType2) {
            return obj2;
        }
        const isArray1 = Array.isArray(obj1);
        const isArray2 = Array.isArray(obj2);
        if (isArray1 && isArray2) {
            const firstLenght = obj1.length;
            const secondLenght = obj2.length;
            const hasSameLength = firstLenght === secondLenght;
            if (!hasSameLength) return obj2;
            let hasChange = false;
            for (let index = 0; index < obj1.length; index += 1) {
                const element1 = obj1[index];
                const element2 = obj2[index];
                const changed = findDiff(element1, element2);
                if (changed || changed === '') {
                    hasChange = true;
                }
            }
            return hasChange ? obj2 : null;
        }
        if (isArray1 || isArray2) return obj2;
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        const hasSameKeys = keys1.length === keys2.length;
        if (!hasSameKeys) {
            const retObj = { ...obj2 };
            for (let index = 0; index < keys1.length; index += 1) {
                const key = keys1[index];
                if (!keys2.includes(key)) {
                    retObj[key] = null;
                    // eslint-disable-next-line no-continue
                    continue;
                }
                delete retObj[key];
            }
            return retObj;
        }
        let hasChange = false;
        const retObj = {};
        for (let index = 0; index < keys1.length; index += 1) {
            const key = keys1[index];
            const element1 = obj1[key];
            const element2 = obj2[key];
            const changed = findDiff(element1, element2);
            if (changed || changed === "") {
                hasChange = true;
            }
            if (changed || changed === "") {
                retObj[key] = changed;
            }
        }
        return hasChange ? retObj : null;
    };

    const handleAdd = (v) => {
        let nd = Object.assign({}, data);
        nd[v].push('');
        setData(nd);
    }

    const handleDelete = (v) => {
        let nd = Object.assign({}, data);
        delete nd[v];
        setData(nd);
    }

    const isDuplicateField = (field, fieldList) => {
        if (field.endsWith("_s")) {
            let newField = field.replace("_s", "");
            if (fieldList.includes(newField)) return false;
        }

        if (field.endsWith("_ss")) {
            let newField = field.replace("_ss", "");
            if (fieldList.includes(newField)) return false;
        }

        return true;
    }

    return(
        <React.Fragment>
            <Grid container spacing={1} direction={"row"} style={{fontSize: 14}}>
                {
                    data && Object.keys(data).length > 0 && Object.keys(data)
                        .filter(m => m !== 'tableData' && m !== '_version_')
                        .filter(n => !n.startsWith('_gl_'))
                        .filter(k => isDuplicateField(k, Object.keys(data)))
                        .map((key, index) => {
                            return <Grid item container key={index}>
                                    <Grid item xs={4} md={2}>
                                        {key}
                                        {key !== 'id' && Array.isArray(data[key]) && <IconButton onClick={() => handleAdd(key)}>
                                            <Tooltip title="增加新数据">
                                            <ControlPointIcon color="primary" fontSize={"small"}/>
                                            </Tooltip>
                                        </IconButton>}
                                        {key !== 'id' && <IconButton onClick={() => handleDelete(key)}>
                                            <Tooltip title="删除字段及内容">
                                                <DeleteIcon fontSize={"small"}/>
                                            </Tooltip>
                                        </IconButton>}
                                    </Grid>
                                    <Grid item xs={8} md={10}>{
                                        Array.isArray(data[key])? data[key].map((v,i) =>
                                                <TextField
                                                    size={"small"}
                                                    variant="standard"
                                                    value={v}
                                                    style={{marginRight: 2, width: `${(v.length + 3) * 12}px`, maxWidth: '100%', minWidth: 100}}
                                                    InputProps={{ style: {fontSize: 14}}}
                                                    name={key + '>>' + i}
                                                    onChange={handleMultiChange}/>
                                                )
                                            : <TextField size={"small"}
                                                         variant="standard"
                                                         disabled={key === 'id'}
                                                         name={key}
                                                         multiline={true}
                                                         style={{width: '100%'}}
                                                         value={data[key]}
                                                         InputProps={{ style: {fontSize: 14}}}
                                                         onChange={handleChange}/>
                                    }
                                    </Grid>
                            </Grid>
                        })
                }
            </Grid>
            <Backdrop open={getDocumentLoading} sx={{ position: 'fixed', }}>
                <CircularProgress color="inherit" />
            </Backdrop>


            <Dialog open={open}>
                <DialogTitle  style={{fontSize: 14}}>增加字段</DialogTitle>
                <DialogContent style={{width: 400}}>
                    <DialogContentText  style={{fontSize: 14}}>
                        注意，新增的字段必须不能已经存在数据中
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="field"
                        placeholder='请输入新增字段名称'
                        size={"small"}
                        value={field}
                        onChange={handleFieldChange}
                        fullWidth
                        error={fieldError !== ''}
                        variant="standard"
                        helperText={fieldError}
                        InputProps={{
                            style: {
                                fontSize: 14
                            }
                        }}
                    />

                    <FormControlLabel control={<Checkbox
                        checked={multiValue}
                        size={"small"}
                        onChange={handleCheckChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} label={<span style={{fontSize: 14}}> 多值字段</span>} />

                </DialogContent>
                <DialogActions>
                    <Button variant={"contained"} onClick={handleClose}>取消</Button>
                    <Button variant={"contained"} disabled={fieldError !== ''} onClick={handleAddNewField}>确定</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openTag} fullWidth={true}
                    maxWidth='md'>
                <DialogTitle  style={{fontSize: 14}}>标签管理</DialogTitle>
                <DialogContent style={{minHeight: 500}}>
                    <DialogContentText  style={{fontSize: 14}}>
                        <h4>注意，该标注是由Geelink系统自动生成，必须遵循标签命名规则：</h4>
                        <li>不同级别的分类必须用反斜线(/)区分</li>
                        <li>第一级别的名词必须是【分类】</li>
                    </DialogContentText>
                    <br/>

                    <Grid container spacing={1} direction={"row"} style={{fontSize: 14}}>
                        {
                            taxonomyField && taxonomyField.length > 0 && taxonomyField.map((key, index) => {
                                    return <Grid item container key={index} style={{borderTop: '1px solid #e9edf6', marginBottom: 10, paddingLeft: 10}}>
                                        <Grid item xs={12}>
                                            {key}
                                            <IconButton onClick={() => handleAdd(key)}>
                                                <Tooltip title="增加新数据">
                                                    <ControlPointIcon color="primary" fontSize={"small"}/>
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(key)}>
                                                <Tooltip title="删除字段及内容">
                                                    <DeleteIcon fontSize={"small"}/>
                                                </Tooltip>
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs={12}>{
                                            Array.isArray(data[key])? data[key].map((v,i) =>
                                                    <TextField
                                                        size={"small"}
                                                        variant="standard"
                                                        value={v}
                                                        color="success"
                                                        style={{marginRight: 2, width: `${(v.length + 3) * 12}px`, maxWidth: '100%', minWidth: 100}}
                                                        InputProps={{ style: {fontSize: 14}}}
                                                        name={key + '>>' + i}
                                                        onChange={handleMultiChange}/>
                                                )
                                                : <TextField size={"small"}
                                                             variant="standard"
                                                             disabled={key === 'id'}
                                                             name={key}
                                                             color="success"
                                                             multiline={true}
                                                             style={{width: '100%'}}
                                                             value={data[key]}
                                                             InputProps={{ style: {fontSize: 14}}}
                                                             onChange={handleChange}/>
                                        }
                                        </Grid>
                                    </Grid>
                                })
                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant={"contained"} onClick={handleCloseTag}>取消</Button>
                    <Button variant={"contained"} disabled={fieldError !== ''} onClick={handleAddNewField}>确定</Button>
                </DialogActions>
            </Dialog>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open2}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </React.Fragment>
    )
})

export default Document;