/**
 * Custom server: https://svelte.dev/docs/kit/adapter-node#Custom-server
 */

import {server as svelteKitServer} from '../build/index.js';
import {registerServer} from '../build-ws/websocket-server.js';

// Start the WebSocket server alongside the SvelteKit server.
registerServer(svelteKitServer.server);
