import React, { useEffect, useState } from 'react';
import {Grid, Chip, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {getRowText} from '../../../intl/provider';
import useStyles from "./index.css";
import ROUTES from "../../routes";

export default function Data(props) {
    const classes = useStyles();
    const [item, setItem] = useState({});
    const [ features, setFeatures ] = useState([]);

    const history = useNavigate();

    const createMarkup = htmlString => ({
        __html: htmlString
    });

    const removeHighlight = (value) => {
        return value.replace(/<[^>]+>/g, '');
    }

    useEffect(() => {
        console.log("data result")
        if( props.item ) {
            setItem(props.item);

            if ( props.item.highDocFeatures && props.item.highDocFeatures.length > 0 ) {
                setFeatures(props.item.highDocFeatures);
            } else if ( props.item.midDocFeatures && props.item.midDocFeatures.length > 0 ) {
                setFeatures(props.item.midDocFeatures);
            } else if ( props.item.lowDocFeatures && props.item.lowDocFeatures.length > 0 ) {
                setFeatures(props.item.lowDocFeatures);
            }
        }
    }, [ props ])

    return (
        <Grid container spacing={1} className={classes.text}>
            <Grid item xs={12} className={classes.title}>
                <div dangerouslySetInnerHTML={createMarkup(item.title)}
                                                className={classes.docstyle}
                                                onClick={() => history(ROUTES.APP_DATA_SNAP.url + item.title + "&&" + item.docId)}
                />
            </Grid>
            <Grid item xs={12} className={classes.chip}>
                <Chip size="small" label={<Typography style={{fontSize: 14}}>{getRowText("readUserCount")}({item.readUserCount})</Typography>} />
                <Chip size="small" label={<Typography style={{fontSize: 14}}>{getRowText("avgReadTime")}({item.avgReadTime})</Typography>}/>
            </Grid>
            <Grid item xs={5} md={2} xl={1} className={classes.labelLeft}>
                 {getRowText("dynamic")}
            </Grid>
            <Grid item xs={7} md={10} xl={11} container direction="row" justify="flex-start" alignItems="flex-end" spacing={1}>
                {
                    features.map((item, index) => {
                        return <Grid key={index} item>
                            <div key={index} dangerouslySetInnerHTML={createMarkup(item)} className={classes.docstyle}/>
                         </Grid>
                    })
                }
            </Grid>
            <Grid item xs={5} md={2} xl={1} className={classes.labelLeft}>
                {getRowText("readUser")}
            </Grid>
            <Grid item xs={7} md={10} xl={11} container direction="row" justify="flex-start" alignItems="flex-end" spacing={1}>
                {item.recentReadUsers && item.recentReadUsers.map((user, index) => {
                    return <Grid key={index} item>
                                <div dangerouslySetInnerHTML={createMarkup(user)}
                                                className={classes.docstyle}
                                                onClick={() => history.push(`${process.env.PUBLIC_URL}/analysis/user.stat/user.snap/` + removeHighlight(user))}
                                />
                        </Grid>
                })}
            </Grid>
            <Grid item xs={5} md={2} xl={1} className={classes.labelLeft}>
                {getRowText("relatedKeyword")}
            </Grid>
            <Grid item xs={7} md={10} xl={11} container direction="row" justify="flex-start" alignItems="flex-end" spacing={1}>
                {item.relatedKeywords && item.relatedKeywords.map((keyword, index) => {
                            return <Grid item key={index}>
                                        <div dangerouslySetInnerHTML={createMarkup(keyword)}
                                                className={classes.docstyle}
                                                onClick={() => history.push(`${process.env.PUBLIC_URL}/analysis/search.stat/keyword/`
                                                 + removeHighlight(keyword))}
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