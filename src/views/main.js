import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import geelinkIcon from "../asset/geelink.png";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import {Routes, Route, Link, useNavigate} from "react-router-dom";
import {LOCAL_STORAGE_AUTH, LOGOUT_SUCCESS, MESSAGE_ERROR} from "../constant";
import {useContext, useEffect, useState} from "react";
import Dashboard from "./dashboard";
import DataManagement from "./datamgmt";
import {ClickAwayListener, Collapse, MenuItem, Tooltip} from "@mui/material";
import ROUTES from "./routes";
import {ProtectedRoute} from "../privacy/ProtectedRoute";
import {AccountCircle, ExpandLess, ExpandMore} from "@mui/icons-material";
import {logout} from "../middleware/auth";
import {useDispatch} from "react-redux";
import {useDataServiceGetAxios} from "../service/api.service";
import {AppContext} from "../privacy/AppContext";
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PostAddIcon from '@mui/icons-material/PostAdd';
import TableViewIcon from '@mui/icons-material/TableView';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import SurfingIcon from '@mui/icons-material/Surfing';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import DataImport from "./dataimport";
import AnalysisUser from "./analysisuser";
import AnalysisData from "./analysisdata";
import AnalysisAction from "./analysisaction";
import {WorkspaceContext} from '../privacy/WorkspaceContext';
import UserSnap from "./analysisuser/user.snap";
import DataSnap from "./analysisdata/data.snap";
import SearchSnap from "./analysisaction/search.snap";
import AnalysisSearch from "./analysisaction/search.analysis";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { tooltipClasses } from '@mui/material/Tooltip';
import BeatLoader from "react-spinners/BeatLoader";
import Badge from '@mui/material/Badge';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HelpIcon from '@mui/icons-material/Help';
import FileSaver from 'file-saver';
import MessageBox from "./messageBox";
import PaymentsIcon from '@mui/icons-material/Payments';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Bill from "./bill";
import Trans from "./bill/trans";

