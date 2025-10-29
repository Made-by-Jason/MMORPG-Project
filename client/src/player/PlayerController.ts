import Phaser from 'phaser';
import NetworkManager from '../network/NetworkManager';

/**
 * Implements client-side prediction and reconciliation.
 */
export default class PlayerController {
  scene: Phaser.Scene;
  sprite!: Phaser.GameObjects.Sprite;
  nm: NetworkManager;
  playerId: string;
  seq: number = 0;
  pendingInputs: any[] = [];
  localX: number = 100;
  localY: number = 100;

  constructor(scene: Phaser.Scene, playerId: string) {
    this.scene = scene;
    this.playerId = playerId;
    this.nm = NetworkManager.getInstance();

    this.sprite = this.scene.add.sprite(this.localX, this.localY, 'player').setOrigin(0.5);
    this.setupInput();
  }

  setupInput() {
    this.scene.input.keyboard.on('keydown', (ev: KeyboardEvent) => {
      let dx = 0, dy = 0;
      if (ev.key === 'ArrowUp') dy = -5;
      if (ev.key === 'ArrowDown') dy = 5;
      if (ev.key === 'ArrowLeft') dx = -5;
      if (ev.key === 'ArrowRight') dx = 5;
      if (dx !== 0 || dy !== 0) {
        this.applyLocalMove(dx, dy);
      }
    });
  }

  applyLocalMove(dx: number, dy: number) {
    this.seq++;
    const input = { type: 'move', dx, dy, ts: Date.now() };
    // Apply locally
    this.localX += dx;
    this.localY += dy;
    this.sprite.setPosition(this.localX, this.localY);

    // Queue and send
    this.pendingInputs.push({ seq: this.seq, input });
    this.nm.send({ type: 'playerInput', playerId: this.playerId, seq: this.seq, inputs: [input], timestamp: Date.now() });
  }

  reconcile(msg: any) {
    // msg.entities contains authoritative positions
    const me = msg.entities.find((e: any) => e.id === this.playerId);
    if (!me) return;
    // If server position differs, correct and reapply pending inputs
    const serverX = me.x;
    const serverY = me.y;
    const dx = serverX - this.localX;
    const dy = serverY - this.localY;
    if (Math.hypot(dx, dy) > 1) {
      // correction
      this.localX = serverX;
      this.localY = serverY;
      this.sprite.setPosition(this.localX, this.localY);
      // reapply pending inputs after lastProcessedSeq if needed (simplified)
      this.pendingInputs = []; // in prototype, we clear
    }
  }

  update(time: number, dt: number) {
    // Smooth camera follow
    this.scene.cameras.main.centerOn(this.sprite.x, this.sprite.y);
  }
}
