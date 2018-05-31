const electron = require('electron');
const {webContents, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const os = require('os');
const fs = require("fs");
const express = require("express");
const expApp = express()
const expressApp = require("express-ws")(expApp)

const app = electron.app
const BrowserWindow = electron.BrowserWindow;

const clientDirectory = [];


const createWindow = () => {
    mainWindow = new BrowserWindow({width: 1500, height: 900})

    mainWindow.loadURL("http://localhost:8181")

    mainWindow.webContents.toggleDevTools();

    mainWindow.on('closed', () => { mainWindow = null; });
}

const Base64 = require("js-base64");
const FileUrl = require("file-url");

// let __dirname = path.resolve(path.dirname(''));

console.log("Base64: ", Base64 ? "OK!" : "NOT FOUND" );

if (__dirname) {
    console.log("Directory: ", __dirname);
}

let logs = {};

switch (os.platform()) {
    case 'aix': 
        break;

    case 'darwin': 
        break;

    case 'freebsd': 
        break;

    case 'linux': 
        break;

    case 'openbsd': 
        break;

    case 'sunos': 
        break;

    case 'win32': 
        break;

}


/** 
 * 
 * Retrieves a list of IDs of open client windows
 *  
 */

const listClients = () => {
    mainWindow.webContents.send("clientList", 
        clientDirectory.map( client => client.id ));
}    

ipcMain.on("getClients", listClients);


/**
 * Opens a new client window and sets it up
 * 
 */

ipcMain.on("newClient", (event, data) => {
    const newWindow = new BrowserWindow(
        data.window,
    );

    newWindow.loadURL(data.location);

    clientDirectory.push( {
        id: data.clientId,
        window: newWindow,
    } );

    listClients();

    newWindow.on('closed', () => { 
        clientDirectory.find( ( c, index ) => {
            if (c.window === newWindow) {
                clientDirectory.splice(index);
                listClients();
                return true;
            }
            return false;
        } );
    });
} );


ipcMain.on("clientUpdate", (event, data) => {
    mainWindow.webContents.send("clientUpdate", data);
});


ipcMain.on("testCmd", (event, data) => {
    console.log("TEST COMMAND: ", data);
} );

ipcMain.on("getBaseDir", event => {
    const base = __dirname ? __dirname : path.resolve(path.dirname(''));

    mainWindow.webContents.send("baseDir", {
        baseDir: base,
        scriptBase: FileUrl(path.join(base, "popup" ))
     });
});


// expApp.get("/test", (req, res) => {
//     res.send('Express is open');
// })

// expApp.param('id', function (req, res, next, id) {
//     console.log('CALLED ONLY ONCE');
//     res.send("Your user id is " + id);
//     res.end();
// });
  
// expApp.get('/user/:id', function (req, res, next) {
//     console.log('although this matches');
//     next();
    
// });
  


// expApp.listen(3031);

app.on('ready', createWindow);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

