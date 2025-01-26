<script lang="ts">
	import type {Snippet} from 'svelte';
	import type {GridData} from '$lib/types/grid';

	type Props = {
		data: GridData;
		cell: Snippet<[string | null]>;
	};

	const {data, cell}: Props = $props();
</script>

<div class="grid grow" style:grid-template-columns="repeat({data.length}, 1fr)">
	{#each data as cells, y}
		{#each cells as { color }, x}
			{@render cell(color)}
		{/each}
	{/each}
</div>
