import React, {Component} from 'react';
import FlexBand, { FlexBandItem } from 'flexband'
import ln3 from 'ln3';
import { Button, Paper, } from '@material-ui/core';
import { Base64 } from 'js-base64';
import core from './system/core';
import ClientCard from './ClientCard';

let nextWindowId = 1; 

const windowIdBase = Math.round(1000 * Math.random()) + '.' + ( (new Date()).getTime() ) + '.';

const popWindows = [];

const macroId = "{{ID}}";
const macroDir = "{{DIR}}";

const baseTemplate = 
`
<head>
<style>
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
.container {
    width: 100%;
    height: 100%;
}
#app {
    position: absolute;
    height: auto;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    padding: 8px;
    margin: 10px;
    border-radius: 8px;
    background-color: #FFE0B2;
}
</style>
</head>
<body >
<div class="container" >
<div id="app" />
</div>
<script>
var clientId = "${macroId}";
var electron = require("electron");
</script>
<script type="text/javascript" src="${macroDir}/index_preact.js"></script>
</body>`;


const uriFor = (id) => {

    let s = baseTemplate;
    s = s.replace(macroId, id).replace(macroDir, core.scriptBase);

    return "data:text/html;base64," + Base64.encode(s);
}


export default class TestPanel extends Component {
    constructor (props, ...other) {
        super(props, ...other);

        this.state = {
            clients: [],
        }
    }

    componentDidMount() {
        this.mount = true;
        core.ipc.send("getClients");
        core.ipc.on("clientList", this.handleClientList);
    }

    componentWillUnmount() {
        this.moumt = false;
        core.ipc.removeListener("clientList", this.handleClientList);
    }

    handleClientList = (event, clients) => {
        if (this.mount) {
            console.log("Got client IDs: ", clients);
            this.setState({ clients: clients });
        }
    }

    handleClick = () => {
        const clientId = windowIdBase + (nextWindowId ++);

        const data = {
            window: {
                width: 300,
                height: 400,
                x: screen.width - 350,
                y: 50,
                transparent: true, 
                // autoHideMenuBar: true,
                // frame: false,
                webPreferences: {
                    webSecurity: false,
                },
                
            },
            clientId: clientId,
            location: uriFor(clientId),
        }
        core.ipc.send("newClient", data);
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
                <FlexBand>
                    { this.state.clients.map( client => (
                        <ClientCard 
                            key={ client } 
                            client={ client } 
                        />
                    ) ) }
                </FlexBand>
            </Paper>
            </div>
        );  
    }
}