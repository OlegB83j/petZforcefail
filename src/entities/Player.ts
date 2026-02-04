import Phaser from 'phaser';

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public health: number = 9919;
  public maxHealth: number = 99999;

  private speed: number = 150;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);

    // Set up hitbox (slightly smaller than sprite for better feel)
    this.sprite.body!.setSize(24, 24);
    this.sprite.body!.setOffset(4, 4);
  }

  update(left: boolean, right: boolean, up: boolean, down: boolean): void {
    // Reset velocity
    this.sprite.setVelocity(0);

    // Horizontal movement
    if (left) {
      this.sprite.setVelocityX(-this.speed);
    } else if (right) {
      this.sprite.setVelocityX(this.speed);
    }

    // Vertical movement
    if (up) {
      this.sprite.setVelocityY(-this.speed);
    } else if (down) {
      this.sprite.setVelocityY(this.speed);
    }

    // Normalize diagonal movement
    const velocity = this.sprite.body!.velocity;
    if (velocity.x !== 0 && velocity.y !== 0) {
      this.sprite.setVelocity(velocity.x * 0.707, velocity.y * 0.707);
    }
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  isDead(): boolean {
    return this.health <= 0;
  }
}
