import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';

function renderRow(props) {
    const { data, index, style } = props;

    return (
        <ListItem style={style} key={index} component="div" disablePadding>
            <ListItemButton>
                <ListItemText primary={data[index]} />
            </ListItemButton>
        </ListItem>
    );
}

export default function VirtualizedList(props) {
    const { fields } = props;
    return (
        <Box
            sx={{ width: '100%', height: 400, maxWidth: 360, border: '1px solid red', bgcolor: 'background.paper' }}
        >
            <FixedSizeList
                height={40}
                width={360}
                itemSize={46}
                itemCount={fields.length}
                overscanCount={5}
                itemData={fields}
            >
                {renderRow}
            </FixedSizeList>
        </Box>
    );
}
