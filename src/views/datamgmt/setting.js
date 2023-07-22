import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import {CardContent} from "@mui/material";
import {forwardRef, useContext, useEffect, useImperativeHandle, useState} from "react";
import {DataManagementContext} from "../../privacy/DataManagentContext";
import { FixedSizeList } from 'react-window';
import Typography from "@mui/material/Typography";
import {ConfigContext} from "./ConfigProvider";
import SearchBar from '../../component/filter';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}


const Setting = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        handleSubmit () {
            setStep(2);
            setReturnFields(right);
        }
    }))

    const {setStep, setReturnFields, returnFields} = useContext(ConfigContext);

    const {fields} = useContext(DataManagementContext);
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [orgLeft, setOrgLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
    const [searched, setSearched] = useState("");

    useEffect(() => {
        setLeft(fields.filter(m => !returnFields.includes(m)).sort());
        let lleft = fields.filter(m => !returnFields.includes(m)).sort();
        setOrgLeft(JSON.parse(JSON.stringify(lleft)));
        setRight(returnFields);
    }, [fields, returnFields]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };


    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        let newRight = right.concat(leftChecked);
        setRight(newRight.sort());
        let lleft = not(left, leftChecked);
        setLeft(lleft);
        let oleft = not(orgLeft, leftChecked);
        setOrgLeft(oleft);
        setChecked(not(checked, leftChecked));
        setReturnFields(newRight);
    };

    const handleCheckedLeft = () => {
        let newLeft = left.concat(rightChecked);
        setLeft(newLeft.sort());
        setOrgLeft(JSON.parse(JSON.stringify(newLeft)));
        let newRight = not(right, rightChecked);
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
        setReturnFields(newRight);
    };

    function renderRow(props) {
        const { data, index, style } = props;

        return (
            <ListItem style={style} key={index} component="div" disablePadding dense>
                <ListItemIcon>
                    <Checkbox
                        checked={checked.indexOf(data[index]) !== -1}
                        tabIndex={-1}
                        disableRipple
                        size={"small"}
                        onChange={handleToggle(data[index])}
                        inputProps={{
                            'aria-labelledby': index,
                        }}
                    />
                </ListItemIcon>
                <ListItemText id={index} primary={<Typography style={{fontSize: 14}}>{data[index]}</Typography>}/>
            </ListItem>
        );
    }

    const customList = (title, items, side) => (
        <Card variant={"outlined"}>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        size={"small"}
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                action={ side === 'left' &&
                    <SearchBar
                        value={searched}
                        onChange={(searchVal) => requestSearch(searchVal)}
                        onCancelSearch={() => cancelSearch()}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} 已选择`}
            />
            <Divider/>
            <CardContent>
                <FixedSizeList
                    height={400}
                    width={400}
                    itemSize={46}
                    itemCount={items.length}
                    overscanCount={5}
                    itemData={items}
                >
                    {(props) => renderRow({...props, side})}
                </FixedSizeList>
            </CardContent>
        </Card>
    );

    const requestSearch = (searchedVal) => {
        const filteredRows = orgLeft.filter((row) => {
            return row.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setLeft(filteredRows);
    };

    const cancelSearch = () => {
        setSearched("");
        setLeft(orgLeft);
    };

    return (
        <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item>
                {customList('内容字段', left, 'left')}
            </Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                    </Grid>
                </Grid>
            <Grid item>{customList('返回字段', right, 'right')}</Grid>
        </Grid>
    );
})

export default Setting;