import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Here you would load spritesheets, tilemaps, icons.
    // For prototype, load placeholder
    this.load.image('player', '/assets/sprites/player.png');
  }

  create() {
    this.scene.start('LoginScene');
  }
}
