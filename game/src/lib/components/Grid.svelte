<script lang="ts">
	import GridContainer from './GridContainer.svelte';
	import {cell} from './GridCell.svelte';
	import type {GridData} from '$lib/types/grid';
	import type { Point } from '$lib/game/game';

	type Props = {
		data: GridData;
		onCellClick: (position: Point) => void;
	};

	const {data, onCellClick}: Props = $props();
</script>

<GridContainer {data} {cell} {onCellClick} />
