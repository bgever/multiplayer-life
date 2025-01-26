import {next, willLive} from '../game/game';
import type {GridData} from '../types/grid';
import type {WebSocketServer} from './registerServer';
import {popPlots} from './state';

let grid: GridData = Array.from({length: 100}, () => Array.from({length: 100}, () => ({color: null}) as const));
let generation = -1;

function applyPlots() {
	const plots = popPlots();
	plots.forEach(p => {
		const pattern = patterns[p.pattern];
		pattern.forEach((row, y) => {
			row.forEach((pixel, x) => {
				if (pixel === 0) return;
				grid[p.position[0] + y][p.position[1] + x] = {color: pixel === 8 ? p.player.color : null};
			});
		});
	});
}

export function tick(io: WebSocketServer) {
	generation++;
	grid = next(grid, willLive);
	applyPlots();
	io.emit('snapshot', generation, grid);
}

type Pixel = 0 | 1 | 8;
type Pattern = readonly Pixel[][];

const patterns: Record<string, Pattern> = {
	n: [
		[1, 1, 1, 1, 1],
		[1, 8, 8, 8, 1],
		[1, 8, 1, 8, 1],
		[1, 8, 1, 8, 1],
		[1, 1, 1, 1, 1]
	],
	exp: [
		[1, 1, 1, 1, 1, 1, 1],
		[1, 8, 8, 8, 1, 8, 1],
		[1, 8, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 8, 8, 1],
		[1, 1, 8, 8, 1, 8, 1],
		[1, 8, 1, 8, 1, 8, 1],
		[1, 1, 1, 1, 1, 1, 1]
	],
	glider: [
		[0, 1, 1, 1, 0],
		[0, 1, 8, 1, 1],
		[1, 1, 1, 8, 1],
		[1, 8, 8, 8, 1],
		[1, 1, 1, 1, 1]
	]
} as const;
