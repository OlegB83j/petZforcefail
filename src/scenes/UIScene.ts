import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
  private healthBar!: Phaser.GameObjects.Graphics;
  private healthText!: Phaser.GameObjects.Text;
  private currentHealth: number = 100;

  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    // Create health bar background
    const barBg = this.add.graphics();
    barBg.fillStyle(0x000000, 0.7);
    barBg.fillRoundedRect(10, 10, 210, 30, 5);

    // Create health bar
    this.healthBar = this.add.graphics();
    this.drawHealthBar(100);

    // Health text
    this.healthText = this.add.text(115, 25, '100 / 100', {
      fontSize: '14px',
      color: '#ffffff',
    });
    this.healthText.setOrigin(0.5);

    // Health icon (heart)
    const heart = this.add.text(25, 25, '❤️', { fontSize: '16px' });
    heart.setOrigin(0.5);

    // Controls hint
    this.add.text(10, 560, 'WASD / Arrows to move', {
      fontSize: '12px',
      color: '#888888',
    });

    // Listen for health changes from GameScene
    const gameScene = this.scene.get('GameScene');
    gameScene.events.on('playerHealthChanged', this.updateHealth, this);
  }

  private drawHealthBar(health: number): void {
    this.healthBar.clear();

    // Determine color based on health
    let color = 0x00ff00; // Green
    if (health < 30) {
      color = 0xff0000; // Red
    } else if (health < 60) {
      color = 0xffff00; // Yellow
    }

    // Draw the bar
    this.healthBar.fillStyle(color, 1);
    const barWidth = (health / 100) * 190;
    this.healthBar.fillRoundedRect(15, 15, barWidth, 20, 3);
  }

  private updateHealth(health: number): void {
    this.currentHealth = Math.max(0, Math.min(100, health));
    this.drawHealthBar(this.currentHealth);
    this.healthText.setText(`${this.currentHealth} / 100`);
  }
}
