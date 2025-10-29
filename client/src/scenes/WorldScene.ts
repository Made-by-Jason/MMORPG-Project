import Phaser from 'phaser';
import NetworkManager from '../network/NetworkManager';
import PlayerController from '../player/PlayerController';
import HUD from '../ui/HUD';

export default class WorldScene extends Phaser.Scene {
  nm!: NetworkManager;
  playerController!: PlayerController;
  hud!: HUD;
  playerId!: string;

  constructor() {
    super({ key: 'WorldScene' });
  }

  init(data: any) {
    this.playerId = data.playerId || 'player-unknown';
  }

  create() {
    this.cameras.main.setBackgroundColor('#87CEEB');
    this.add.text(10, 10, `Player: ${this.playerId}`, { fontSize: '16px' });

    this.nm = NetworkManager.getInstance();
    this.playerController = new PlayerController(this, this.playerId);
    this.hud = new HUD(this);

    // Listen to state updates
    this.nm.onMessage((msg: any) => {
      if (msg.type === 'stateUpdate') {
        this.playerController.reconcile(msg);
      } else if (msg.type === 'chat') {
        this.hud.addChatMessage(`${msg.sender}: ${msg.message}`);
      }
    });
  }

  update(time: number, delta: number) {
    this.playerController.update(time, delta);
  }
}
