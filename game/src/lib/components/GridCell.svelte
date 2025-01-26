<script module>
	export {cell};
</script>

{#snippet cell(color, onClick)}
    <div style="background-color: {color || '#eee'}" on:mousedown={onClick}></div>
{/snippet}

<style>
	div {
		aspect-ratio: 1 / 1;
		transition: background-color 0.1s ease-out;
		border-radius: 50%;
	}
</style>
