<script lang="ts">
	import {onDestroy} from 'svelte';
	import {io, Socket} from 'socket.io-client';
	import type {ClientSideEvents, Player, ServerSideEvents} from '$lib/engine/events/spec';
	import type {GridData} from '$lib/types/grid';
	import type {Point} from '$lib/game/game';
	import Grid from '$lib/components/Grid.svelte';

	let joining = $state(true);
	let playerColor = $state('#000');
	let players = $state([] as Player[]);
	let grid = $state([] as GridData);
	let generation = $state(0);

	const socket = io() as unknown as Socket<ServerSideEvents, ClientSideEvents>;

	onDestroy(() => {
		console.log('Disconnect', socket.id);
		socket.disconnect();
	});

	socket.on('connect', () => {
		console.log('Connected', socket.id);
		// Request to join.
		let uuid = crypto.randomUUID();
		socket.emit('join', uuid);
		socket.on('players', updatedPlayers => {
			console.log(updatedPlayers);
			const player = updatedPlayers.find(p => p.uuid === uuid);
			if (!player) return;
			joining = false;
			playerColor = player.color;
			players = updatedPlayers;
		});
		socket.on('snapshot', (gen, updatedGrid) => {
			generation = gen;
			grid = updatedGrid;
		});
	});

	function onCellClick(position: Point) {
		socket.emit('plot', position, 'exp');
	}
</script>

<div class="flex h-full flex-col">
	<div>
		<div class="flex justify-between p-1" style="background-color: {playerColor}">
			<div>Player</div>
			<div>Gen {generation}</div>
		</div>
		<div>Players: {players.length}</div>
	</div>

	<div class="flex flex-grow flex-col items-center">
		{#if joining}
			<p>Joining...</p>
		{:else}
			<Grid data={grid} {onCellClick} />
		{/if}
	</div>
</div>
