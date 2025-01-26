import {Server} from 'socket.io';
import type {HttpServer} from 'vite';
import {listenSocket} from './events/socket-listener';
import type {ClientSideEvents, ServerSideEvents} from './events/spec';
import {removePlayer} from './state';
import {tick} from './tick';

const createServer = (httpServer: HttpServer) =>
	new Server<ClientSideEvents, ServerSideEvents>(httpServer, {serveClient: false});

export type WebSocketServer = ReturnType<typeof createServer>;
export type ServerSocket = Parameters<Parameters<WebSocketServer['use']>[0]>[0];

export function registerServer(httpServer: HttpServer) {
	const io = createServer(httpServer);

	console.log('WebSocket server started.');

	io.on('connection', socket => {
		console.log('Connected:', socket.id);

		listenSocket(socket, io);

		socket.on('disconnect', () => {
			console.log('Disconnected:', socket.id, socket.data.uuid);
			removePlayer(socket.data.uuid);
		});
	});

	// Tick the engine every second.
	const interval = setInterval(() => tick(io), 1000);

	return {io, interval};
}
