import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // load minimal testing assets
    this.load.image('logo', '/assets/sprites/logo.png');
  }

  create() {
    this.scene.start('PreloadScene');
  }
}
