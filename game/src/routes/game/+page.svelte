<script lang="ts">
	import type {ClientSideEvents, ServerSideEvents} from '$lib/engine/server';
	import type {Socket} from 'socket.io';
	import {io} from 'socket.io-client';

	let currentTime = $state(0);

	const socket = io() as unknown as Socket<ServerSideEvents, ClientSideEvents>;
	socket.on('hello', time => {
		currentTime = time;
	});
</script>

<h1>Game</h1>

<p>Message: {new Date(currentTime)}</p>
