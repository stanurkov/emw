import React from 'react';
import core from '../system/core';

export const AppContext = React.createContext( {
    appName: "Sample App",
    appCore: core,
} );

export const RouterContext = React.createContext( { root: "/", path: "#" } );

export const UserContext = React.createContext( { name: "", access: ""  } );

export const LanguageContext = React.createContext("en");

export const PageLoaderContext = React.createContext( null );

export const MainMenuContext = React.createContext( null );

