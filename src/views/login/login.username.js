import React, {useContext, useEffect, useState} from 'react';
import {TextField, Checkbox, Typography, InputAdornment,
    FormControlLabel, Grid} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import CheckIcon from '@mui/icons-material/Check';
import {loginUseStyles} from './login.username.css';
import useAxios from 'axios-hooks'
import base64 from "base-64";
import {login} from "../../middleware/auth";
import {LOCAL_STORAGE_AUTH, LOGIN_FAILURE, LOGIN_SUCCESS, MESSAGE_ERROR} from "../../constant";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import ClientCaptcha from "react-client-captcha"
import "react-client-captcha/dist/index.css"
import GlTextField from "../../component/geelink.text.field";
import SubmitButton from "../../component/submit.button";
import {Alert} from "@mui/lab";
import {useDataServiceGetAxios} from "../../service/api.service";
import {AppContext} from "../../privacy/AppContext";
import ROUTER from "../routes";

export default function LoginUserName() {
    const REMEMBER_ME_KEY = "rememberMe";
    const classes = loginUseStyles();
    const dispatch = useDispatch();
    const history = useNavigate();
    const [{data: getData, loading: getLoading, error: getError}, authApi] = useAxios({
            url: process.env.REACT_APP_AUTH_URL + "/auth/login",
            method: 'GET'
        },
        {manual: true}
    )
    const [ { data:getAppDetailData, loading:getAppDetailLoading, error:getAppDetailError, response: getAppDetailResponse },
        getAppDetailApi ] = useDataServiceGetAxios({}, { manual: true } );

    const {application} = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [error, setError] = useState();
    const [vcaptcha, setVcaptcha] = useState('');

    const handleRememberChange = (e) => {
        setRememberMe(e.target.checked)
    }

    const handleChange = (e) => {
        if (e.target.name === 'username') {
            setUsername(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        } else if (e.target.name === 'vcaptcha') {
            setVcaptcha(e.target.value)
        }
        setError(null);
    }

    const handleLogin = () => {
        // check username is not null
        if (!username || username.trim().length === 0) {
            setError("请填写用户账号")
            return;
        }
        if (!password || password.trim().length === 0) {
            setError("请填写登录密码")
            return;
        }

        if (!vcaptcha || vcaptcha.trim().length === 0) {
            setError("请填写校验码")
            return;
        }
        if (vcaptcha.toUpperCase() !== captcha.toUpperCase()) {
            setError("验证码错误")
            return;
        }
        if (rememberMe) {
            localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify({username: username, password: password}));
        } else {
            localStorage.removeItem(REMEMBER_ME_KEY);
        }

        authApi({
            headers: {
                "Content-Type": "application/json",
                'Authorization': "Basic " + base64.encode(username + ":" + password)
            }
        });
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
            e.preventDefault();
        }
    }

    useEffect(() => {
        let loginStr = localStorage.getItem(REMEMBER_ME_KEY);
        if (loginStr && loginStr.trim().length > 0) {
            setRememberMe(true);
            let loginJson = JSON.parse(loginStr);
            setUsername(loginJson.username);
            setPassword(loginJson.password);
        } else {
            setRememberMe(false);
        }
    }, []);

    useEffect(() => {
        if (getLoading === false) {
            if (getError) {
                if (getError.response && getError.response.data) {
                    dispatch({
                        type: LOGIN_FAILURE
                    });

                    setError(getError.response.data.message);
                } else {
                    setError("请检查网络正常或者联系技术支持");
                }

            } else if (getData) {
                if (getData.status === 0){
                    login(history, getData.result)
                    if (application && application.length > 0) {
                        getAppDetailApi({
                            url:'/apps/' + application + '/detail'
                        });
                    }
                    dispatch({
                        type: LOGIN_SUCCESS
                    });
                } else {
                    setError(" 请填写正确的账号密码")
                    return;
                }
            }
        }
        // eslint-disable-next-line
    }, [getLoading])

    useEffect(() => {
        if (!getAppDetailLoading) {
            if (getAppDetailError) {
                if (getAppDetailError.response && getAppDetailError.response.data) {
                    if (getAppDetailError.response.data.code === 'AU000002') {
                        setError("访问权限受限，请联系技术支持");
                    } else {
                        setError(getAppDetailError.response.data.message);
                    }
                } else {
                    setError("请检查网络正常或者联系技术支持");
                }
            } else if (getAppDetailData) {
                if (getAppDetailData.status === 0){
                    history(ROUTER.DASHBOARD.path, { replace: true });
                } else {
                    if (getAppDetailData.code || getAppDetailData.message) {
                        if (getAppDetailData.code === 'AU000002') {
                            setError("您不能访问应用:" + application + "，请联系技术支持");
                        } else {
                            setError("错误代码:" + getAppDetailData.code + ", 错误信息：" + getAppDetailData.message);
                        }
                    } else {
                        setError("系統错误，请联系Geelink技术支持");
                    }
                }
            }
        }
        // eslint-disable-next-line
    }, [getAppDetailLoading, getAppDetailError, getAppDetailData]);


    return (
        <div style={{paddingLeft: 10, paddingRight: 10, height: '100%'}} >
            <Grid container direction={"column"} spacing={0}>
                <Grid item>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        margin={"dense"}
                        size={"small"}
                        id="username"
                        placeholder="请输入用户名"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        autoComplete="username"
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon/>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        variant="outlined"
                        required
                        margin={"dense"}
                        fullWidth
                        size={"small"}
                        name="password"
                        placeholder="请输入登录密码"
                        type="password"
                        id="password"
                        value={password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon/>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid item container>
                    <Grid item xs={6}>
                        <GlTextField
                            variant="outlined"
                            required
                            fullWidth
                            margin={"dense"}
                            size={"small"}
                            id="vcaptcha"
                            placeholder="请输入校验码"
                            name="vcaptcha"
                            value={vcaptcha}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            autoComplete="vcaptcha"
                            autoFocus
                            InputProps={{
                                style:{
                                    fontSize: 14
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CheckIcon/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} style={{paddingTop: 9, paddingLeft: 20}}>
                        <ClientCaptcha captchaCode={code => setCaptcha(code)} fontSize={18} height={40}
                                       backgroundColor={'#FBFCFC'}
                                       retryIconSize={18}/>
                    </Grid>
                </Grid>

                <Grid item style={{display: 'flex', flexDirection: 'row', justifyContent: 'left', justifyItems:'center'}}>
                    <FormControlLabel
                        control={<Checkbox checked={rememberMe} value={rememberMe} color="primary" size={"small"} onChange={handleRememberChange}/>}
                                label={<Typography style={{fontSize: 12}}>记住密码</Typography>}
                     />
                    {error && error !== '' && <Typography style={{color: 'red', fontWeight: 'bold', fontSize: 14, paddingTop: 8}}>{error}</Typography>}
                </Grid>
                <Grid item style={{display: 'flex', justifyContent: 'center'}}>
                    <SubmitButton loading={typeof getLoading !== 'undefined' && getLoading === true? true: false} handleButtonClick={handleLogin} style={{width: 100}}
                                  className={classes.submit}>登录</SubmitButton>
                </Grid>
            </Grid>
        </div>
    )
}