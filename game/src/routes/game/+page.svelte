<script lang="ts">
	import {onDestroy} from 'svelte';
	import {io, Socket} from 'socket.io-client';
	import type {ClientSideEvents, Player, ServerSideEvents} from '$lib/engine/events/spec';
	import type {GridData} from '$lib/types/grid';
	import type {Point} from '$lib/game/game';
	import {patterns} from '$lib/engine/plot';
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

	let selectedPattern = $state('exp');
	const patternOptions = Object.entries(patterns).map(([id, {name}]) => ({id, name}));

	function onCellClick(position: Point) {
		console.log('Clicked', position, selectedPattern);
		socket.emit('plot', position, selectedPattern);
	}
</script>

<div class="flex h-full flex-col rounded-md border-2" style:border-color={playerColor}>
	<div>
		<div
			class="_flex _justify-between grid grid-cols-3 border-b-2 p-1"
			style:background-color={playerColor}
			style:border-color={playerColor}>
			<div class="pl-2 font-bold">Player</div>
			<div class="_align-center flex justify-center">
				<div class="grid grid-cols-1">
					<select
						id="selectedPattern"
						name="selectedPattern"
						bind:value={selectedPattern}
						class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white pl-3 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
						{#each patternOptions as option}
							<option value={option.id}>
								{option.name}
							</option>
						{/each}
					</select>
					<svg
						class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
						viewBox="0 0 16 16"
						fill="currentColor"
						aria-hidden="true"
						data-slot="icon">
						<path
							fill-rule="evenodd"
							d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd" />
					</svg>
				</div>
			</div>
			<div class="justify-self-end pr-2">
				Players: {players.length} / Gen: <span class="tabular-nums">{generation}</span>
			</div>
		</div>
	</div>

	<div class="flex flex-grow flex-col items-center bg-gray-100 p-2">
		{#if joining}
			<p>Joining...</p>
		{:else}
			<Grid data={grid} {onCellClick} />
		{/if}
	</div>
</div>
