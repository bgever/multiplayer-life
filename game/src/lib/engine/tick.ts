import {next, willLive} from '../game/game';
import type {GridData} from '../types/grid';
import {applyPlots} from './plot';
import type {WebSocketServer} from './registerServer';

let grid: GridData = Array.from({length: 100}, () => Array.from({length: 100}, () => 0));
let generation = -1;

/**
 * Calculates each generation of the game of life, and sends the snapshot to all clients.
 */
export function tick(io: WebSocketServer) {
	console.time('tick');
	generation++;
	grid = next(grid, willLive);
	applyPlots(grid);
	// TODO: Rather than sending the snapshot every time, only send it on connection, and calculate client-side.
	// The server would then only send user interaction updates, to signal the plots.
	io.emit('snapshot', generation, grid);
	console.timeEnd('tick');
}
