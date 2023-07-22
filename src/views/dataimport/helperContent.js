import * as React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Document from "./document";

const data = [{
    "id": "12345678899",
    "uri": "http://sina.com.cn/a.html",
    "uriContentField": "content",
    "meta": {
        "key1": "value1",
        "key2": "value2"
    }
},
    {
        "id": "12345678899",
        "uri": "http://sina.com.cn/a.html",
        "uriContentField": "content",
        "meta": {
            "key1": "value1",
            "key2": "value2"
        }
    }
];
export default function HelpContent() {
    return (
        <Paper variant={"outlined"} elevation={1} style={{padding: 5}}>
            <Typography style={{fontWeight: 'bold', fontSize: 14}}>批量导入文件模板</Typography>
            <Document data={data}/>
        </Paper>
    );
}
