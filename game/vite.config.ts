import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vitest/config';
import {webSocketServer} from './src/lib/engine/vite-plugin';

export default defineConfig({
	plugins: [sveltekit(), webSocketServer()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

	preview: {
		host: '0.0.0.0',
		port: 3000
	}
});
