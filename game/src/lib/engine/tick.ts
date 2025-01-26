import type {WebSocketServer} from './registerServer';

export function tick(io: WebSocketServer) {
	io.emit('hello', Date.now());
}
