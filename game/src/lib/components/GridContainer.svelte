<script lang="ts">
	import type {Snippet} from 'svelte';
	import type {GridData} from '$lib/types/grid';
	import type {Point} from '$lib/game/game';

	type Props = {
		data: GridData;
		cell: Snippet<[string | 0, () => void]>;
		onCellClick: (position: Point) => void;
	};

	const {data, cell, onCellClick}: Props = $props();

	const onClickCallback = (position: Point) => {
		return () => {
			console.log('Clicked', position);
			onCellClick(position);
		};
	};
</script>

<div class="grid grow" style:grid-template-columns="repeat({data.length}, 1fr)">
	{#each data as cells, y}
		{#each cells as color, x}
			{@render cell(color, onClickCallback([y, x]))}
		{/each}
	{/each}
</div>
