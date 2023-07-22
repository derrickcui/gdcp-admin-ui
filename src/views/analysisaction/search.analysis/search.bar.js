import React, { useState } from 'react';
import {Grid, Collapse, TextField, FormControlLabel, Switch, Typography} from '@mui/material';
import SearchBox from '../../../component/search.box';
import { AntTabs, AntTab } from '../../../component/ume.tab';
import useStyles from "./search.bar.css";


export default function SearchBar(props) {
  const [checked, setChecked] = useState(false);
  const [min, setMin ] = useState();
  const [max, setMax ] = useState();
  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    props.onTypeChange(newValue);
  };

  const handleKeywordChanged = (value) => {
    props.onChange(value);
  }

  const handleMinChanged = (e) => {
    setMin(e.target.value);
    props.onLowerChange(e.target.value);
  }

  const handleMaxChanged = (e) => {
    setMax(e.target.value)
    props.onUpperChange(e.target.value);
  }

  const handleChange = () => {
    setChecked((prev) => !prev);
    props.limitUserCount((prev) => !prev)
  };

  return (
            <Grid className={classes.paper} container direction="row" justify="center" alignItems="flex-end">
                <Grid item style={{width: '100%'}}>
                    <SearchBox onChange={handleKeywordChanged} onClick={props.onClick}/>
                </Grid>
                <Grid item className={classes.searchBar}>
                    {(value === 1 || value === 3) && <FormControlLabel
                        control={<Switch checked={checked} onChange={handleChange} size="small"/>}
                        label={<Typography style={{fontSize: 14}}>过滤用户数</Typography>}
                    />}
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={checked}>
                        <Grid container direction="row" justify="center" alignItems="flex-end" spacing={3}> 
                            <Grid item style={{fontSize: 14}}>
                                搜索用户数：
                            </Grid>
                            <Grid item>
                                  <TextField
                                      id="min"
                                      size="small"
                                      type="Number"
                                      value={min}
                                      onChange={handleMinChanged}
                                      inputProps={{ min: "0", max: "99999", step: "10" }}
                                      InputProps={{ style: { fontSize: 12 } }}
                                  />
                              </Grid>
                              <Grid item>
                                  <TextField
                                      id="max"
                                      size="small"
                                      type="Number"
                                      value={max}
                                      onChange={handleMaxChanged}
                                      className={classes.textField}
                                      inputProps={{ min: "0", max: "99999", step: "10" }}
                                      InputProps={{ style: { fontSize: 12 } }}
                                  />
                              </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
                <Grid item xs={12}>
                    <AntTabs value={value} onChange={handleTabChange} aria-label="ant example">
                        <AntTab label="全部"/>
                        <AntTab label="关键词画像"/>
                        <AntTab label="用户画像"/>
                        <AntTab label="数据画像"/>
                    </AntTabs>
                </Grid>
            </Grid>
  );
}