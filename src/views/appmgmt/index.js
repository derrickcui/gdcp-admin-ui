import React, {useContext, useEffect} from 'react';
import Grid from "@mui/material/Grid";
import SubmitButton from "../../component/submit.button";
import useStyles from "../dataimport/index.css";
import {useDataServicePostAxios, useDataServiceGetAxios} from "../../service/api.service";
import {AppContext} from "../../privacy/AppContext";
import {LOCAL_STORAGE_AUTH, MESSAGE_ERROR, MESSAGE_SUCCESS} from "../../constant";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from '@mui/material/CircularProgress';
import jwt_decode from "jwt-decode";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {WorkspaceContext} from "../../privacy/WorkspaceContext";
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function AppManagement() {
    const classes = useStyles();

    const [{data: purgeDataData, loading: purgeDataLoading, error: purgeDataError}, purgeDataApi] = useDataServicePostAxios(
        {}, {manual: true});
    const [{data: reloadCollData, loading: reloadCollLoading, error: reloadCollError}, reloadCollApi] = useDataServiceGetAxios(
        {}, {manual: true});
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const user = auth && auth.token && jwt_decode(auth.token);
    const {application, message, setMessage} = useContext(AppContext);
    const {collectionList} = useContext(WorkspaceContext);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        setOpen(true)
        purgeDataApi({
            url: '/index/purge/' + application
        });
    }


    const handleReloadCollection = () => {
        reloadCollApi({
            url: '/collections/admin?name=' + collectionList[0] + '&action=reload'
        });
    }

    
    useEffect(() => {
        if (!purgeDataLoading) {
            if (purgeDataError) {
                if (purgeDataError.response && purgeDataError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: purgeDataError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (purgeDataData) {
                if (purgeDataData.status === 0){
                    setMessage({
                        type: MESSAGE_SUCCESS,
                        text: "数据成功删除"
                    });
                    setOpen(false);
                } else {
                    if (purgeDataData.code || purgeDataData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + purgeDataData.code + ", 错误信息：" + purgeDataData.message
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
    }, [purgeDataLoading, purgeDataData, purgeDataError]);

    
    useEffect(() => {
        if (!reloadCollLoading) {
            if (reloadCollError) {
                if (reloadCollError.response && reloadCollError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: reloadCollError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
            } else if (reloadCollData) {
                if (reloadCollData.status === 0){
                    setMessage({
                        type: MESSAGE_SUCCESS,
                        text: "重新加载数据成功"
                    });
                    setOpen(false);
                } else {
                    if (reloadCollData.code || reloadCollData.message) {
                        setMessage({
                            type: MESSAGE_ERROR,
                            text: "错误代码:" + reloadCollData.code + ", 错误信息：" + reloadCollData.message
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
    }, [reloadCollLoading, reloadCollData, reloadCollError]);

    return (
        <div>
        <Grid container style={{fontSize: 14}}>
            <Grid item xs={12} style={{borderBottom: '1px solid grey', fontWeight:'bold'}}>
                常用功能快捷键
            </Grid>
            <Grid item xs={6} md={3} lg={1}>
                <SubmitButton disabled={!user || !user.roles || user.roles.size === 0 || !user.roles.includes("ADMIN")}
                              handleButtonClick={handleClickOpen}
                              size="small" sx={{width: 100}}
                              className={classes.submit}>清空数据</SubmitButton>
            </Grid>
            <Grid item xs={6} md={9} lg={11}>
                <div style={{display:'flex', alignItems:'center', height: 40}}>
                从内容仓库中删除所有的数据，该功能仅<span style={{color:'red'}}>系统管理员</span>可以执行
                </div>
            </Grid>

            <Grid item xs={6} md={3} lg={1}>
                <SubmitButton disabled={!user || !user.roles || user.roles.size === 0 || !user.roles.includes("ADMIN")}
                              handleButtonClick={handleReloadCollection}
                              size="small" sx={{width: 100}}
                              className={classes.submit}>重新加载数据</SubmitButton>
            </Grid>
            <Grid item xs={6} md={9} lg={11}>
                <div style={{display:'flex', alignItems:'center', height: 40}}>
                重新加载内容仓库中的数据，使内容仓库的改变能起作用。主要用于内容仓库配置文件的改变，或者字段的增加，删除之后.该功能仅<span style={{color:'red'}}>系统管理员</span>可以执行
                </div>
            </Grid>

            <Grid item xs={12}>
                {message && message.type === 'error' && message.text.length > 10 && <span style={{color:'red'}}>{message.text}</span>}
                {message && message.type === 'success' && message.text.length > 10 && <span style={{color:'green'}}>{message.text}</span>}
            </Grid>

        </Grid>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"删除数据确认?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        该操作将从应用内容仓库在测地删除数据，并且不可恢复，请确认理解该操作的后果后在进行操作
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit} autoFocus>
                        删除数据
                    </Button>
                </DialogActions>
            </Dialog>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={purgeDataLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}