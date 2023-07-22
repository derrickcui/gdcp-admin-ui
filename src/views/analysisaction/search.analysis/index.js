import React, { useState, useEffect, useContext } from 'react';
import {Grid,  Divider, Typography, Link, Button, Pagination} from '@mui/material';
import SearchBar from './search.bar';
import Result from './result';
import jwt_decode from "jwt-decode";
import {getRowText} from '../../../intl/provider';
import useStyles from "./index.css";
import {AppContext} from "../../../privacy/AppContext";
import {DATAMAP_SUCCESS, LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../../constant";
import {useQueryDistribute} from "../../../service/datamap";

export default function Search() {
    const classes = useStyles();
    const {application, setMessage } = useContext(AppContext);
    const [init, setInit] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [type, setType] = useState(0);
    const [minUserCnt, setMinUserCnt ] = useState();
    const [maxUserCnt, setMaxUserCnt ] = useState();
    const [page, setPage] = useState(1);
    const [userCount, setUserCount] = useState(false);
    const [ result, setResult ] = useState({});

    const [geography, setGeography] = useState("");
    const [tax, setTax] = useState("");
    const [tag, setTag] = useState("");
    const [sort, setSort] = useState("score");
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getSearchProfiler, loading: getSearchProfilerLoading, error: getSearchProfilerError}, getSearchProfilerApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getKeywordProfiler, loading: getKeywordProfilerLoading, error: getKeywordProfilerError}, getKeywordProfilerApi] = useQueryDistribute(
        {}, {manual: true});

    const [{data: getUserProfiler, loading: getUserProfilerLoading, error: getUserProfilerError, response: getUserProfileResponse}, getUserProfilerApi] = useQueryDistribute(
        {}, {manual: true});

      const [{data: getDataProfiler, loading: getDataProfilerLoading, error: getDataProfilerError}, getDataProfilerApi] = useQueryDistribute(
          {}, {manual: true});

    const rowPerPage = 5;

    const handleFacetSearch = (key, value) => {
        if ( key === 'geography' ) {
          if ( geography === value ) {
            setGeography("");
          } else {
            setGeography(value);
          }
        } else if ( key === 'tax' ) {
          if ( tax === value ) {
            setTax("");
          } else {
            setTax(value);
          }
        } else if ( key === 'tag' ) {
          if ( tag === value ) {
            setTag("");
          } else {
            setTag(value);
          }
        }
    }

    const handleSortChange = (value) => {
      setSort(value);
    }

    const handleChange = (event, value) => {
      setPage(value);
      searchKeyword(value);
    };

    const handleSubmit = () => {
      console.log("search keyword" + type)
      searchKeyword(1);
    }

    const searchKeyword = (curPage) => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;


        const appName = user.workspace + '_' + application;
        if ( keyword === '' ) {
            return;
        }

        let data = {
            keyword: keyword,
            page: curPage,
            rows: rowPerPage
        }

        if( type === 1 ) { // 关键词画像
            if ( userCount ) {
                data = {
                    ...data,
                    minUserCnt: minUserCnt,
                    maxUserCnt: maxUserCnt
                }
            }

            getKeywordProfilerApi({
                url: "/search/keyword-profile/" + appName,
                params: data
            });
         } else if ( type === 2 ) {  // 用户画像
            data = {
                ...data,
                geographies: geography,
                taxonomy: tax,
                tag: tag,
                sort: sort
            }

            getUserProfilerApi({
                url: "/search/user-profile/" + appName,
                params: data
            });
         } else if ( type === 3 ) { // 数据画像
            if ( userCount ) {
                data = {
                    ...data,
                    minUserCnt: minUserCnt,
                    maxUserCnt: maxUserCnt
                }
            }

            getDataProfilerApi({
                url: "/search/data-profile/" + appName,
                params: data
            });
         } else {
            getSearchProfilerApi({
                url: "/search/" + appName,
                params: data
            });
         }

         //setProcess(true);
    }

    useEffect(() => {
      if (getDataProfilerLoading === false) {
        //setProcess(false);
          if (getDataProfilerError) {
              setMessage({
                  type: MESSAGE_ERROR,
                  text: getRowText("getDataProfilerError")
              });
          } else if (getDataProfiler) {
              if(getDataProfiler.dmcode === DATAMAP_SUCCESS) {
                if ( getDataProfiler.status === 0 && getDataProfiler.result ) {
                  setResult(getDataProfiler.result)
                  setInit(false);
                }
              }
          }
      }
  }, [getDataProfilerLoading]);

         useEffect(() => {

           if (!getUserProfilerLoading) {
               if (typeof getUserProfileResponse === 'undefined') return;

               // setProcess(false);
               if (getUserProfilerError) {
                   setMessage({
                       type: MESSAGE_ERROR,
                       text: getRowText("getUserProfilerError")
                   });
               } else if (getUserProfiler) {
                   if(getUserProfiler.dmcode === DATAMAP_SUCCESS) {
                     if ( getUserProfiler.status === 0 && getUserProfiler.result ) {
                       setResult(getUserProfiler.result)
                       setInit(false);
                     }
                   }
               }
           }
       }, [getUserProfilerLoading]);

            useEffect(() => {
              if (getKeywordProfilerLoading === false) {
                //setProcess(false);
                  if (getKeywordProfilerError) {
                      setMessage({
                          type: MESSAGE_ERROR,
                          text: getRowText("getKeywordProfilerError")
                      });
                  } else if (getKeywordProfiler) {
                      if(getKeywordProfiler.dmcode === DATAMAP_SUCCESS) {
                        if ( getKeywordProfiler.status === 0 && getKeywordProfiler.result ) {
                          setResult(getKeywordProfiler.result)
                          setInit(false);
                        }
                      }
                  }
              }
          }, [getKeywordProfilerLoading]);

    useEffect(() => {
      if (getSearchProfilerLoading === false) {
        //setProcess(false);
          if (getSearchProfilerError) {
              setMessage({
                  type: MESSAGE_ERROR,
                  text: getRowText("getSearchProfilerError")
              });
          } else if (getSearchProfiler) {
              if(getSearchProfiler.dmcode === DATAMAP_SUCCESS) {
                if ( getSearchProfiler.status === 0 && getSearchProfiler.result ) {
                  setResult(getSearchProfiler.result)
                  setInit(false);
                }
              }
          }
      }
  }, [getSearchProfilerLoading]);

    useEffect(() => {
      searchKeyword(1);
    }, [ type, tax, tag, geography, sort ])


    return (
            <Grid container spacing={1}>
                <Grid item xs={12} className={classes.paper}>
                    <SearchBar onClick={handleSubmit} 
                              onChange={setKeyword} 
                              onLowerChange={setMinUserCnt} 
                              onUpperChange={setMaxUserCnt}
                              onTypeChange={setType}
                              limitUserCount={setUserCount}/>
                </Grid>
               <Grid item xs={12} container>
                  {type === 2 && !init && 
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={2} lg={1} style={{fontSize: 14}}>
                        {getRowText("locations")}
                      </Grid>
                      <Grid item xs={8} md={10} lg={11} style={{fontSize: 14}}
                           container direction="row" 
                           justify="flex-start" 
                           alignItems="flex-start"
                           spacing={1}>
                          {result && result.geography && Object.keys(result.geography).map((key, index) => {
                              return <Grid key={index} item>
                                      <Link
                                        component="button"
                                        variant="body2"
                                        className={key === geography? classes.selected: classes.label}
                                        onClick={() => handleFacetSearch('geography', key)}>{key}</Link>
                                    ({result.geography[key]})
                                </Grid>
                          })}
                      </Grid>
                      <Grid item xs={4} md={2} lg={1} style={{fontSize: 14}}>
                          {getRowText("useTax")}
                      </Grid>
                      <Grid item xs={8} md={10} lg={11} style={{fontSize: 14}}
                          container direction="row" 
                          justify="flex-start" 
                          alignItems="flex-start"
                          spacing={1}>
                         {result && result.tax && Object.keys(result.tax).map((key, index) => {
                            return <Grid key={index} item>
                                      <Link
                                        component="button"
                                        variant="body2"
                                        className={key === tax? classes.selected: classes.label}
                                        onClick={() =>  handleFacetSearch('tax', key)}>{key}</Link>
                                        ({result.tax[key]})
                                  </Grid>
                          })}
                      </Grid>
                      <Grid item xs={4} md={2} lg={1} style={{fontSize: 14}}>
                         {getRowText("useTag")}
                      </Grid>
                      <Grid item xs={8} md={10} lg={11} style={{fontSize: 14}}
                          container direction="row" 
                          justify="flex-start" 
                          alignItems="flex-start"
                          spacing={1}>
                          {result && result.tag && Object.keys(result.tag).map((key, index) => {
                            return <Grid key={index} item>
                                        <Link
                                            component="button"
                                            variant="body2"
                                            className={key === tag? classes.selected: classes.label}
                                            onClick={() =>  handleFacetSearch('tag', key)}>{key}</Link>
                                      ({result.tag[key]})
                                    </Grid>
                          })}
                      </Grid>
                      <Grid item xs={4} md={2} lg={1}  style={{fontSize: 14}}>
                         {getRowText("resultSort")}
                      </Grid>
                      <Grid item xs={8} md={10} lg={11} style={{fontSize: 14}}
                          container direction="row" 
                          justify="flex-start" 
                          alignItems="flex-start"
                          spacing={1}>
                          <Grid item>
                              <Button variant={"contained"} size="small" color={"primary"} disabled={sort === 'score'}
                                    onClick={() => handleSortChange('score')}>
                              <Typography style={{fontSize: 14}}>{getRowText("score")}</Typography>
                            </Button>
                          </Grid>
                          <Grid item>
                              <Button variant={"contained"} size="small" color={"primary"} disabled={sort === 'recentClickTime'}
                                      onClick={() => handleSortChange('recentClickTime')}>
                              <Typography style={{fontSize: 14}}>{getRowText("recentClickTime")}</Typography>
                            </Button>
                          </Grid>
                          <Grid item>

                              <Button variant={"contained"} size="small" color={"primary"} disabled={sort === 'searchCount'}
                                    onClick={() => handleSortChange('searchCount')}>
                              <Typography style={{fontSize: 14}}>{getRowText("searchCount")}</Typography>
                            </Button>
                          </Grid>
                          <Grid item>
                              <Button variant={"contained"} size="small" color={"primary"} disabled={sort === 'clickCount'}
                                    onClick={() => handleSortChange('clickCount')}>
                                <Typography style={{fontSize: 14}}>{getRowText("clickCount")}</Typography>
                            </Button>
                          </Grid>

                      </Grid>
                    </Grid>
                  }
                </Grid>

                <Grid item xs={12} container direction="row" style={{fontSize: 14}}>
                {!init &&
                  <Grid container direction="row" justify="space-between" alignItems="flex-end" spacing={1}>
                      <Grid item>
                        {getRowText("resultCount")} {result.numFound}
                      </Grid>

                      <Grid item>
                        <Divider/>
                      </Grid>
                  </Grid>
                }
                </Grid>
                
                <Grid item xs={12}>
                    <Result list={result.resultList}/>
                </Grid>
                <Grid item xs={12} container direction="row" justify="flex-end">
                    {!init && <Pagination
                        variant="outlined" 
                        shape="rounded"
                        page={page}
                        color="primary" 
                        size="small"
                        defaultPage={1}
                        boundaryCount={5}
                        count={Math.ceil(result.numFound/5)}
                        onChange={handleChange}/>}
                </Grid>
            </Grid>
    );
}