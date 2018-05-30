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

const createWindow = () => {
    mainWindow = new BrowserWindow({width: 1500, height: 900})

    mainWindow.loadURL("http://localhost:8888")

    mainWindow.webContents.toggleDevTools();

    mainWindow.on('closed', () => { mainWindow = null; });
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

ipcMain.on("requestNewWindow", (event, data) => {
    console.log("NEW WINDOW: ", data);
    const newWindow = new BrowserWindow(
        data.window,
    );

    newWindow.loadURL(data.location);
} );



expApp.get("/test", (req, res) => {
    res.send('Express is open');
})

expApp.param('id', function (req, res, next, id) {
    console.log('CALLED ONLY ONCE');
    res.send("Your user id is " + id);
    res.end();
});
  
expApp.get('/user/:id', function (req, res, next) {
    console.log('although this matches');
    next();
    
});
  


expApp.listen(3030);

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

