import type {GridData} from '$lib/types/grid';
import {describe, expect, it} from 'vitest';
import {internal, next, willLive} from './game';

const {neighboringPositions, neighbors} = internal;

const mockGrid: GridData = Array.from({length: 10}, (_, rowIndex) =>
	Array.from({length: 10}, (_, colIndex) => String.fromCharCode(/* a */ 97 + rowIndex) + colIndex)
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
			'j9', 'j0', 'j1',
			'a9', /* skipped */ 'a1',
			'b9', 'b0', 'b1'
		]);
	});
});

describe(neighbors.name, () => {
	it('gets the 9,9 position with neighbors from opposite edges of the grid', () => {
		// prettier-ignore
		expect(neighbors(mockGrid, [9, 9])).toEqual([
			'i8', 'i9', 'i0',
			'j8', /* skipped */ 'j0',
			'a8', 'a9', 'a0'
		]);
	});
});

describe(next.name, () => {
	it('oscillates blinker', () => {
		const grid: GridData = [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 'red', 'red', 'red', 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
		];
		const expected: GridData = [
			[0, 0, 0, 0, 0],
			[0, 0, 'red', 0, 0],
			[0, 0, 'red', 0, 0],
			[0, 0, 'red', 0, 0],
			[0, 0, 0, 0, 0]
		];

		const grid1 = next(grid, willLive);
		const grid2 = next(grid1, willLive);

		expect(grid1, 'horizontal becomes vertical').toEqual(expected);
		expect(grid2, 'goes back to original').toEqual(grid);
	});

	it('blends rgb to green being the average', () => {
		const grid: GridData = [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, '#ff0000', '#00ff00', '#0000ff', 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
		];
		const expected: GridData = [
			[0, 0, 0, 0, 0],
			[0, 0, '#00ff00', 0, 0],
			[0, 0, '#00ff00', 0, 0],
			[0, 0, '#00ff00', 0, 0],
			[0, 0, 0, 0, 0]
		];

		expect(next(grid, willLive)).toEqual(expected);
	});
});
