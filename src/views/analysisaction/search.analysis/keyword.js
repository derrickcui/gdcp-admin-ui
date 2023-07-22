import React, { useEffect, useState } from 'react';
import {Grid, Chip, Typography, Divider} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ROUTES from "../../routes";
import {getRowText} from '../../../intl/provider';
import useStyles from "./index.css";

export default function Keyword(props) {
    const classes = useStyles();
    const [item, setItem] = useState({});
    const history = useNavigate();
    const [ features, setFeatures ] = useState([]);

    const createMarkup = htmlString => ({
        __html: htmlString
    });

    const removeHighlight = (value) => {
        return value.replace(/<[^>]+>/g, '');
    }
    
    useEffect(() => {
        if( props.item ) {
            setItem(props.item);

            if ( props.item.highKeywordFeatures && props.item.highKeywordFeatures.length > 0 ) {
                setFeatures(props.item.highKeywordFeatures);
            } else if ( props.item.midKeywordFeatures && props.item.midKeywordFeatures.length > 0 ) {
                setFeatures(props.item.midKeywordFeatures);
            } else if ( props.item.lowKeywordFeatures && props.item.lowKeywordFeatures.length > 0 ) {
                setFeatures(props.item.lowKeywordFeatures);
            }
        }
    }, [ props ])

    return (
        <Grid container spacing={1} className={classes.text}>
            <Grid item xs={5} md={2} xl={1} className={classes.title}>
                {getRowText("searchKeyword")}
            </Grid>
            <Grid item xs={7} md={10} xl={11} className={classes.title}>
                <div dangerouslySetInnerHTML={createMarkup(item.keyword)}
                                                className={classes.docStyle}
                                                onClick={() => history(ROUTES.APP_SEARCH_SNAP.url +"/"
                                                    + removeHighlight(item.keyword))}
                                />
            </Grid>
            <Grid item xs={12} className={classes.chip2}>
                <Chip size="small" label={<Typography style={{fontSize:14}}>{getRowText("searchClickRate")}({item.searchClickRate})</Typography>} />
                <Chip size="small" label={<Typography style={{fontSize:14}}>{getRowText("avgSearchClickPosition")}({item.avgSearchClickPosition})</Typography>}/>
                <Chip size="small" label={<Typography style={{fontSize:14}}>{getRowText("searchUserCount")}({item.searchUserCount})</Typography>}/>
            </Grid>
            <Grid item xs={5} md={2} xl={1} className={classes.labelLeft}>
                {getRowText("dynamic")}
            </Grid>
            <Grid item xs={7} md={10} xl={11} container direction="row" justify="flex-start" alignItems="flex-end" spacing={1}>
                {
                    features.map((item, index) => {
                        return <Grid key={index} item>
                            <div key={index} dangerouslySetInnerHTML={createMarkup(item)} className={classes.docStyle}/>
                         </Grid>
                    })
                }
            </Grid>
            <Grid item xs={5} md={2} xl={1} className={classes.labelLeft}>
                {getRowText("searchUser")}
            </Grid>
            <Grid item xs={7} md={10} xl={11} container direction="row" justify="flex-start" alignItems="flex-end" spacing={1}>
                {item.recentSearchUsers && item.recentSearchUsers.map((user, index) => {
                    return <Grid key={index} item>
                                <div dangerouslySetInnerHTML={createMarkup(user)}
                                                className={classes.docStyle}
                                                onClick={() => history(ROUTES.APP_USER_SNAP.url + "/"  + removeHighlight(user))}
                                />
                        </Grid>
                })}
            </Grid>
            <Grid item xs={5} md={2} xl={1} className={classes.labelLeft}>
                {getRowText("relatedDoc")}
            </Grid>
            <Grid item xs={7} md={10} xl={11} container direction="row" justify="flex-start" alignItems="flex-end" spacing={1}>
                {item.relatedDocs && item.relatedDocs.map((doc, index) => {
                            return <Grid item key={index}>
                                <div dangerouslySetInnerHTML={createMarkup(doc)}
                                                className={classes.docStyle}
                                                onClick={() => history(ROUTES.APP_DATA_SNAP.url +"/"  + doc + "&&" + item.relatedDocIds[index])}
                                />
                            </Grid>
                })}
            </Grid>
            <Grid item xs={12}>
                <Divider/>
            </Grid>
        </Grid>
    )
}