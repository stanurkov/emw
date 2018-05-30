import React, {Component} from 'react';
import FlexBand, { FlexBandItem } from 'flexband'
import ln3 from 'ln3';
import { Button, Paper, } from '@material-ui/core';

import core from './system/core';

export default class TestPanel extends Component {

    handleClick = () => {
        console.log("WINDOW: ", window);

        const data = {
            window: {
                width: 300,
                height: 200,
                x: screen.width - 350,
                y: 50,
                autoHideMenuBar: true,
                webPreferences: {
                    additionalArguments: 
                        "add-argyments",
                    
                }
            },
            location: "file:///c|/usr/simple.html",
        }
        core.ipc.send("requestNewWindow", data);
    }

    render() {


        return (
            <div className="margin16 layout-min-fill" >
            <Paper className="padding16 layout-min-fill" >
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