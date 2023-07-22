import * as React from 'react';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import {useState} from "react";

export default function SearchBar(props) {
    const [value, setValue] = useState('');

    const handleOnChange = (event) => {
        setValue(event.target.value);
        props.onChange(event.target.value);
    }

    const onCancelSearch = () => {
        setValue('');
        props.onCancelSearch('');
    }

    return (
        <div style={{border: '1px solid #ebebeb', maxWidth: 200, borderRadius: 5, padding: 2, paddingRight: 5}}>
            <InputBase
                size='small'
                placeholder="过滤字段"
                disablePadding={true}
                value={value}
                onChange={handleOnChange}
                inputProps={{ 'aria-label': 'search google maps', style: {fontSize: 14, padding: 5} }}
            />
            {value && value.trim().length > 0 && <IconButton type="button" aria-label="search" size='small' onClick={onCancelSearch} style={{width: 10, height: 10}}>
                <ClearIcon fontSize='small' style={{width: 15, height: 15}} color={"error"}/>
            </IconButton>}
        </div>
    );
}