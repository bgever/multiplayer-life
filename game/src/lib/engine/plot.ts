import {positionWithinBounds} from '../game/game';
import type {GridData} from '../types/grid';
import {popPlots} from './state';

export function applyPlots(grid: GridData) {
	try {
		const plots = popPlots();
		plots.forEach(p => {
			const pattern = patterns[p.pattern];
			const [posY, posX] = p.position;
			pattern.forEach((row, patternY) => {
				row.forEach((pixel, patternX) => {
					if (pixel === 0) return;
					const [y, x] = positionWithinBounds([posY + patternY, posX + patternX], grid.length);
					grid[y][x] = pixel === 8 ? p.player.color : 0;
				});
			});
		});
	} catch (e) {
		console.error('Error applying plots:', e);
	}
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
