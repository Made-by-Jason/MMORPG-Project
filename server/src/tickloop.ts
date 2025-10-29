import http from 'http';
import { Server } from 'socket.io';
import { drainInputQueue, getPlayersSnapshot } from './services/world';
import { applyInputToPlayer, calculateDamage } from './services/combat';

export function startTickLoop(io: Server) {
  const TICK_MS = 50;
  let tick = 0;

  setInterval(() => {
    tick++;
    // 1. process inputs
    const inputs = drainInputQueue();
    inputs.forEach((inp) => {
      applyInputToPlayer(inp);
    });

    // 2. update NPCs (omitted for brevity — spawn simple dummy NPCs if needed)

    // 3. physics & collisions (omitted — placeholder)

    // 4. combat resolution (placeholder: no active combat in prototype)

    // 5. broadcast deltas
    const entities = getPlayersSnapshot();
    const packet = { type: 'stateUpdate', lastProcessedSeq: inputs.length ? inputs[inputs.length - 1].seq : 0, entities, tick };
    io.to('world').emit('message', packet);
  }, TICK_MS);
}
