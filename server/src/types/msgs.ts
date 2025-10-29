export interface PlayerInput {
  type: 'playerInput';
  playerId: string;
  seq: number;
  inputs: Array<{ type: 'move'|'attack', dx?: number, dy?: number, ts: number }>;
  timestamp: number;
}

export interface EntityState {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  hp: number;
  animation?: string;
}

export interface StateUpdate {
  type: 'stateUpdate';
  lastProcessedSeq: number;
  entities: EntityState[];
  tick: number;
}
