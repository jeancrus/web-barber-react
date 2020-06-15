import React, { useState } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import history from './services/history';
import './config/ReactotronConfig';
import GlobalStyle from './styles/global';
import { store, persistor } from './store';
import Routes from './routes';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from './store/context';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function App() {
    const classes = useStyles();
    const [appConfig, setAppConfig] = useState({
        loading: false,
    });
    return (
        <Provider store={store}>
            <AppContext.Provider value={{ appConfig, setAppConfig }}>
                <PersistGate persistor={persistor}>
                    <Router history={history}>
                        <GlobalStyle />
                        <Routes />
                        <ToastContainer autoClose={3000} />
                        <Backdrop
                            className={classes.backdrop}
                            open={appConfig.loading}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    </Router>
                </PersistGate>
            </AppContext.Provider>
        </Provider>
    );
}

export default App;
