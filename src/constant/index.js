import moment from 'moment';

// LOGIN
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_ACTION = "LOGOUT_ACTION";

export const OPEN_DIALOG = "OPEN_DIALOG";
export const CLOSE_DIALOG = "CLOSE_DIALOG";

// query parameter
export const QUERY_TYPE_ALL = "all";
export const QUERY_PARAM_CHANGED = "QUERY_PARAM_CHANGED";
export const QUERY_PARAM_RESET = "QUERY_PARAM_RESET";

export const LOAD_ROLES_SUCCESS = "LOAD_ROLES_SUCCESS";
export const LOAD_ROLES_FAILURE = "LOAD_ROLES_FAILURE";
export const START_USER_QUERY = "START_USER_QUERY";
export const START_PROJECT_QUERY = "START_PROJECT_QUERY";
export const START_TEMPLATE_QUERY = "START_TEMPLATE_QUERY";
// search status
export const SUCCESS = "0000000";

// auth
export const LOCAL_STORAGE_AUTH = "auth";
export const LOCAL_STORAGE_LOGINID = "loginId";
export const LR_ADMIN_ACCOUNT = "lrAdminAccount";

// error message type
export const MESSAGE_ERROR = "error";
export const MESSAGE_SUCCESS = "success";
export const MESSAGE_WARNING = "warning";
export const MESSAGE_INFO = "info";

export const SYSTEM_CONFIG = "systemConfig";
export const APP_NAME = "appName";
export const APP_WORKSPACE_NAME = "workspace";
export const APP_COLLECTION_NAME = "collection";
export const APP_REPORTNAME = "reportName";
export const FUNCTION_LIST = "functionList";

// load runner admin cookie
export const LR_COOKIE = "lrCookie";
export const CREATE_PROJECT_SUCCESS = "CREATE_PROJECT_SUCCESS"

export const APPLICATION_KEY = "application";

export const LOADING = "Loading";
// datamap
export const DATAMAP_SUCCESS = 'SUCCESS';
export const DATAMAP_TITLE = 'title';
export const DATAMAP_KEYWORD = 'keyword';
export const DATAMAP_TAG = 'tag';
export const DATAMAP_CATEGOTY = 'category';
export const DATAMAP_UID = 'uid';

export const CURRENT_DATE =  moment();
export const DATE_FORMAT = ( date ) => {
    if ( date ) {
        return moment(date).format('YYYY-MM-DD');
    }
}

export const SEVEN_DAYS_AGO_FROM_CURRENT_DATE = moment().add(-7, "days");
export const ONE_MONTH_AGO_FROM_CURRENT_DATE = moment().add(-1, "month");