import type {CellData, GridData} from '$lib/types/grid';

export type Point = readonly [y: number, x: number];

const indexWithinBounds = (size: number) => (index: number) => {
	// When off the top or left edge, return the bottom or right edge.
	if (index === -1) {
		return size - 1;
	}
	// When off the bottom or right edge, return the top or left edge.
	if (index === size) {
		return 0;
	}
	return index;
};

const positionWithinBounds = (position: Point, gridSize: number) => position.map(indexWithinBounds(gridSize));

const getIn = (grid: GridData) => (position: Point) =>
	(([y, x]) => grid[y][x])(positionWithinBounds(position, grid.length));

/** Position offsets. */
const offsets = [-1, 0, 1] as const;

/**
 * Get the position of each neighbor of a given position.
 * When the edge of the grid is reached, the neighbor at the opposite side of the grid is returned.
 */
const neighboringPositions = ([y, x]: Point): Point[] =>
	offsets
		.flatMap(dy => offsets.map(dx => [y + dy, x + dx] as const))
		// Exclude the center cell.
		.filter(([dy, dx]) => !(dy === y && dx === x));

const neighbors = (grid: GridData, position: Point): CellData[] => neighboringPositions(position).map(getIn(grid));

type WillLivePredicate = (cell: CellData, neighbors: CellData[]) => CellData;

/**
 * Calculates the next generation.
 */
export const next = (grid: GridData, willLive: WillLivePredicate): GridData =>
	grid.map((row, y) => row.map((cell, x) => willLive(cell, neighbors(grid, [y, x]))));

export const DEAD_CELL: CellData = {color: null} as const;

export const willLive: WillLivePredicate = (cell, neighbors) => {
	const alive = cell.color !== null;
	const aliveNeighborCount = neighbors.filter(n => n.color !== null).length;

	if (alive) {
		return aliveNeighborCount === 2 || aliveNeighborCount === 3 ? cell : DEAD_CELL;
	} else {
		return aliveNeighborCount === 3 ? {color: 'red'} : DEAD_CELL;
	}
};

export const internal = {neighboringPositions, neighbors} as const;
