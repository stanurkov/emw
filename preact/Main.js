import React from 'preact';

export default class Main extends React.Component {

	sendUpdate(data) {
		const ipc = electron ? electron.ipcRenderer : null;

		if (ipc) {
			ipc.send( "clientUpdate", { 
				clientId: clientId,
				...data,
			} );

		}
	}


	render() {
		const cid = clientId;

		const send = this.sendUpdate;

		return (
			<div style={{ minHeight: "100%" }}
				onClick={ () => { send( { event: "Click!" } ); } }
			>
				{ "Client ID is: " + cid }
			</div>
		);
	}

};

