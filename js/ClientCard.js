import React, {Component} from 'react';
import { Paper, Typography } from '@material-ui/core';

import core from './system/core';


export default class ClientCard extends Component {
    constructor(props, ...other) {
        super(props, ...other);

        this.state = {

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
            console.log("Client ", data.clientId, " updated: ", data);

        }
    }


    render() {
        console.log(this.props.client);

        return (

            <Paper className="margin16 padding16">
                <Typography variant="title">
                    { "ID: " + this.props.client }
                </Typography>
            </Paper>
        );
    }

}