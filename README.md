# Conway's Game of Life: Multiplayer

This is a demo app of a multiplayer adaptation of [Conway's Game of Life][life].

## System Design

### Technology Stack

- Frontend: [Svelte v5][svelte], [TailwindCSS][tailwind].
- Backend: Node.js - [SvelteKit][svelte], [Sockets.io][socketsio].

### Game Implementation

There is one game running at a time when the server is active. Web clients can connect to the server with the Web UI.

The web UI offers to either:

- Connect a single player.
- Open an arena with 6 players at the same time.

When a player connects, they receive an assigned random color (hue) and receive the other player count.

The server streams a snapshot of the 100x100 game world to the players at a 1 second interval.

Players can interact with the mouse on the game world by clicking on a position where it should plot a pattern.
Different patterns can be selected from the toolbar.

If players close their browser or reload the page, they will disconnect from the game, and their color assignment is
lost. The game world will continue to process the plotted patterns and their color may continue to spread.

### Further Improvements

- Improved game UX:
  - Ability to enter a display name.
  - List all other players with their display name and assigned color.
  - Count number of cells with exact color match to calculate a score.
  - Ability to start and stop a game world.
- Game persistence:
  - Currently the game world is kept in memory, this could be kept in Redis for quick access and streaming.
- Better connection handling:
  - Player rooms to group players together and set participant limits.
  - Create a session for the user so that refreshing the page wouldn't reset their player connection.
  - Handling of inactive clients through heartbeats.
- Improved streaming:
  - Client-side world rendering with diff updates from the server instead of streaming snapshots.
    - Would require the client to keep a few generations of buffer in case they receive a delayed game update to
      recalculate the game world based on a previous generation.
  - Server would only stream plot actions received from the other players and the occasional snapshot to sync the world.
  - Use more efficient binary transfer of game data to reduce network overhead.
  - Possibly stream beyond fixed world boundaries. Would require streaming the changes on the edges of the game world.
- Improved rendering:
  - Currently the game world is rendered with a DOM based CSS-grid. It would be more efficient to render a canvas or
    SVG with D3.
  - Possibly some memoization in the game algorithm could help speed up the calculations.
- Improved WebSocket server build:
  - Currently hosted through the Vite preview host. Instead, the websocket engine should be a separate build which is
    then directly hosted with Node.

## Local Development

### Prerequisites

- Node.js (tested and developed with v22).

### Getting started

- `cd game`
- `npm install`
- `npm run dev`
- Open the web browser URL listed in the console.

### Unit Tests

- `npm test`

## Run with Docker

Build the image:

```sh
docker build -t life .
```

Run the image for local testing:

```sh
docker run -p 3000:3000 -it life
```

Once launched interactively, shut down by pressing Ctrl+C.
Open <http://localhost:3000> to access the game.

[life]: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
[svelte]: https://svelte.dev
[tailwind]: https://tailwindcss.com
[socketsio]: https://socket.io
