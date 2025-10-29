import Phaser from 'phaser';

export default class HUD {
  scene: Phaser.Scene;
  chatLog: string[] = [];
  text!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.text = this.scene.add.text(10, 520, '', { font: '14px Arial' });
  }

  addChatMessage(msg: string) {
    this.chatLog.push(msg);
    if (this.chatLog.length > 6) this.chatLog.shift();
    this.text.setText(this.chatLog.join('\n'));
  }
}
