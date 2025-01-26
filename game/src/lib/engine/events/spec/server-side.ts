import type {Player} from './player';

export interface ServerSideEvents {
	hello: (time: number) => void;
	players: (players: Player[]) => void;
}
