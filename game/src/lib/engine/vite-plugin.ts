import {build, type PluginOption, type PreviewServer, type ViteDevServer} from 'vite';
import {registerServer} from './registerServer';

/**
 * Starts the WebSocket server which hosts the game engine during development and preview testing.
 */
function configureServer(server: ViteDevServer | PreviewServer) {
	if (!server.httpServer) {
		console.error('No http server available - unable to start WebSocket server.');
		return;
	}

	const {io, interval} = registerServer(server.httpServer);

	// Handle closing the WebSocket server when the development server reloads.
	let closing = false;
	server.httpServer.on('close', () => {
		if (closing) return;
		closing = true;
		console.log('WebSocket server is restarting.');
		clearInterval(interval);
		io.close();
	});
}

export const webSocketServer = (): PluginOption => {
	return {
		name: 'WebSocketServer',
		enforce: 'post',
		configureServer,
		configurePreviewServer: configureServer,
		// TODO: Try to fix production build integration: https://vite.dev/guide/api-javascript.html#build
		// async buildEnd() {
		// 	await build({
		// 		configFile: false,
		// 		build: {
		// 			outDir: 'build-ws',
		// 			lib: {
		// 				entry: 'src/lib/engine/node-server.ts',
		// 				formats: ['es']
		// 			},
		// 			rollupOptions: {
		// 				input: {
		// 					main: 'src/lib/engine/registerServer.ts'
		// 				},
		// 				output: {
		// 					entryFileNames: 'websocket-server.js'
		// 				}
		// 			}
		// 		}
		// 	});
		// }
	};
};
