<main class="grid grid-cols-3 gap-4 p-4 h-screen">
	{#each { length: 6 }, rank}
		<iframe src="/game" title="Game {rank + 1}" class="w-full h-full"></iframe>
	{/each}
</main>
