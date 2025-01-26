/**
 * Custom server: https://svelte.dev/docs/kit/adapter-node#Custom-server
 */

import type {Server} from 'http';
import {registerServer} from './registerServer.js';

// @ts-expect-error Only available after build.
const {server} = await import('./index.js');

const httpServer = server.server as Server;

registerServer(httpServer);
