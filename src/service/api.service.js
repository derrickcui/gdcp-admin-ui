import axios from "axios";
import { makeUseAxios } from 'axios-hooks';
import base64 from "base-64";


/************************************/
/*   Search API                     */
/************************************/
const searchAxios = axios.create({ baseURL: process.env.REACT_APP_SEARCH_SERVICE_URL,
    method: "POST",
    withCredentials: true
});
setInterceptors(searchAxios);
export const searchPostAxios = makeUseAxios({
    axios: searchAxios
});

/************************************/
/*   Read Document API              */
/************************************/
const documentAxios = axios.create({ baseURL: process.env.REACT_APP_SEARCH_SERVICE_URL + "/document/",
    method: "POST",
    withCredentials: true
});

setInterceptors(documentAxios);
export const useDocumentAxios = makeUseAxios({
    axios: documentAxios
});

/************************************/
/*   Get search config API          */
/************************************/
const searchGetAxios = axios.create({ baseURL: process.env.REACT_APP_SEARCH_SERVICE_URL,
    method: "GET",
    withCredentials: true
});

setInterceptors(searchGetAxios);
export const useSearchGetAxios = makeUseAxios({
    axios: searchGetAxios
});


/************************************/
/*   SearchEngine API               */
/************************************/
const searchEngineGetAxios = axios.create({ baseURL: process.env.REACT_APP_SEARCH_URL,
    method: "GET",
    withCredentials: true
});

setInterceptors(searchEngineGetAxios);
export const useSearchEngineGetAxios = makeUseAxios({
    axios: searchEngineGetAxios
});

/************************************/
/*   Get data service API          */
/************************************/
const dataServiceGetAxios = axios.create({ baseURL: process.env.REACT_APP_DATA_SERVICE_URL,
    method: "GET",
    withCredentials: true
});

setInterceptors(dataServiceGetAxios);
export const useDataServiceGetAxios = makeUseAxios({
    axios: dataServiceGetAxios
});


/************************************/
/*   Post data service API          */
/************************************/
const dataServicePostAxios = axios.create({ baseURL: process.env.REACT_APP_DATA_SERVICE_URL,
    method: "POST",
    withCredentials: true
});

setInterceptors(dataServicePostAxios);
export const useDataServicePostAxios = makeUseAxios({
    axios: dataServicePostAxios
});

/************************************/
/*   Delete data service API          */
/************************************/
const dataServiceDelAxios = axios.create({ baseURL: process.env.REACT_APP_DATA_SERVICE_URL,
    method: "DELETE",
    withCredentials: true
});

setInterceptors(dataServiceDelAxios);
export const useDataServiceDelAxios = makeUseAxios({
    axios: dataServiceDelAxios
});

/************************************/
/*   Delete data service API          */
/************************************/
const dataServicePutAxios = axios.create({ baseURL: process.env.REACT_APP_DATA_SERVICE_URL,
    method: "PUT",
    withCredentials: true
});

setInterceptors(dataServicePutAxios);
export const useDataServicePutAxios = makeUseAxios({
    axios: dataServicePutAxios
});
/************************************/
/*   Word cloud service API         */
/************************************/
const getWordCloudAxios = axios.create({ baseURL: process.env.REACT_APP_WORDCLOUD_SERVICE_URL,
    method: "GET",
    withCredentials: true
});

setInterceptors(getWordCloudAxios);
export const WordCloudGetAxios = makeUseAxios({
    axios: getWordCloudAxios
});

/************************************/
/*   Click Post API                  */
/************************************/
const postClickAxios = axios.create({ baseURL: process.env.REACT_APP_SEARCH_SERVICE_URL + "/click/",
    method: "POST",
    withCredentials: true
});

setInterceptors(postClickAxios);
export const usePostClickAxios = makeUseAxios({
    axios: postClickAxios
});

