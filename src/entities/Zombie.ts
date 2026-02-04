import Phaser from 'phaser';
import { Player } from './Player';

export class Zombie extends Phaser.Physics.Arcade.Sprite {
  private speed: number = 40;
  private detectionRange: number = 200;
  private attackCooldown: number = 1000; // ms
  private lastAttackTime: number = 0;
  private wanderTimer: number = 0;
  private wanderDirection: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'zombie');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(9);

    // Set up hitbox
    this.body!.setSize(24, 24);
    (this.body as Phaser.Physics.Arcade.Body).setOffset(4, 4);

    // Random initial wander direction
    this.wanderDirection = new Phaser.Math.Vector2(
      Phaser.Math.Between(-1, 1),
      Phaser.Math.Between(-1, 1)
    ).normalize();
  }

  update(player: Player, delta: number): void {
    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      player.sprite.x,
      player.sprite.y
    );

    if (distanceToPlayer < this.detectionRange) {
      // Chase player
      this.chasePlayer(player);
    } else {
      // Wander randomly
      this.wander(delta);
    }
  }

  private chasePlayer(player: Player): void {
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      player.sprite.x,
      player.sprite.y
    );

    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    this.setVelocity(velocityX, velocityY);

    // Slight tint when chasing
    this.setTint(0xffcccc);
  }

  private wander(delta: number): void {
    this.clearTint();
    this.wanderTimer += delta;

    // Change direction every 2-4 seconds
    if (this.wanderTimer > Phaser.Math.Between(2000, 4000)) {
      this.wanderTimer = 0;
      this.wanderDirection = new Phaser.Math.Vector2(
        Phaser.Math.FloatBetween(-1, 1),
        Phaser.Math.FloatBetween(-1, 1)
      ).normalize();

      // Sometimes stop moving
      if (Math.random() < 0.3) {
        this.wanderDirection.set(0, 0);
      }
    }

    const wanderSpeed = this.speed * 0.3;
    this.setVelocity(
      this.wanderDirection.x * wanderSpeed,
      this.wanderDirection.y * wanderSpeed
    );
  }

  canAttack(): boolean {
    const now = Date.now();
    return now - this.lastAttackTime >= this.attackCooldown;
  }

  attack(): void {
    this.lastAttackTime = Date.now();
  }
}
