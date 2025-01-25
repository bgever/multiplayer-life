import {Server} from 'socket.io';
import type {PluginOption} from 'vite';

export interface ClientSideEvents {
	join: (arg: string) => void;
}

export interface ServerSideEvents {
	hello: (time: number) => void;
}

export const webSocketServer: PluginOption = {
	name: 'WebSocketServer',
	configureServer(server) {
		if (!server.httpServer) {
			console.error('No http server found');
			return;
		}
		const io = new Server<ClientSideEvents, ServerSideEvents>(server.httpServer, {serveClient: false});

		console.log('WebSocket server started');

		io.on('connection', socket => {
			console.log('Connected:', socket.id);
		});

		setInterval(() => {
			io.emit('hello', Date.now());
		}, 1000);
	}
};
