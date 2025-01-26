import type {Player} from './events/spec/player';

let players: Player[] = [];

export const getPlayers = () => players;
export const addPlayer = (player: Player) => players.push(player);
export function removePlayer(guid: string) {
	players = players.filter(p => p.uuid !== guid);
}
