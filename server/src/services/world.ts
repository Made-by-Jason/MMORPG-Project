/**
 * World service: manages players, NPCs, and dispatch.
 * For simplicity this module keeps in-memory state for running prototype.
 * Use persistence for production.
 */
import { Socket } from 'socket.io';
import { PlayerInput, StateUpdate, EntityState } from '../types/msgs';
import { io } from 'socket.io-client'; // note: used only for type in prototype
import { applyInputToPlayer } from './combat';
import db from '../db/pg';
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

type Player = {
  id: string;
  socketId: string;
  x: number;
  y: number;
  hp: number;
  lastSeq: number;
};

const players: Map<string, Player> = new Map();

export function handlePlayerMessage(socket: any, msg: any, io: any) {
  if (!msg || !msg.type) return;

  switch (msg.type) {
    case 'auth':
      // simple auth: attach socket to playerId
      players.set(msg.playerId, { id: msg.playerId, socketId: socket.id, x: 100, y: 100, hp: 100, lastSeq: 0 });
      socket.join('world'); // single zone
      socket.emit('message', { type: 'authOk' });
      break;
    case 'playerInput':
      handlePlayerInput(socket, msg as PlayerInput);
      break;
    case 'chat':
      io.to('world').emit('message', { type: 'chat', channel: 'local', sender: msg.sender, message: msg.message });
      // persist chat
      db.query('INSERT INTO chat_logs (channel, sender_id, message) VALUES ($1,$2,$3)', ['local', msg.sender, msg.message]);
      break;
    default:
      break;
  }
}

const inputQueue: PlayerInput[] = [];
export function handlePlayerInput(socket: Socket, msg: PlayerInput) {
  // Simple validation
  if (!players.has(msg.playerId)) return;

  inputQueue.push(msg as PlayerInput);
}

// Expose functions for tick loop
export function drainInputQueue() {
  const q = inputQueue.splice(0, inputQueue.length);
  return q;
}

export function getPlayersSnapshot(): EntityState[] {
  const out: EntityState[] = [];
  players.forEach((p) => {
    out.push({ id: p.id, x: p.x, y: p.y, hp: p.hp });
  });
  return out;
}

export function updatePlayerPosition(playerId: string, x: number, y: number) {
  const p = players.get(playerId);
  if (p) {
    p.x = x; p.y = y;
  }
}
