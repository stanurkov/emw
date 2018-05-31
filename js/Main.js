//Node JS imports
import React, {Component} from 'react';
import FlexBand, { FlexBandItem } from 'flexband'
import ln3 from 'ln3';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { MuiThemeProvider, Typography, } from '@material-ui/core';

// local imports

import core from "./system/core";
import TestPanel from './TestPanel';

require("../fonts/roboto.css");   

const theme = createMuiTheme({
    palette: {
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
          '"Segoe UI"',
        ],

        fontSize: 14,

    },
});


class Main extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loading: true,
            
            activePart: "left",
        };

        // console.log("window SIZE: ", window);
        // console.log("SCREEN object: ", screen);

    }

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
        window.addEventListener("keypress", this.handleKeyPress);

        core.on("keyDown", this.handleSpecialKeyDown);
        core.on("keyUp", this.handleSpecialKeyUp)
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keypress", this.handleKeyPress);

        window.removeEventListener("keyup", this.handleKeyUp);
    }

    handleKeyPress(event) {
        core.emit("keyPress", event);
    }

    handleKeyUp(event) {
        core.emit("keyUp", event);
    }

    handleKeyDown(event) {
        // console.log("key down: ", event);
        core.emit("keyDown", event);
    }

    handleSpecialKeyDown = (eventType, event) => {
        if (event.key === "Tab") {
            if (this.state.activePart == "left") {
                this.setState({activePart: "right"})
            } else {
                this.setState({activePart: "left"})
            }
        } else if (event.key === "Shift") {
            core.isShiftPressed = true;
        } else if (event.key == "Control") {
            core.isControlPressed = true;
        }
    }

    handleSpecialKeyUp = (eventType, event) => {
        if (event.key === "Shift") {
            core.isShiftPressed = false;
        } else if (event.key == "Control") {
            core.isControlPressed = false;
        }
    }

    render() {
        
        return (
            <MuiThemeProvider theme={theme}>
                <Typography variant="headline">
                    { ln3.text("hello.text", "Hello from Electron JS!") }                
                </Typography>
                <TestPanel />
            </MuiThemeProvider>
        );
    }
}

export default Main;
