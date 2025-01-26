import type {GridData} from '../types/grid';
import {describe, expect, it} from 'vitest';
import {applyPlots} from './plot';
import {pushPlot} from './state';

const mockGrid = (): GridData => Array.from({length: 6}, () => Array.from({length: 6}, () => '#000'));

describe(applyPlots.name, () => {
	it('applying plot to top left corner places it there', () => {
		pushPlot({pattern: 'n', position: [0, 0], player: {color: '#fff', uuid: ''}});
		const grid = mockGrid();
		applyPlots(grid);

		// prettier-ignore
		expect(grid).toEqual([
			[0,      0,      0,      0,      0,      '#000'],
			[0,      '#fff', '#fff', '#fff', 0,      '#000'],
			[0,      '#fff', 0,      '#fff', 0,      '#000'],
			[0,      '#fff', 0,      '#fff', 0,      '#000'],
			[0,      0,      0,      0,      0,      '#000'],
			['#000', '#000', '#000', '#000', '#000', '#000'],
		]);
	});

	it('applying plot to bottom right corner places it partially the top left corner', () => {
		pushPlot({pattern: 'n', position: [5, 5], player: {color: '#fff', uuid: ''}});
		const grid = mockGrid();
		applyPlots(grid);

		// prettier-ignore
		expect(grid).toEqual([
			['#fff', '#fff', '#fff', 0,      '#000', 0],
			['#fff', 0,      '#fff', 0,      '#000', 0],
			['#fff', 0,      '#fff', 0,      '#000', 0],
			[0,      0,      0,      0,      '#000', 0],
			['#000', '#000', '#000', '#000', '#000', '#000'],
			[0,      0,      0,      0,      '#000', 0],
			
		]);
	});
});
