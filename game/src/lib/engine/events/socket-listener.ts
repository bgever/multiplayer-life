import * as d3 from 'd3';
import {validate} from 'uuid';
import type {ServerSocket, WebSocketServer} from '../registerServer';
import {addPlayer, getPlayers, pushPlot} from '../state';
import type {Player} from './spec';

export function listenSocket(socket: ServerSocket, io: WebSocketServer) {
	socket.on('join', uuid => {
		if (!validate(uuid)) {
			console.warn('Invalid UUID:', uuid);
			return;
		}
		console.log('Player joining:', uuid);
		socket.data.uuid = uuid;

		const hue = Math.floor(Math.random() * 360);
		const color = d3.hsl(hue, 1, 0.5).formatHex();
		console.log('Player color:', hue, color);

		const player: Player = {uuid: uuid, color};

		addPlayer(player);

		console.log('Player joined:', player);

		io.emit('players', getPlayers());
	});

	socket.on('plot', (position, pattern) => {
		console.log('Player plotting:', socket.data.uuid, position, pattern);
		const player = getPlayers().find(p => p.uuid === socket.data.uuid);
		if (!player) {
			console.warn('Player not found:', socket.data.uuid);
			return;
		}
		pushPlot({player, position, pattern});
	});
}
