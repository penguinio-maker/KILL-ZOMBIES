import Phaser from 'phaser';
import { ArenaScene } from './scenes/ArenaScene';
import './styles.css';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 720,
  backgroundColor: '#172136',
  antialias: true,
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [ArenaScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});
