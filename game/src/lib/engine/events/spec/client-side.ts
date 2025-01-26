import type {Point} from '../../../game/game';

export interface ClientSideEvents {
	join(guid: string): void;
	leave(guid: string): void;
	plot(position: Point, pattern: string): void;
}
