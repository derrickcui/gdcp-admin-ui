import './App.css';
import Main from "./views/main";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import * as React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from "./views/login";
import {useEffect, useState} from "react";
import {AppContext} from "./privacy/AppContext";
import {MESSAGE_ERROR} from "./constant";
import {Snackbar, Typography} from "@mui/material";
import {Alert} from "@mui/lab";
import * as moment from "moment";
import BeatLoader from "react-spinners/BeatLoader";
const theme = createTheme();

function App() {
    const [ messageHist, setMessageHist] = useState([]);
    const [ message, setMessage ] = useState({
        id: '',
        type: MESSAGE_ERROR,
        text: "",
        timestamp: '',
    });
    const [application, setApplication] = useState('');
    const [open, setOpen] = React.useState(false);

    const { vertical, horizontal } ={
        vertical: 'top',
        horizontal: 'right',
    };

    useEffect(() => {
        let appName = window.location.pathname.split('/')[2];
        setApplication(appName);
    });

    useEffect(() => {
        if (message && message.text && message.text.trim() !== '') {
            setOpen(true);
            messageHist.push({
                ...message,
                id: uniqueId(),
                status: 'N',
                timestamp: moment.now()
            });
        }
    }, [message]);

    const uniqueId = () => {
        const dateString = Date.now().toString(36);
        const randomness = Math.random().toString(36).substr(2);
        return dateString + randomness;
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    if (!application || application === 'undefined' || application === '') {

        return <div style={{
            width: 300,
            height: 200,
            position: 'absolute',
            top:0,
            textAlign: "center",
            alignItems: 'center',
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto'}}>
            <BeatLoader color="#f41024" size={30} margin={5}/>
            <Typography style={{ fontSize: 14 }}>
                正在重新导入应用信息
            </Typography>
        </div>
    }

    const markAllRead = () => {
        let optMessageHist = JSON.parse(JSON.stringify(messageHist));
        for(let i=0; i<optMessageHist.length; i++) {
            if (optMessageHist[i].status === 'N') {
                optMessageHist[i].status = 'Y';
            }
        }

        setMessageHist(optMessageHist);
    }

    const markRead = (id) => {
        let optMessageHist = JSON.parse(JSON.stringify(messageHist));
        let msg = optMessageHist.filter(m => m.id === id);
        if (msg && msg.length > 0)
        msg[0].status = 'Y';

        setMessageHist(optMessageHist);
    }

    const clearAllMessage = () => {
        setMessageHist([]);
    }

    const globalContext = {
        messageHist,
        setMessage,
        application,
        markAllRead,
        clearAllMessage,
        markRead,
        message
    }

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <AppContext.Provider value={globalContext}>
                    <BrowserRouter basename={"/admin/" + application}>
                        <Routes>
                            <Route path={'/login'} element={<Login/>}/>
                            <Route path="*" element={<Main />} />
                        </Routes>
                    </BrowserRouter>
                </AppContext.Provider>
            </ThemeProvider>
            <Snackbar open={open}
                      anchorOrigin={{ vertical, horizontal }}
                      autoHideDuration={6000}
                      onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {message.text}
                </Alert>
            </Snackbar>
        </React.Fragment>
  );
}

export default App;
