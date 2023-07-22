import React, {useEffect, useContext, useState} from 'react';
import {Grid, Paper, Divider, Chip } from '@mui/material';
import EllipsisText from "react-ellipsis-text";
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import {
    DATAMAP_SUCCESS
}  from '../constant/index';
import {useQueryDistribute} from '../service/datamap';
import {LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../constant";
import ROUTES from "../views/routes";
import makeStyle from "./profile.css";
import {AppContext} from "../privacy/AppContext";

const USER_PROFILE = 'userProfile';
const KEYWORD_PROFILE = 'keywordProfile';
const DATA_PROFILE = 'dataProfile';

export default function Profile(props) {
    const [ feature, setFeature ] = useState([]);
    const [ taxonomy, setTaxonomy ] = useState([]);
    const [ keyword, setKeyword ] = useState([]);
    const [ docList, setDocList ] = useState([]);

    const [ tag, setTag ] = useState([]);
    const classes = makeStyle();
    const history = useNavigate();

    const {application, setMessage} = useContext(AppContext);

    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));
    const [{data: getProfile, loading: getProfileLoading, error: getProfileError, response}, getProfileApi] = useQueryDistribute(
        {}, {manual: true});

    useEffect(() => {
        if ( props.keyword !== '' ) {
            const user = auth && auth.token && jwt_decode(auth.token);
            if (user === 'undefined' || user === null) return;
            if (!application || application === 'undefined' || application === null) return;


            getProfileApi({
                url: '/click/profile',
                params: {
                    appName: user.workspace + '_' + application,
                    keyword: props.keyword,
                    profileType: props.type
                }
            });
        }
    }, [ props.uid ]);

    useEffect(() => {
        if (!getProfileLoading) {
            if (typeof response === 'undefined') return;

            if (getProfileError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: "获取动态特征数据失败"
                });
            } else if (typeof getProfile === 'undefined') {
                console.log("dddddddddddddddd");
                return;
            } else if (getProfile && getProfile.dmcode) {
                if(getProfile.dmcode === DATAMAP_SUCCESS) {
                    let data = getProfile.result;
                    if (!data) return;

                    if ( props.type === USER_PROFILE ) {
                        if ( data.hasOwnProperty('highUserFeatures') && data.highUserFeatures.length > 0 ) {
                            setFeature(data.highUserFeatures);
                        } else if ( data.hasOwnProperty('midUserFeatures') && data.midUserFeatures.length > 0 ) {
                            setFeature(data.midUserFeatures);
                        } else if ( data.hasOwnProperty('lowUserFeatures') && data.lowUserFeatures.length > 0 ) {
                            setFeature(data.lowUserFeatures);
                        }
                        setTaxonomy(data.topClickTax);
                        setTag(data.topClickTag);
                        setKeyword(data.recentSearchKeywords);
                        let recentDocList = typeof data.recentReadDocs !== 'undefined' ?data.recentReadDocs.map((item, index) => {
                            return {
                                id: data.recentReadDocIds[index],
                                title: item
                            }
                        }) : [];
                        setDocList(recentDocList)
                    } else if ( props.type === KEYWORD_PROFILE ) {
                        if ( data.hasOwnProperty('highKeywordFeatures') && data.highKeywordFeatures.length > 0 ) {
                            setFeature(data.highKeywordFeatures);
                        } else if ( data.hasOwnProperty('midKeywordFeatures') && data.midKeywordFeatures.length > 0 ) {
                            setFeature(data.midKeywordFeatures);
                        } else if ( data.hasOwnProperty('lowKeywordFeatures') && data.lowKeywordFeatures.length > 0 ) {
                            setFeature(data.lowKeywordFeatures);
                        }
                    } else if ( props.type === DATA_PROFILE ) {
                        if ( data.hasOwnProperty('highDocFeatures') && data.highDocFeatures !== '' ) {
                            setFeature(data.highDocFeatures);
                        } else if ( data.hasOwnProperty('midDocFeatures') && data.midDocFeatures !== '' ) {
                            setFeature(data.midDocFeatures);
                        } else if ( data.hasOwnProperty('lowDocFeatures') && data.lowDocFeatures !== '' ) {
                            setFeature(data.lowDocFeatures);
                        }
                    }
                }
            }
        }
    }, [getProfileLoading, getProfile]);

    return(
        <Paper elevation={0} className={classes.root} variant="outlined">
            <Grid container direction="column" spacing={1}>
                <Grid item container direction="row" spacing={1}>
                    <Grid item>
                        动态特征:
                    </Grid>
                    <Grid item
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={1}
                            >
                        {feature && feature.length > 0 && feature.map(item => {
                            return <Grid item>
                                        {props.type === DATA_PROFILE? <Chip variant="outlined" size="small" label={<EllipsisText text={item} length={"40"} tooltip={item}/>}/>:<Chip variant="outlined" size="small" label={item} clickable/>}
                                    </Grid>
                        })}
                    </Grid>
                </Grid>
                { props.type === USER_PROFILE &&
                <Grid container>
                    <Grid item>
                        <Divider/>
                    </Grid>
                    <Grid item container direction="column" spacing={1} style={{paddingLeft: 5}}>
                        <Grid item container direction="row">
                            <Grid item>
                                最近搜索的关键词:
                            </Grid>
                            <Grid item>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={1}
                                    >
                                    {typeof keyword !== 'undefined' && keyword && keyword.length > 0 && keyword.map(item => {
                                        return <Grid item><Chip variant="outlined" size="small" label={item}
                                                    onClick={() => history(ROUTES.APP_SEARCH_SNAP.url +"/" + item)}/>
                                                </Grid>
                                    })}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                            <Grid item>
                                最近访问的数据:
                            </Grid>
                            <Grid item>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={1}
                                    >
                                    {typeof docList !== 'undefined' && docList && docList.length > 0 && docList.map(item => {
                                        return <Grid item>
                                                    <Chip variant="outlined" size="small" label={item.title}
                                                        onClick={() => history(ROUTES.APP_DATA_SNAP.url + "/" + item.title + "&&" + item.id)}/>
                                                </Grid>
                                    })}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                            <Grid item>
                                点击最多的分类:
                            </Grid>
                            <Grid item>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={1}
                                    >
                                    {typeof taxonomy !== 'undefined' && taxonomy && taxonomy.length > 0 && taxonomy.map(item => {
                                        return <Grid item><Chip variant="outlined" size="small" label={item}/>
                                                </Grid>
                                    })}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                            <Grid item>
                                点击最多的标签:
                            </Grid>
                            <Grid item>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={1}
                                    >
                                    {typeof tag !== 'undefined' && tag && tag.length > 0 && tag.map(item => {
                                        return <Grid item>
                                                    <Chip variant="outlined" size="small" label={item}/>
                                                </Grid>
                                    })}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>}
            </Grid>
        </Paper>
    )
}