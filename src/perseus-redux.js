import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (typeof PerseusRedux === "undefined") {
    window.PerseusRedux = {
        React, ReactDOM, App
    }
}
