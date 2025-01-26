import {type PluginOption, type PreviewServer, type ViteDevServer} from 'vite';
import {registerServer} from './registerServer';

function configureServer(server: ViteDevServer | PreviewServer) {
	if (!server.httpServer) {
		console.error('No http server available - unable to start WebSocket server.');
		return;
	}

	const {io, interval} = registerServer(server.httpServer);

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
		configurePreviewServer: configureServer
		// TODO: Try to fix production build integration: https://vite.dev/guide/api-javascript.html#build
		// async buildEnd() {
		// 	await build({
		// 		configFile: false,
		// 		build: {
		// 			outDir: 'build',
		// 			lib: {
		// 				entry: 'src/lib/engine/node-server.ts',
		// 				formats: ['es']
		// 			},
		// 			rollupOptions: {
		// 				input: {
		// 					main: 'src/lib/engine/node-server.ts'
		// 				},
		// 				output: {
		// 					entryFileNames: 'extended-server.js'
		// 				}
		// 			}
		// 		}
		// 		// plugins: [require('@rollup/plugin-typescript')()]
		// 	});
		// }
	};
};
