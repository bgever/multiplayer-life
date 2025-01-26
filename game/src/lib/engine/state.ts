import type {Point} from '../game/game';
import type {Player} from './events/spec/player';

let players: Player[] = [];

export const getPlayers = () => players;
export const addPlayer = (player: Player) => players.push(player);
export function removePlayer(guid: string) {
	players = players.filter(p => p.uuid !== guid);
}

type Plot = {player: Player; position: Point; pattern: string};
const plots: Plot[] = [];

export const pushPlot = (plot: Plot) => plots.push(plot);
export const popPlots = () => plots.splice(0, plots.length);