const drawerWidth = 220;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(0)} + 1px)`
    }
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Main() {
    const theme = useTheme();
    const {application, messageHist, markRead, markAllRead, clearAllMessage} = useContext(AppContext);
    const [ { data:getAppDetailData, loading:getAppDetailLoading, error:getAppDetailError, response: getAppDetailResponse },
        getAppDetailApi ] = useDataServiceGetAxios({}, { manual: true } );
    const [{data: listAllPipelineData, loading: listAllPipelineLoading, error: listAllPipelineError}, listAllPipeline] = useDataServiceGetAxios(
        {}, {manual: true});

    const [{data: downloadFileData, loading: downloadFileLoading, error: downloadFileError}, downloadFileApi] = useDataServiceGetAxios(
        {}, {manual: true});
    const {setMessage} = useContext(AppContext);
    const [applicationOpen, setApplicationOpen] = useState(true);
    const [analysisOpen, setAnalysisOpen] = useState(true);
    const [collectionList, setCollectionList] = useState();
    const [pipelineList, setPipelineList] = useState();
    const [appStatus, setAppStatus] = useState(false);

    const handleApplicationClick = () => {
        setApplicationOpen(!applicationOpen);
    };

    const handleAnalysisClick = () => {
        setAnalysisOpen(!analysisOpen);
    };

    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState(0);
    const dispatch = useDispatch();
    const history = useNavigate();
    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const updateSelected = (value) => {
        setSelected(value);
    }

    const [open2, setOpen2] = React.useState(false);
    const [openSupport, setOpenSupport] = React.useState(false);
    const [billingOpen, setBillingOpen] = React.useState(false);

    const handleTooltipClose = () => {
        setOpen2(false);
    };

    const handleTooltipOpen = () => {
        setOpen2(!open2);
    };

    const handleSupportClose = () => {
        setOpenSupport(false);
    };

    const handleSupportOpen = () => {
        setOpenSupport(!openSupport);
    };

    const handleBillingClick = () => {
        setBillingOpen(!billingOpen);
    };


    useEffect(() => {
        if (sessionStorage.getItem(LOCAL_STORAGE_AUTH) === null) {
            history("/login");
            return;
        }

        if (application && application.length > 0) {
            getAppDetailApi({
                url:'/apps/' + application + '/detail'
            });
        }
    }, [application]);

    const handleDownload = () => {
        downloadFileApi({
            url: '/apps/support?type=basic'
        });
    }

    useEffect(() => {
        if (!downloadFileLoading) {
            if (downloadFileData) {
                let blob =new Blob([downloadFileData], {type: 'application/octet-stream;charset=utf-8'});
                FileSaver.saveAs(blob, "support.pdf");
            }
        }
    }, [downloadFileLoading, downloadFileData, downloadFileError]);

    useEffect(() => {
        if (!getAppDetailLoading) {
            if (getAppDetailError) {
                if (getAppDetailError.response && getAppDetailError.response.data) {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: getAppDetailError.response.data.message
                    });
                } else {
                    setMessage({
                        type: MESSAGE_ERROR,
                        text: "请检查网络正常或者联系技术支持"
                    });
                }
                setAppStatus(false);
            } else if (getAppDetailData) {
                if (getAppDetailData.status === 0){
                    let config = getAppDetailData.result;
                    setCollectionList(config.collectionList);
                    setAppStatus(true);
                } else {
                    setAppStatus(false);
                    if (getAppDetailData.code || getAppDetailData.message) {
                        if (getAppDetailData.code === 'AU000002') {
                            setMessage({
                                type: MESSAGE_ERROR,
                                text: "您不能访问该应用，请联系技术支持"
                            });
                        } else {
                            setMessage({
                                type: MESSAGE_ERROR,
                                text: "错误代码:" + getAppDetailData.code + ", 错误信息：" + getAppDetailData.message
                            });
                        }
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
    }, [getAppDetailLoading, getAppDetailError, getAppDetailData]);


    useEffect(() => {
        if (appStatus && collectionList && collectionList.length > 0) {
            listAllPipeline({
                url: '/pipeline/' + collectionList[0] + "?type=index&stage=false"
            });
        }
    }, [collectionList, appStatus]);


    useEffect(() => {
        if ( !listAllPipelineLoading ) {

            if (listAllPipelineError) {
                console.error("Failed to search index pipeline");
                return;
            }

            if (listAllPipelineData && listAllPipelineData.result) {
                let list = listAllPipelineData.result.map(item => {
                    return {
                        key: item.alias,
                        value: item.name
                    }
                });

                list.unshift({key:"none", value:"不使用数据管道"});
                setPipelineList(list);
            }
        }
    }, [listAllPipelineLoading, listAllPipelineData, listAllPipelineError]);

    const handleLogout = () => {
        logout();
        history('/');

        dispatch({
            type: LOGOUT_SUCCESS
        });
    }

    const BootstrapTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: '#2E3B55',
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#2E3B55',
        },
    }));

    const getNewMessageCount = (v) => {
        if (typeof v === 'undefined' || v.length === 0) return 0;

        if (!Array.isArray(v)) return 0;

        let count = 0;
        for(let i=0; i<v.length; i++) {
            if (v[i].status === 'N') {
                count++;
            }
        }

        return count;
    }

    if (getAppDetailLoading || listAllPipelineLoading) {
        return <div style={{
                            width: 300,
                            height: 200,
                            position: 'absolute',
                            top:0,
                            textAlign: "center",
                            alignItems: 'center',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            margin: 'auto'}}>
            <BeatLoader color="#f41024" size={30} margin={5}/>
            <Typography style={{ fontSize: 14 }}>
                <span>{getAppDetailLoading && '正在导入应用信息'}</span>
                <span>{listAllPipelineLoading && '正在导入数据导入管道'}</span>
            </Typography>
        </div>
    }

    if (!appStatus) {
        return <div style={{
            width: 300,
            height: 200,
            position: 'absolute',
            top:0,
            textAlign: "center",
            alignItems: 'center',
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto'}}>
            <Typography style={{ fontSize: 14 }}>
                App is not good
            </Typography>

        </div>
    }


    let contextValues = {
        collectionList,
        pipelineList
    }
    return (
        <WorkspaceContext.Provider value={contextValues}>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar style={{ background: '#2E3B55'}}>
                    <div style={{display:'flex', justifyContent:'space-between', width: '100%'}}>
                        <div style={{display:'flex', flexDirection:'row', width: drawerWidth, paddingTop: 10}}>
                            <img src={geelinkIcon} alt='geelikIcon' height={25} width={120}/>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{
                                    marginLeft: 2
                                }}
                            >
                                <Tooltip title='隐藏/打开导航栏' arrow>
                                    <MenuIcon />
                                </Tooltip>
                            </IconButton>
                        </div>

                        <Typography variant="h6" noWrap component="div" style={{paddingTop: 10}}>
                            Geelink数据治理平台管理系统<span style={{fontSize: 12, fontStyle: "italic"}}>(Version 1.0)</span>
                        </Typography>
                        <div style={{display:'flex', flexDirection: 'row', columnGap: 5}}>
                            <ClickAwayListener onClickAway={handleSupportClose}>
                                <div>
                                    <BootstrapTooltip placement="bottom" title={
                                        <div style={{width: 300, minHeight: 300, maxHeight: 600, fontSize: 14, padding: 10}}>
                                            <p>欢迎您使用Geelink智能感知搜索系统，如果您有任何问题或者需要咨询，请选择以下联系方式</p>
                                            <p>联系电话： 18601068035</p>
                                            <p>业务咨询：bd@geelink.cn</p>
                                            <p>技术支持：info@geelink.cn</p>
                                            <p>加入我们：hr@geelink.cn</p>
                                            <p>公司网址：<a href='http://www.geelink.cn' target='_blank'><span style={{color: 'white'}}>http://www.geelink.cn</span></a></p>
                                        </div>
                                    }
                                                      disableFocusListener
                                                      disableHoverListener
                                                      disableTouchListener
                                                      open={openSupport}
                                                      onClose={handleSupportClose}>
                                        <IconButton
                                            size="large"
                                            onClick={handleSupportOpen}
                                            aria-haspopup="true"
                                            aria-controls="menu-appbar"
                                            color="inherit">
                                            <Tooltip title='查看联系方式' arrow>
                                                <SupportAgentIcon/>
                                            </Tooltip>
                                        </IconButton>
                                    </BootstrapTooltip>
                                </div>
                            </ClickAwayListener>

                            <IconButton
                                size="large"
                                onClick={handleDownload}
                                aria-haspopup="true"
                                aria-controls="menu-appbar"
                                color="inherit">
                                <Tooltip title='帮助文档' arrow>
                                    <HelpIcon/>
                                </Tooltip>
                            </IconButton>

                            <ClickAwayListener onClickAway={handleTooltipClose}>
                                <div>
                                    <BootstrapTooltip placement="bottom" title={<MessageBox/>}
                                                      disableFocusListener
                                                      disableHoverListener
                                                      disableTouchListener
                                                      open={open2}
                                                      onClose={handleTooltipClose}>
                                        <IconButton
                                            size="large"
                                            onClick={handleTooltipOpen}
                                            aria-haspopup="true"
                                            aria-controls="menu-appbar"
                                            color="inherit">
                                                <Badge badgeContent={getNewMessageCount(messageHist)} color="error">
                                                    <Tooltip title='查看消息' arrow>
                                                        <NotificationsIcon/>
                                                    </Tooltip>
                                                </Badge>
                                        </IconButton>
                                    </BootstrapTooltip>
                                </div>
                            </ClickAwayListener>

                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleLogout}
                                color="inherit"
                            >
                                <Tooltip title='退出系统' arrow>
                                    <AccountCircle />
                                </Tooltip>
                            </IconButton>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>

                </DrawerHeader>
                <Divider />
                <List dense={true} disablePadding={true}>

                    {/* dash board */}
                    <ListItem key={'dashboard'} disablePadding sx={{ display: 'block'}}>
                        <ListItemButton
                            sx={{
                                height: 40,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 1 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                               <DashboardIcon/>
                            </ListItemIcon>
                            <MenuItem button="true" onClick={() => updateSelected(0)} dense={true}
                                selected={selected === 0}
                                component={Link}
                                to={ROUTES.DASHBOARD.path}>
                                <ListItemText primary={'仪表盘'} sx={{ opacity: open ? 1 : 0 }} />
                            </MenuItem>
                        </ListItemButton>
                    </ListItem>

                     {/*data management*/}
                    <ListItem key="dataManagement" dense={true}
                              onClick={handleApplicationClick}
                              selected={selected === 1}
                              disablePadding sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <WarehouseIcon/>
                            </ListItemIcon>

                            <ListItemText primary={'内容仓库'} sx={{ opacity: open ? 1 : 0 }} />
                            {applicationOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>

                    <Collapse in={applicationOpen} timeout="auto" unmountOnExit>

                        <List component="div" style={{marginLeft: "50px"}} dense={true}>
                            <ListItem key={'dataImport'} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 1.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <PostAddIcon/>
                                    </ListItemIcon>

                                    <MenuItem
                                        button="true" onClick={() => updateSelected(11)}
                                        selected={selected === 11}
                                        component={Link}
                                        to={ROUTES.DATA_IMPORT.path}>
                                        <ListItemText primary={'导入数据'} sx={{ opacity: open ? 1 : 0 }} />
                                    </MenuItem>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key={'dataMgmt'} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 1.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <TableViewIcon/>
                                    </ListItemIcon>

                                    <MenuItem
                                        button="true" onClick={() => updateSelected(12)}
                                        selected={selected === 12}
                                        component={Link}
                                        to={ROUTES.DATA_MANAGEMENT.path}>
                                        <ListItemText primary={'数据管理'} sx={{ opacity: open ? 1 : 0 }} />
                                    </MenuItem>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>


                    {/* analysis */}
                    <ListItem key="analysis" dense={true}
                              onClick={handleAnalysisClick}
                              selected={selected === 2}
                              disablePadding sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <AnalyticsIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'统计分析'} sx={{ opacity: open ? 1 : 0 }} />
                            {analysisOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>

                    <Collapse in={analysisOpen} timeout="auto" unmountOnExit>

                        <List component="div" style={{marginLeft: "50px"}} dense={true}>
                            <ListItem key={'analysisUser'} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 1.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <GroupIcon/>
                                    </ListItemIcon>

                                    <MenuItem
                                        button="true" onClick={() => updateSelected(21)}
                                        selected={selected === 21}
                                        component={Link}
                                        to={ROUTES.ANALYSIS_USER.path}>
                                        <ListItemText primary={'用户分析'} sx={{ opacity: open ? 1 : 0 }} />
                                    </MenuItem>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key={'analysisData'} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 1.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <DataThresholdingIcon/>
                                    </ListItemIcon>

                                    <MenuItem
                                        button="true" onClick={() => updateSelected(22)}
                                        selected={selected === 22}
                                        component={Link}
                                        to={ROUTES.ANALYSIS_DATA.path}>
                                        <ListItemText primary={'数据分析'} sx={{ opacity: open ? 1 : 0 }} />
                                    </MenuItem>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key={'analysisAction'} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 1.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <SurfingIcon/>
                                    </ListItemIcon>

                                    <MenuItem
                                        button="true" onClick={() => updateSelected(23)}
                                        selected={selected === 23}
                                        component={Link}
                                        to={ROUTES.ANALYSIS_ACTION.path}>
                                        <ListItemText primary={'行为分析'} sx={{ opacity: open ? 1 : 0 }} />
                                    </MenuItem>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key={'analysisSearch'} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 1.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <QueryStatsIcon/>
                                    </ListItemIcon>

                                    <MenuItem
                                        button="true" onClick={() => updateSelected(24)}
                                        selected={selected === 24}
                                        component={Link}
                                        to={ROUTES.DATA_MAP_SEARCH.path}>
                                        <ListItemText primary={'画像搜索'} sx={{ opacity: open ? 1 : 0 }} />
                                    </MenuItem>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>

                    {/* Billing */}
                    <ListItem key="billing" dense={true}
                              onClick={handleBillingClick}
                              selected={selected === 3}
                              disablePadding sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <PaymentsIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'账单管理'} sx={{ opacity: open ? 1 : 0 }} />
                            {billingOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                    </ListItem>
                    <Collapse in={billingOpen} timeout="auto" unmountOnExit>

                        <List component="div" style={{marginLeft: "50px"}} dense={true}>
                            <ListItem key={'billingOverall'} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 1.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <CalendarMonthIcon/>
                                    </ListItemIcon>

                                    <MenuItem
                                        button="true" onClick={() => updateSelected(31)}
                                        selected={selected === 31}
                                        component={Link}
                                        to={ROUTES.BILL.path}>
                                        <ListItemText primary={'月账单详情'} sx={{ opacity: open ? 1 : 0 }} />
                                    </MenuItem>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key={'billingDetail'} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 1.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <ReceiptIcon/>
                                    </ListItemIcon>

                                    <MenuItem
                                        button="true" onClick={() => updateSelected(32)}
                                        selected={selected === 32}
                                        component={Link}
                                        to={ROUTES.BILL_TRANS.path}>
                                        <ListItemText primary={'结算记录'} sx={{ opacity: open ? 1 : 0 }} />
                                    </MenuItem>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>

                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Routes>
                    <Route path={"/"} element={<ProtectedRoute redirectTo="/login" />}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path='data' element={<DataManagement/>}/>
                        <Route path='dataImport' element={<DataImport/>}/>
                        <Route path='analysisUser' element={<AnalysisUser/>}/>
                        <Route path='analysisData' element={<AnalysisData/>}/>
                        <Route path='analysisAction' element={<AnalysisAction/>}/>
                        <Route path='datamapSearch' element={<AnalysisSearch/>}/>
                        <Route path='app-user-sanp/:id' element={<UserSnap/>}/>
                        <Route path='app-data-sanp/:id' element={<DataSnap/>}/>
                        <Route path='app-search-sanp/:id' element={<SearchSnap/>}/>
                        <Route path='billing' element={<Bill/>}/>
                        <Route path='billing/trans' element={<Trans/>}/>
                    </Route>
                </Routes>
            </Box>
        </Box>
        </WorkspaceContext.Provider>
    );
}
