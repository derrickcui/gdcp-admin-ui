import React, { useEffect, useState } from 'react';
import {Grid, Link, Chip, Typography, Divider } from "@mui/material";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import ROUTES from "../../routes";
import {getRowText} from '../../../intl/provider';
import useStyles from "./index.css";



export default function User(props) {
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

            if ( props.item.highUserFeatures && props.item.highUserFeatures.length > 0 ) {
                setFeatures(props.item.highUserFeatures);
            } else if ( props.item.midUserFeatures && props.item.midUserFeatures.length > 0 ) {
                setFeatures(props.item.midUserFeatures);
            } else if ( props.item.lowUserFeatures && props.item.lowUserFeatures.length > 0 ) {
                setFeatures(props.item.lowUserFeatures);
            }
        }
    }, [ props ])

    const loadUserDetail = () => {
        history(ROUTES.APP_USER_SNAP.url + "/"  + removeHighlight(item.uid));
    }

    return (
        <Grid container spacing={1} className={classes.text}>
            <Grid item xs={5} md={2} xl={1} className={classes.labelLeft}>
                {getRowText("userID")}：
            </Grid>
            <Grid item xs={7} md={10} xl={11} className={classes.title}>
                <Link component="button" variant="body2" onClick={loadUserDetail}>
                    <div dangerouslySetInnerHTML={createMarkup(item.uid)} className={classes.docStyle}/>
                </Link>                
            </Grid>
            <Grid item xs={12} className={classes.chip}>
                <Chip size="small" label={<Typography className={classes.text}>{item.geography}</Typography>} />
                <Chip size="small" label={<Typography className={classes.text}>{item.ip}</Typography>}/>
                <Chip size="small" label={<Typography className={classes.text}>{getRowText("searchCount")}({item.searchCount})</Typography>}/>
                <Chip size="small" label={<Typography className={classes.text}>{getRowText("clickCount")}({item.clickCount})</Typography>}/>
                <Chip size="small" label={<Typography className={classes.text}>{getRowText("recentClickTime")}{moment(item.recentClickTime).format('YYYY-MM-MM hh:mm:ss')}</Typography>}/>
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
                 {getRowText("searchKeywords")}
            </Grid>
            <Grid item xs={7} md={10} xl={11} container direction="row" justify="flex-start" alignItems="flex-end" spacing={1}>
                {item.recentSearchKeywords && item.recentSearchKeywords.map((keyword, index) => {
                    return <Grid key={index} item>
                                <div dangerouslySetInnerHTML={createMarkup(keyword)}
                                                className={classes.docStyle}
                                                onClick={() => history(ROUTES.APP_SEARCH_SNAP.url+"/"
                                                        + removeHighlight(keyword))}
                                />                            
                        </Grid>
                })}
            </Grid>
            <Grid item xs={5} md={2} xl={1} className={classes.labelLeft}>
                {getRowText("readDoc")}
            </Grid>
            <Grid item xs={7} md={10} xl={11} container direction="row" justify="flex-start" alignItems="flex-end" spacing={1}>
                {item.recentReadDocs && item.recentReadDocs.map((doc, index) => {
                            return <Grid item key={index}>
                                <div dangerouslySetInnerHTML={createMarkup(doc)}
                                                className={classes.docStyle}
                                                onClick={() => history(ROUTES.APP_DATA_SNAP.url + "/" + + doc + "&&" + item.recentReadDocIds[index])}
                                />
                            </Grid>
                })}
            </Grid>

            <Grid item xs={5} md={2} xl={1} className={classes.labelLeft}>
                 {getRowText("clickTax")}
            </Grid>
            <Grid item xs={7} md={10} xl={11} container direction="row" justify="flex-start" alignItems="flex-end" spacing={1}>
                {item.topClickTax && item.topClickTax.map((doc, index) => {
                            return <Grid item key={index}>
                                <div dangerouslySetInnerHTML={createMarkup(doc)}
                                                className={classes.docStyle}
                                                onClick={() => history({
                                                    //pathname: `${path}/document`,
                                                    param: {
                                                    id: item.id,
                                                    query: doc
                                                    }
                                })}/>
                            </Grid>
                })}
            </Grid>

            <Grid item xs={5} md={2} xl={1} className={classes.labelLeft}>
                 {getRowText("clickTag")}
            </Grid>
            <Grid item xs={7} md={10} xl={11} container direction="row" justify="flex-start" alignItems="flex-end" spacing={1}>
                {item.topClickTag && item.topClickTag.map((doc, index) => {
                            return <Grid item key={index}>
                                <div dangerouslySetInnerHTML={createMarkup(doc)}
                                                className={classes.docStyle}
                                                onClick={() => history({
                                                    //pathname: `${path}/document`,
                                                    param: {
                                                    id: item.id,
                                                    query: doc
                                                    }
                                })}/>
                            </Grid>
                })}
            </Grid>

            <Grid item xs={12}>
                <Divider/>
            </Grid>
        </Grid>
    )
}