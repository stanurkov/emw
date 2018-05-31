import React, {Component} from 'react';
import axios from "axios";
import ObservedObject from 'observed-object';
import { ipcRenderer } from 'electron';
import ln3 from 'ln3';

import KeyMapper from './keys';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const shiftKeys = {
    Shift: true,
    Ctrl: true,
    Alt: true,
    Meta: true,
};

class Core extends ObservedObject {

    constructor (template) {
        super(template);

        try {
            this.ipc = ipcRenderer;

            ipcRenderer.on("baseDir", (event, data) => {
                this.baseDir = data.baseDir;
                this.scriptBase = data.scriptBase;
                console.log("Got baseDir data: ", data);
            });

            ipcRenderer.send("getBaseDir");

            if (this.onStartCreate) this.onStartCreate();

            this.axios = axios;
            this.ln3 = ln3;

            this.shiftKeys = shiftKeys;

            this.isDevelopment = window.location.href.search("localhost") >= 0;

            this.modelsLoaded = {};

            this.userValid = false;

            this.nullModel = { id: -1 };
            this.dummy = {};

            this.keyShift = 1;
            this.keyCtrl = 2;
            this.keyAlt = 4;
            this.keyMeta = 8;
            this.isShiftPressed = false;
            this.isControlPressed = false;

            this.keyMapper = new KeyMapper();

        } catch (error) {

            if (this.onErrorCreate) this.onErrorCreate (error)

        } finally {

            if (this.onFinishCreate) this.onFinishCreate();
        }

    }


    /**
     * Default API endpoint prefix, normally it is "/api/", but it may be overwritten if e.g. API versioning is used
     * 
     */
    apiPrefix() {
        return "/api/";
    }


    /**
     * An wrapper for calling API endpoints with POST method by specifying all Axios 
     * parameters. 
     * 
     * A Promise object is returned as a result with preset error handler. 
     */
    apiPost(url, params, ...other) {
        return axios.post(core.apiPrefix() + url, params, ...other);
    }


    /**
     * An wrapper for calling API endpoints with GET method by specifying all Axios 
     * parameters. 
     * 
     * A Promise object is returned as a result with preset error handler. 
     */
    apiGet(url, params, ...other) {
        
        return axios.get(this.apiPrefix() + url, params, ...other);
    }


    /**
     * The default error handler which is supposed to handle all possible errors.
     * E.g. if an Authentication error is caught and a token authentication is used,
     * it is possible to try to refresh authentication token and continue to work
     * 
     * Generally, errors are very dependent on API implementation, so this hook must be 
     * overwritten more often than not
     * 
     */
    onApiError = (error, callData) => {
        console.warn("An error occurred while calling API endpoint", error);
    }

    /** 
    * a hook for returning user's default page depending on e.g. user type or even user name
    * note that adjustUserType is called before calling this hook, so an adjusted name is 
    * received here
    */
    userDefaultPage(actor) {
        return ""
    }


    /** 
     * a hook for adjusting user type depending on context 
    */
    adjustUserType(userType, userInfo) {
        return userType;
    }


    /**
    * a hook for returning user's default route name depending on e.g. user type or 
    * even user name note that adjustUserType is called before calling this hook, 
    * so an adjusted user type is received here
    */
    userTypeAsRoute(actor) {
        return actor;
    }


    /**
     *  Default method for loading Application's User object. 
     * 
     *  The code below is just an example of how it may be implemented. The key action is emitting 
     *  events such as "login" when stored authentication data is verified by the API and 
     * "loginRequired" when an authentication must be performed 
     *  
     */
    loadUser() {
        const needLogin = () => this.emit("loginRequired");

        if (this.loadUserCredentials()) {
            const self = this;
          
            this.apiGet('auth/user', {}).then((response) => {
                const data = response.data;

                if (data.authority) {
                    this.userInfo = data;
                    
                    this.emit("login", {
                        authenticated: true, 
                        userType: data.authority, 
                        userInfo: data,
                    });

                } else {
                    needLogin();
                }
            }).catch( error => {
                needLogin();
            });
                
        } else {
            needLogin();
        }
        
    }


    /**
     * Called when a user is authenticated by API, the "login" event must be emitted so the 
     * application's front-end gets notified 
     * 
     * Normally, authData must contain user name and the API response data 
     * 
     * @param {*} authData 
     */
    userAuthenticated(authData) {

    }

    loadUserCredentials(data) {
        let token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['X-Authorization'] = "Bearer " + token;
            return true;
        } 
        return false;
    }

    storeUserCredentials(data) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['X-Authorization'] = "Bearer " + data.token;
    }

    userLogin(credentials) {
        
        return this.apiPost(
            'auth/login', 
            credentials
        ).then( response => {
            const data = response.data;

            if (data) {
                console.log('Authenticated: ', data);
                
                this.storeUserCredentials(data);

                this.apiGet('auth/user', {}).then((response) => {
                    const data = response.data;
    
                    if (data.authority) {
                        this.userInfo = data;
                        
                        this.emit("login", {
                            authenticated: true, 
                            userType: data.authority, 
                            userInfo: data,
                        });
    
                    } else {
                        needLogin();
                    }
                });
    
            } 

        });
    } 


    logout() {

        if (this.userValid) {
            this.userValid = false;

            const {
                sessionId,
                privilegeId,
            } = this.user;

            this.user = new User();

            localStorage.lastSession = null;

            this.emit( "logout", null);

            axios.post('/api/logout', {
                session_id: sessionId,
            }).then((response)=>{
                const data = response.data;

                if (data && data.code > 0) {
                    console.log("logged off successfully");
                } else {
                    console.warn("An error while logging off: ", response.data);
                }
            }).catch((error)=>{
                console.warn("An error while logging off: ", error);
            });

        }

    }

    scrollToElement(id) {
        const el = document.getElementById(id);

        if (el && el.scrollIntoView) {
            el.scrollIntoView();
        }
    }

    searchById(array, id) {
        return (array) ? (array.find((item) => (item.id == id))) : undefined;
    }

    eventKeyModifiers(event) {
        return (event.shiftKey ? this.keyShift : 0) + 
            (event.ctrlKey ? this.keyCtrl : 0) +
            (event.altKey ? this.keyAlt : 0) +
            (event.metaKey ? this.keyMeta : 0);
    }

}


var core = new Core();


export default core;


