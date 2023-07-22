import React, {forwardRef, useContext, useEffect, useImperativeHandle, useState} from 'react';
import {ConfigContext} from "./ConfigProvider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { TextField, Tooltip } from "@mui/material";
import NorthIcon from '@mui/icons-material/North';
import IconButton from "@mui/material/IconButton";
import {useDataServicePostAxios} from "../../service/api.service";
import {WorkspaceContext} from "../../privacy/WorkspaceContext";
import {MESSAGE_ERROR, MESSAGE_SUCCESS} from "../../constant";
import {AppContext} from "../../privacy/AppContext";
import {DataManagementContext} from "../../privacy/DataManagentContext";
import Typography from "@mui/material/Typography";

const SettingStep2 = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        handleSubmit() {
            saveConfigApi({
                url: '/collections/' + collectionList[0] + "/management/config",
                data: column
            })
        }
    }))

    const [ { data:saveConfigData, loading:saveConfigLoading, error:saveConfigError, response: saveConfigResponse },
        saveConfigApi ] = useDataServicePostAxios({}, { manual: true } );
    const {returnFields} = useContext(ConfigContext);
    const { setMessage } = useContext(AppContext);
    const { collectionList } = useContext(WorkspaceContext);
    const { fieldConfig, setFieldConfig } = useContext(DataManagementContext);

    const [column, setColumn] = useState([]);

    useEffect(() => {
        setColumn(returnFields.map((item, index) => {
            return getField(fieldConfig, item, index)
        }));
    }, [returnFields, fieldConfig]);

    const getField = (fieldConfig, item, index) => {
        let findField = fieldConfig.filter(m => m.id === item);
        if (findField && findField.length > 0) {
            return {
                ...findField[0],
                pos: index
            };
        }

        return {
            id: item,
            pos: index,
            column: item,
            label: ''
        }
    }

    const handleChange = (e, v) => {
        let oldColumn = JSON.parse(JSON.stringify(column));

        let value = oldColumn.filter(m => m.id === v.column);
        value[0].label = e.target.value;

        setColumn(oldColumn);
    }

    const handlePosition = (v) => {
        let oldColumn = JSON.parse(JSON.stringify(column));

        let value = oldColumn.filter(m => m.id === v.column);
        let pos = value[0].pos;

        if (pos === 0) return;

        let oriPositionValue = oldColumn.filter(m => m.pos === (pos - 1));
        oriPositionValue[0].pos = pos;
        value[0].pos = pos - 1;

        oldColumn.sort( (a,b) => a.pos - b.pos );
        setColumn(oldColumn);
    }


    useEffect(() => {
        if (!saveConfigLoading) {
            if (saveConfigError) {
                if (saveConfigError.response) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: saveConfigError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (saveConfigData) {
                if (saveConfigData && saveConfigData.status === 0){
                    setMessage({
                        type: MESSAGE_SUCCESS,
                        text: "保存管理配置成功"
                    });
                    setFieldConfig(column);
                    props.close();
                } else {
                    if (saveConfigData.code || saveConfigData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + saveConfigData.code + ", 错误信息：" + saveConfigData.message
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
    }, [saveConfigLoading, saveConfigData, saveConfigError]);


    return (
        <Paper variant={"outlined"} style={{padding: 5, fontSize: 14}}>
            <Grid container spacing={1} direction={"row"}>
                <Grid item container xs={8} spacing={1}>
                    <Grid item xs={3}>字段名称</Grid>
                    <Grid item xs={9}>中文名称</Grid>
                    {column.map((item, index) => {
                        return <React.Fragment key={index}>
                            <Grid item xs={3}>{item.column}</Grid>
                            <Grid item xs={9}>
                                <TextField size={"small"}
                                           InputProps={{style:{fontSize: 14}}}
                                           value={item.label}
                                           onChange={(e) => handleChange(e, item)}>
                                </TextField>

                                <Tooltip title="向前移动字段" arrow>
                                    <IconButton size={"small"} disabled={item.pos === 0} onClick={() => handlePosition(item)}>
                                        <NorthIcon fontSize={"small"} color={item.pos === 0? "disabled":"primary"}/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </React.Fragment>
                    })}
                </Grid>
                <Grid item xs={4}>
                    <Paper elevation={0} style={{padding: 10}}>
                        <h4>帮助信息</h4>
                        <Typography>配置数据管理部分的搜索返回字段及其中文字段名称，便于管理人员访问数据</Typography>
                        <li>字段名称：内容仓库中的所保存的数据字段</li>
                        <li>中文名称：用于显示在表头的字段名称</li>
                        <li>向上箭头：用于调整该字段显示的顺序</li>
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    )
})

export default SettingStep2;
