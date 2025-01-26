import type {GridData} from '../../../types/grid';
import type {Player} from './player';

export interface ServerSideEvents {
	players(players: Player[]): void;
	snapshot(gen: number, grid: GridData): void;
}
