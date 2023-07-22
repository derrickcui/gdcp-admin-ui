import axios from "axios";
import { makeUseAxios } from 'axios-hooks';

/************************************/
/*   Get datamap API               */
/************************************/
const getDistribute = axios.create({ baseURL: process.env.REACT_APP_DATAMAP_URL,
    method: "GET",
    //withCredentials: true
});

//setInterceptors(getDistribute);
export const useQueryDistribute = makeUseAxios({
    axios: getDistribute
});


/************************************/
/*   Get UserVolumn API               */
/************************************/
const getUserVolumn = axios.create({ baseURL: process.env.REACT_APP_DATAMAP_URL,
    method: "GET",
    withCredentials: true
});

setInterceptors(getDistribute);
export const useQueryUserVolumn = makeUseAxios({
    axios: getUserVolumn
});


/************************************/
/*   method to set interceptors     */
/************************************/
function setInterceptors(obj) {
    obj.interceptors.request.use(
        config => {
        //    config.headers.authorization = sessionStorage.getItem("auth") && JSON.parse(sessionStorage.getItem("auth")).token;
            config.headers['User-Session'] = sessionStorage.getItem("session");
            return config;
        },
        error => Promise.reject(error)
    );
}


/************************************/
/*   Get datamap API               */
/************************************/
const getDataMapApi = axios.create({ baseURL: process.env.REACT_APP_DATAMAP_URL,
    method: "GET",
    //withCredentials: true
});

setInterceptors(getDataMapApi);
export const useGetDataMapApi = makeUseAxios({
    axios: getDataMapApi
});


/************************************/
/*   Get datamap API               */
/************************************/
const getBillingApi = axios.create({ baseURL: process.env.REACT_APP_BILLING_URL,
    method: "GET",
    //withCredentials: true
});

setInterceptors(getBillingApi);
export const useGetBillingApi = makeUseAxios({
    axios: getBillingApi
});