import {next, willLive} from '../game/game';
import type {GridData} from '../types/grid';
import {applyPlots} from './plot';
import type {WebSocketServer} from './registerServer';

let grid: GridData = Array.from({length: 100}, () => Array.from({length: 100}, () => 0));
let generation = -1;

export function tick(io: WebSocketServer) {
	console.time('tick');
	generation++;
	grid = next(grid, willLive);
	applyPlots(grid);
	io.emit('snapshot', generation, grid);
	console.timeEnd('tick');
}
