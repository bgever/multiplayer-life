import type {GridData} from '$lib/types/grid';
import {describe, expect, it} from 'vitest';
import {internal, next, willLive} from './game';

const {neighboringPositions, neighbors} = internal;

const mockGrid: GridData = Array.from({length: 10}, (_, rowIndex) =>
	Array.from({length: 10}, (_, colIndex) => ({
		color: String.fromCharCode(97 + rowIndex) + colIndex // Starts at 'a'.
	}))
);

describe(neighboringPositions.name, () => {
	it('gets all neighboring positions', () => {
		// prettier-ignore
		expect(neighboringPositions([0, 0])).toEqual([
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1], /* excl. */ [0, 1],
			[1, -1],  [1, 0],  [1, 1]
		]);
	});
});

describe(neighbors.name, () => {
	it('gets the 0,0 position with neighbors from opposite edges of the grid', () => {
		// prettier-ignore
		expect(neighbors(mockGrid, [0, 0])).toEqual([
			{color: 'j9'}, {color: 'j0'}, {color: 'j1'},
			{color: 'a9'}, /* skipped */ {color: 'a1'},
			{color: 'b9'}, {color: 'b0'}, {color: 'b1'}
		]);
	});
});

describe(next.name, () => {
	it('oscillates blinker', () => {
		const grid = [
			[{color: null}, {color: null}, {color: null}, {color: null}, {color: null}],
			[{color: null}, {color: null}, {color: null}, {color: null}, {color: null}],
			[{color: null}, {color: 'red'}, {color: 'red'}, {color: 'red'}, {color: null}],
			[{color: null}, {color: null}, {color: null}, {color: null}, {color: null}],
			[{color: null}, {color: null}, {color: null}, {color: null}, {color: null}],
		];
		const expected = [
			[{color: null}, {color: null}, {color: null}, {color: null}, {color: null}],
			[{color: null}, {color: null}, {color: 'red'}, {color: null}, {color: null}],
			[{color: null}, {color: null}, {color: 'red'}, {color: null}, {color: null}],
			[{color: null}, {color: null}, {color: 'red'}, {color: null}, {color: null}],
			[{color: null}, {color: null}, {color: null}, {color: null}, {color: null}],
		];

		const grid1 = next(grid, willLive);
		const grid2 = next(grid1, willLive);

		expect(grid1, 'horizontal becomes vertical').toEqual(expected);
		expect(grid2, 'goes back to original').toEqual(grid);
	});
});
