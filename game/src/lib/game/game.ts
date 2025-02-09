import type {CellData, GridData} from '../types/grid';
import * as d3 from 'd3';

export type Point = readonly [y: number, x: number];

/** Ensures that when the index is off the edges, it returns a position within the grid in a repeating pattern. */
const indexWithinBounds = (size: number) => (index: number) => (index + size) % size;

export const positionWithinBounds = (position: Point, gridSize: number) => position.map(indexWithinBounds(gridSize));

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

export const DEAD_CELL: CellData = 0;

export const willLive: WillLivePredicate = (cell, neighbors) => {
	const alive = cell !== 0;
	const aliveNeighbors = neighbors.filter(n => n !== 0);
	const aliveNeighborCount = aliveNeighbors.length;

	if (alive) {
		return aliveNeighborCount === 2 || aliveNeighborCount === 3 ? cell : DEAD_CELL;
	} else {
		return aliveNeighborCount === 3 ? blendColors(aliveNeighbors.map(n => n!)) : DEAD_CELL;
	}
};

function blendColors(colors: string[]): string {
	const uniqueColors = new Set(colors);
	if (uniqueColors.size === 1) {
		return colors[0];
	}

	const hue =
		uniqueColors
			.values()
			.map(color => d3.hsl(color)!.h)
			.reduce((a, b) => a + b, 0) / uniqueColors.size;

	return d3.hsl(hue, 1, 0.5).formatHex();
}

export const internal = {neighboringPositions, neighbors} as const;
