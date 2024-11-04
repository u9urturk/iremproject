import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from "@material-tailwind/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ScrollProvider } from './context/ScrollContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>

        <BrowserRouter>
            <ThemeProvider>
                <ScrollProvider>
                    <App />
                </ScrollProvider>
            </ThemeProvider>
        </BrowserRouter>


    </Provider>

);

