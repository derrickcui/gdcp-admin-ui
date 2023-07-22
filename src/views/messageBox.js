import React, {useContext, useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import moment from "moment";
import {AppContext} from "../privacy/AppContext";

export default function MessageBox() {
    const {messageHist, markRead, markAllRead, clearAllMessage} = useContext(AppContext);
    const [itemList, setItemList] = useState([]);

    useEffect(() => {
        messageHist.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1)
    }, [messageHist])

    return (
        <div style={{width: 300, minHeight: 500, maxHeight: 600, color: 'black'}}>
            <div style={{display: 'flex', justifyContent:'space-around'}}>
                <Button variant="text" disabled={messageHist.length === 0} style={{fontSize: 12}} onClick={markAllRead}>
                    <Typography style={{color: "white", fontSize: 12}}>标注所有已读</Typography>
                </Button>
                <Button variant="text" disabled={messageHist.length === 0} style={{}} onClick={clearAllMessage}>
                    <Typography style={{color: "white", fontSize: 12}}>清楚所有</Typography>
                </Button>
            </div>
            <Grid container direction={"column"} spacing={1}>
                <div style={{overflowY:'scroll', height: 500, paddingLeft: 10}}>
                    {messageHist && messageHist.length > 0 && messageHist.map((item, index) => {
                        return <Grid item key={index}><div key={index} style={{display: 'flex', flexDirection: 'row', columnGap: 10, justifyContent:'center', rowGap: 5}}>
                            {item.type === 'success' ? <CheckCircleOutlineIcon color="success"/>:<ErrorOutlineIcon color="error"/>}
                            <Grid container spacing={0} direction={"column"}>
                                <Grid item>
                                    <Button variant="text" disabled={item.status === 'Y'} onClick={() => markRead(item.id)}>
                                        <Typography style={{fontSize: 12,
                                            color: (item.status === 'N'? 'white':'grey'),
                                            fontWeight: (item.status === 'N'? 'bold':'normal')}}
                                        >
                                            {item.text}
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Typography style={{fontSize: 12, color: (item.status === 'N'? 'white':'grey')}}>
                                        {moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div></Grid>
                    })}</div>
            </Grid>
        </div>
    )
}