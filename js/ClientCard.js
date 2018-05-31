import React, {Component} from 'react';
import { Paper, Typography, Button } from '@material-ui/core';
import { green, red, indigo } from "@material-ui/core/colors" 
import core from './system/core';
import FlexBand, { FlexBandItem } from 'flexband';

const maxLogLength = 15;

let nextEventId = 1;

const bkColors = [
    green[100],
    red[200],
    "linear-gradient(to bottom right, #E8F5E9, #EF5350)",
    indigo[100],
    green[200],
    indigo[300],
    "linear-gradient(to bottom right, #E8EAF6, #C5CAE9)",
];


export default class ClientCard extends Component {
    constructor(props, ...other) {
        super(props, ...other);

        this.state = {
            log: []
        }
        
    }

    componentDidMount() {
        this.mount = true;
        core.ipc.on("clientUpdate", this.handleClientUpdate);
        core.ipc.send("getClientData", this.props.client);
    }

    componentWillUnmount() {
        this.mount = false;
        core.ipc.removeListener("clientUpdate", this.handleClientUpdate);
    }

    handleClientUpdate = (event, data) => {
        if (data && data.clientId === this.props.client) {

            const log = this.state.log;

            data.eventId = nextEventId ++;
            log.push(data);

            if (log.length > maxLogLength) {
                log.splice(0, log.length - maxLogLength);
                this.setState({ log: log  });
            }
        }
    }


    render() {
        const client = this.props.client;

        return (

            <Paper className="margin16 padding16">
                <Typography variant="title">
                    { "ID: " + client }
                </Typography>

                <FlexBand>
                    <FlexBandItem style={{ marginRight: 16 }}>
                        <Button onClick={ () => {
                            core.ipc.send("showClient", client)
                        } } >
                            Activate
                        </Button>
                    </FlexBandItem>
                    <FlexBandItem style={{ marginRight: 16 }}>
                        <Button onClick={ () => {
                            core.ipc.send("closeClient", client)
                        } } >
                            Close
                        </Button>
                    </FlexBandItem>
                    <FlexBandItem style={{ marginRight: 16 }}>
                        <Button onClick={ () => {
                            core.ipc.send("tickClient", { 
                                clientId: client,
                                color: bkColors[ Math.floor( bkColors.length * Math.random() ) ],
                            })
                        } } >
                            Send color
                        </Button>
                    </FlexBandItem>
                </FlexBand>
                {
                    this.state.log.map( e => (
                        <Typography key={e.eventId} variant="body1">
                            { (new Date(e.time)).toLocaleTimeString() + " : " + e.event }
                        </Typography>
                    ) )

                }
            </Paper>
        );
    }

}