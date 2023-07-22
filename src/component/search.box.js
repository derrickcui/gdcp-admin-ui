import React, { useState } from 'react';
import {Box, Grid, InputBase, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useStyles from "./search.box.css";


export default function SearchBox(props) {
    const classes = useStyles();
    const [ value, setValue ] = useState();

    const handleOnChange = (e) => {
        setValue(e.target.value);
        props.onChange(e.target.value);
    }

    const handleOnClick = () => {
        props.onClick();
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Box style={{width: 400}} className={classes.root} borderRadius={2} width={10} size="small">
                    <InputBase
                        className={classes.input}
                        placeholder="请输入关键词"
                        size="small"
                        inputProps={{'aria-label': 'search content', style: {fontSize: 14}}}
                        onChange={handleOnChange}
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                              // Do code here
                              ev.preventDefault();
                              handleOnClick();
                            }
                          }}
                    />
                    <IconButton type="submit" className={classes.iconButton} aria-label="search" size="small"  onClick={handleOnClick}>
                        <SearchIcon size="small"/>
                    </IconButton>
                </Box>
            </Grid>
        </Grid>
    );
}