/************************************/
/*  Recommend API                   */
/************************************/
const recommendAxios = axios.create({ baseURL: process.env.REACT_APP_SEARCH_SERVICE_URL + "/recommend/data",
    method: "POST",
    withCredentials: true
});
setInterceptors(recommendAxios);
export const useRecommendAxios = makeUseAxios({
    axios: recommendAxios
});

/************************************/
/*  suggester API                   */
/************************************/
const suggesterAxios = axios.create({ baseURL: process.env.REACT_APP_SEARCH_SERVICE_URL + "/suggest",
    method: "GET",
    withCredentials: true
});
setInterceptors(suggesterAxios);
export const useSuggesterAxios = makeUseAxios({
    axios: suggesterAxios
});

/************************************/
/*  Solr Query API                  */
/************************************/
const queryAxios = axios.create({ baseURL: process.env.REACT_APP_QUERY_URL,
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        'Authorization': "Basic " + base64.encode(process.env.REACT_APP_QUERY_USERNAME + ":" + process.env.REACT_APP_QUERY_PASSWORD)
    }
});

export const useQueryAxios = makeUseAxios({
    axios: queryAxios
});


const queryClickAxios = axios.create({ baseURL: process.env.REACT_APP_QUERYCLICK_URL,
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        'Authorization': "Basic " + base64.encode(process.env.REACT_APP_QUERY_USERNAME + ":" + process.env.REACT_APP_QUERY_PASSWORD)
    }
});
export const useQueryClickAxios = makeUseAxios({
    axios: queryClickAxios
});


/************************************/
/*  data map API                   */
/************************************/
const dataMapAxios = axios.create({ baseURL: process.env.REACT_APP_DATAMAP_URL,
    method: "GET",
    withCredentials: true
});
setInterceptors(dataMapAxios);
export const useDataMapAxios = makeUseAxios({
    axios: dataMapAxios
});


/************************************/
/*  data service API                   */
/************************************/
const dataServiceAxios = axios.create({ baseURL: process.env.REACT_APP_DATA_SERVICE_URL,
    method: "POST",
    withCredentials: true
});
setInterceptors(dataServiceAxios);
export const useDataServiceAxios = makeUseAxios({
    axios: dataServiceAxios
});

/************************************/
/*   method to set interceptors     */
/************************************/
function setInterceptors(obj) {
    obj.interceptors.request.use(
        config => {
            config.headers.authorization = sessionStorage.getItem("auth") && JSON.parse(sessionStorage.getItem("auth")).token;
            config.headers['User-Session'] = sessionStorage.getItem("session");
            return config;
        },
        error => Promise.reject(error)
    );
}


/************************************/
/*  favorite 分页查询                   */
/************************************/
 const favoriteAxios = axios.create({ baseURL: process.env.REACT_APP_DATAMAP_URL,
    method: "GET",
    withCredentials: true
});
setInterceptors(favoriteAxios);

export const useFavoriteAxios = makeUseAxios({
    axios: favoriteAxios
});


/************************************/
/*  favorite API                   */
/************************************/
const favoritePostAxios = axios.create({ baseURL: process.env.REACT_APP_DATAMAP_URL+"/management/user-click",
    method: "POST",
    withCredentials: true
});
setInterceptors(favoritePostAxios);

export const usePostFavoriteAxios = makeUseAxios({
    axios: favoritePostAxios
});


/************************************/
/*  Solr Query API                  */
/************************************/
const solrQueryAxios = axios.create({ baseURL: process.env.REACT_APP_SOLR_URL,
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        'Authorization': "Basic " + base64.encode(process.env.REACT_APP_SOLR_USERNAME_PASSWORD)
    }
});

export const useSolrQueryAxios = makeUseAxios({
    axios: solrQueryAxios
});


/************************************/
/*   Get client info API          */
/************************************/
const userServiceGetAxios = axios.create({ baseURL: process.env.REACT_APP_AUTH_URL,
    method: "GET",
    withCredentials: true
});

setInterceptors(userServiceGetAxios);
export const useUserServiceGetAxios = makeUseAxios({
    axios: userServiceGetAxios
});
