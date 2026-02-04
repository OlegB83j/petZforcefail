import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5, 0.5);

    // Loading progress
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x8b0000, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Generate placeholder assets (we'll create simple graphics)
    this.createPlaceholderAssets();
  }

  create(): void {
    this.scene.start('GameScene');
    this.scene.launch('UIScene');
  }

  private createPlaceholderAssets(): void {
    // Create player sprite (green square for now)
    const playerGraphics = this.make.graphics({ x: 0, y: 0 });
    playerGraphics.fillStyle(0x4a7c4e, 1);
    playerGraphics.fillRect(0, 0, 32, 32);
    playerGraphics.lineStyle(2, 0x2d4a2f);
    playerGraphics.strokeRect(0, 0, 32, 32);
    // Add a direction indicator (front)
    playerGraphics.fillStyle(0xf5deb3, 1);
    playerGraphics.fillCircle(16, 8, 6); // Head
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

    // Create zombie sprite (red-brown square)
    const zombieGraphics = this.make.graphics({ x: 0, y: 0 });
    zombieGraphics.fillStyle(0x5c4033, 1);
    zombieGraphics.fillRect(0, 0, 32, 32);
    zombieGraphics.lineStyle(2, 0x3d2817);
    zombieGraphics.strokeRect(0, 0, 32, 32);
    // Zombie head (greenish)
    zombieGraphics.fillStyle(0x6b8e23, 1);
    zombieGraphics.fillCircle(16, 8, 6);
    zombieGraphics.generateTexture('zombie', 32, 32);
    zombieGraphics.destroy();

    // Create floor tile
    const floorGraphics = this.make.graphics({ x: 0, y: 0 });
    floorGraphics.fillStyle(0x3d3d3d, 1);
    floorGraphics.fillRect(0, 0, 32, 32);
    floorGraphics.lineStyle(1, 0x2a2a2a);
    floorGraphics.strokeRect(0, 0, 32, 32);
    floorGraphics.generateTexture('floor', 32, 32);
    floorGraphics.destroy();

    // Create wall tile
    const wallGraphics = this.make.graphics({ x: 0, y: 0 });
    wallGraphics.fillStyle(0x696969, 1);
    wallGraphics.fillRect(0, 0, 32, 32);
    wallGraphics.lineStyle(2, 0x4a4a4a);
    wallGraphics.strokeRect(0, 0, 32, 32);
    // Add brick pattern
    wallGraphics.lineStyle(1, 0x555555);
    wallGraphics.lineBetween(0, 10, 32, 10);
    wallGraphics.lineBetween(0, 21, 32, 21);
    wallGraphics.lineBetween(16, 0, 16, 10);
    wallGraphics.lineBetween(8, 10, 8, 21);
    wallGraphics.lineBetween(24, 10, 24, 21);
    wallGraphics.lineBetween(16, 21, 16, 32);
    wallGraphics.generateTexture('wall', 32, 32);
    wallGraphics.destroy();

    // Create grass tile (outdoor)
    const grassGraphics = this.make.graphics({ x: 0, y: 0 });
    grassGraphics.fillStyle(0x2d5a27, 1);
    grassGraphics.fillRect(0, 0, 32, 32);
    // Add some grass detail
    grassGraphics.fillStyle(0x3d6a37, 1);
    grassGraphics.fillRect(5, 5, 3, 3);
    grassGraphics.fillRect(20, 12, 3, 3);
    grassGraphics.fillRect(10, 25, 3, 3);
    grassGraphics.fillRect(25, 22, 3, 3);
    grassGraphics.generateTexture('grass', 32, 32);
    grassGraphics.destroy();

    // Create item pickup (yellow square - loot)
    const itemGraphics = this.make.graphics({ x: 0, y: 0 });
    itemGraphics.fillStyle(0xffd700, 1);
    itemGraphics.fillRect(4, 4, 24, 24);
    itemGraphics.lineStyle(2, 0xb8860b);
    itemGraphics.strokeRect(4, 4, 24, 24);
    itemGraphics.generateTexture('item', 32, 32);
    itemGraphics.destroy();
  }
}
