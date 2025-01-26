<script lang="ts">
	import GridContainer from './GridContainer.svelte';
	import {cell} from './GridCell.svelte';
	import type {GridData} from '$lib/types/grid';

	type Props = {
		data: GridData;
	};

	const {data}: Props = $props();
</script>

<GridContainer {data} {cell} />
