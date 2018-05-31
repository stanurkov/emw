import React from 'preact';

export default class Main extends React.Component {
	constructor(props, ...other) {
		super(props, ...other);

		this.state = {
			color: "#FFE0B2"
		};

	}

	componentDidMount() {
		this.mount = true;
		const ipc = electron ? electron.ipcRenderer : null;

		if (ipc) {
			ipc.on("tick", this.handleTick);
		}
	}

	componentWillUnmount() {
		this.mount = false;
		const ipc = electron ? electron.ipcRenderer : null;

		if (ipc) {
			ipc.removeListener("tick", this.handleTick);
		}
	}

	handleTick = (event, data) => {
		console.log("Ticked! ", data);
		if (data.color) {
			this.setState({ color: data.color });
		}
	}

	sendUpdate(data) {
		const ipc = electron ? electron.ipcRenderer : null;

		if (ipc) {
			ipc.send( "clientUpdate", { 
				clientId: clientId,
				time: (new Date()).getTime(),
				...data,
			} );

		}
	}

	render() {
		const cid = clientId;

		const send = this.sendUpdate;

		const buttonName = (n) => (n === 0 ? "Left" : ( n === 2 ? "Right" : ( n === 1 ? "Middle" : "Button" + n )  )  );

		return (
			<div style={{ minHeight: "100%", background: this.state.color }}
				onMouseUp={ ( data ) => { send( { event: "MouseUp! (" + buttonName(data.button) + ") " + data.clientX + ":" + data.clientY,  } ) } }
				onMouseDown={ ( data ) => {  send( { event: "MouseDown! (" + buttonName(data.button) + ") " + data.clientX + ":" + data.clientY,  } ) } }
				onMouseMove={ ( data ) => {  send( { event: "MouseMove! " + data.clientX + ":" + data.clientY,  } ) } }
			>
				{ "Client ID is: " + cid }
				<br />
				{ "Click or move mouse over" }
				<br />
				<br />
				<button type="button" onclick={ () => send( { event: "Button Click Me!" } ) } >Click Me!</button>
				<br />
				<br />
				<button type="button" onclick={ () => send( { event: "Button Test!" } ) } >Test!</button>
			</div>
		);
	}

};

