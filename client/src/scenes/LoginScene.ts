import Phaser from 'phaser';
import NetworkManager from '../network/NetworkManager';

export default class LoginScene extends Phaser.Scene {
  nm: NetworkManager | null = null;

  constructor() {
    super({ key: 'LoginScene' });
  }

  create() {
    this.add.text(200, 150, 'ArcadeMMO Prototype', { fontSize: '24px' });
    const loginBtn = this.add.text(200, 220, 'Connect', { fontSize: '20px', backgroundColor: '#222' }).setInteractive();
    loginBtn.on('pointerdown', async () => {
      this.nm = NetworkManager.getInstance();
      await this.nm.connect();
      const playerId = 'player-' + Math.floor(Math.random() * 100000);
      this.nm.send({ type: 'auth', playerId });
      this.scene.start('WorldScene', { playerId });
    });
  }
}
