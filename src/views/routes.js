import Dashboard from "./dashboard";
import DataManagement from "./datamgmt";
import DataImport from "./dataimport";
import AnalysisUser from "./analysisuser";
import AnalysisData from "./analysisdata";
import AnalysisAction from "./analysisaction";
import DataSanp from './analysisdata/'
import SearchSnap from './analysisaction/search.snap';
import UserSnap from './analysisuser/user.snap';
import AnalysisSearch from './analysisaction/search.analysis';
import Bill from './bill/index';
import Trans from './bill/trans';

const ROUTES = {
    DASHBOARD: {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard,
        public: false,
        breadcrumb: '仪表盘',
        level: 1
    },
    DATA_MAP_SEARCH: {
        path: "/datamapSearch",
        name: "datamapSearch",
        component: AnalysisSearch,
        public: false,
        breadcrumb: '数据地图',
        level: 1
    },
    DATA_MANAGEMENT: {
        path: "/data",
        name: "data",
        component: DataManagement,
        public: false,
        breadcrumb: 'DataManagement',
        level: 1
    },
    DATA_IMPORT: {
        path: "/dataImport",
        name: "dataImport",
        component: DataImport,
        public: false,
        breadcrumb: 'DataImport',
        level: 1
    },
    ANALYSIS_USER: {
        path: "/analysisUser",
        name: "analysisUser",
        component: AnalysisUser,
        public: false,
        breadcrumb: 'AnalysisUser',
        level: 1
    },
    ANALYSIS_DATA: {
        path: "/analysisData",
        name: "analysisData",
        component: AnalysisData,
        public: false,
        breadcrumb: 'AnalysisData',
        level: 1
    },
    ANALYSIS_ACTION: {
        path: "/analysisAction",
        name: "analysisAction",
        component: AnalysisAction,
        public: false,
        breadcrumb: 'AnalysisAction',
        level: 1
    },

    APP_DATA_SNAP: {
        path: "/app-data-sanp/:id",
        url: "/app-data-sanp",
        name: 'app-data-sanp',
        public: false,
        component: DataSanp,
        breadcrumb: '数据统计',
        level: 2
    },

    APP_SEARCH_SNAP: {
        path: "/app-search-sanp/:id",
        url: "/app-search-sanp",
        name: 'app-search-sanp',
        public: false,
        component: SearchSnap,
        breadcrumb: '搜索统计',
        level: 2
    },

    APP_USER_SNAP: {
        path: "/app-user-sanp/:id",
        url: "/app-user-sanp",
        name: 'app-user-sanp',
        public: false,
        component: UserSnap,
        breadcrumb: '用户统计',
        level: 2
    },
    BILL: {
        path: "/billing",
        url: "/billing",
        name: 'billing',
        public: false,
        component: Bill,
        breadcrumb: '账单概览',
        level: 2
    },
    BILL_TRANS: {
        path: "/billing/trans",
        url: "/billing/trans",
        name: 'billingDetail',
        public: false,
        component: Trans,
        breadcrumb: '账单详情',
        level: 2
    },
   /* NO_MATCH: {
        path: "*",
        name: "404",
        public: false,
        component: NoMatch,
        level: 1
    }*/
};

export default ROUTES;