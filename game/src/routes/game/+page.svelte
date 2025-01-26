<script lang="ts">
	import {onDestroy} from 'svelte';
	import {io, Socket} from 'socket.io-client';
	import type {ClientSideEvents, Player, ServerSideEvents} from '$lib/engine/events/spec';

	let joining = $state(true);
	let currentTime = $state(0);
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
			currentTime = time;
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
</script>

<div>
	<div class="p-1" style="background-color: {playerColor}">Player</div>
	<div>Players: {players.length}</div>
</div>

{#if joining}
	<p>Joining...</p>
{:else}
	<p>Message: {new Date(currentTime)}</p>
{/if}
