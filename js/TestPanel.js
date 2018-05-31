import React, {Component} from 'react';
import FlexBand, { FlexBandItem } from 'flexband'
import ln3 from 'ln3';
import { Button, Paper, } from '@material-ui/core';
import { Base64 } from 'js-base64';
import core from './system/core';

let nextWindowId = 1; 

const windowIdBase = Math.round(1000 * Math.random()) + '.' + ( (new Date()).getTime() ) + '.';

const popWindows = [];

const macroId = "{{ID}}";
const macroDir = "{{DIR}}";

const baseTemplate = 
`
<head>
<script src="${macroDir}/test.js"></script>
</head>
<body>
<div id="app" />
<script>
var clientId = "${macroId}";
console.log("client ID:", clientId);
    var e = document.getElementById("app");
    if (e) {
        e.appendChild(document.createTextNode("Hi! My ID is " + clientId));
    }
</script>
</body>`;


const uriFor = (id) => {

    let s = baseTemplate;
    s = s.replace(macroId, id).replace(macroDir, core.scriptBase);

    return "data:text/html;base64," + Base64.encode(s);
}


export default class TestPanel extends Component {

    handleClick = () => {
        console.log("WINDOW: ", window);

        const data = {
            window: {
                width: 300,
                height: 400,
                x: screen.width - 350,
                y: 50,
                // autoHideMenuBar: true,
                // frame: false,
                webPreferences: {
                    webSecurity: false,
                }
            },
            location: uriFor(windowIdBase + (nextWindowId ++)),
        }
        core.ipc.send("requestNewWindow", data);
    }

    render() {


        return (
            <div className="padding16 layout-min-fill" >
            <Paper className="layout-fill" >
                <div className="padding16 layout-min-fill" >
                <Button variant="raised" onClick={this.handleClick} >
                    Create a test window
                </Button>
                </div>    
            </Paper>
            </div>
        );  
    }
}