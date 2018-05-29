import React from 'react';
import {render} from 'react-dom';
import { AppContext } from './common/Context';
import Main from './Main'; 


render(
    <AppContext.Provider value={{ appName: "My EMW App!" }}>
        <Main />
    </AppContext.Provider>
    , document.getElementById('app') );
