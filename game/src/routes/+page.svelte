{#snippet link(label, url)}
	<p class="mt-6">
		<a
			class="shadow-xs rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			href={url}>{label}</a>
	</p>
{/snippet}

<div class="flex h-full items-center justify-center">
	<div class="text-center">
		<h1 class="text-2xl font-bold my-4">Conway’s Game of Life: Multiplayer</h1>
		{@render link('Join Game', '/game')}
		{@render link('6 Games Arena', '/arena')}
	</div>
</div>
