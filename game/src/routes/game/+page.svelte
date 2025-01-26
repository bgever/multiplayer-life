<script lang="ts">
	import {onDestroy} from 'svelte';
	import {io, Socket} from 'socket.io-client';
	import type {ClientSideEvents, Player, ServerSideEvents} from '$lib/engine/events/spec';
	import Grid from '$lib/components/Grid.svelte';

	let joining = $state(true);
	let updates = $state(0);
	let playerColor = $state('#000');
	let players = $state([] as Player[]);

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
		socket.on('hello', time => {
			console.log(new Date(time), socket.id);
			updates++;
		});
		socket.on('players', updatedPlayers => {
			console.log(updatedPlayers);
			const player = updatedPlayers.find(p => p.uuid === uuid);
			if (!player) return;
			joining = false;
			playerColor = player.color;
			players = updatedPlayers;
		});
	});

	function getRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	function generateGrid(rows: number, cols: number) {
		const grid = [];
		for (let i = 0; i < rows; i++) {
			const row = [];
			for (let j = 0; j < cols; j++) {
				row.push({color: Math.random() > 0.2 ? getRandomColor() : null});
			}
			grid.push(row);
		}
		return grid;
	}

	const grid = generateGrid(100, 100);
</script>

<div class="flex h-full flex-col">
	<div>
		<div class="flex justify-between p-1" style="background-color: {playerColor}">
			<div>Player</div>
			<div>Update #{updates}</div>
		</div>
		<div>Players: {players.length}</div>
	</div>

	<div class="flex-grow flex flex-col items-center">
		{#if joining}
			<p>Joining...</p>
		{:else}
			<Grid data={grid} />
		{/if}
	</div>
</div>

<style>
	:host {
		height: 100vh;
	}
</style>
