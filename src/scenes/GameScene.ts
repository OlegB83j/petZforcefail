import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Zombie } from '../entities/Zombie';
import { TILE_SIZE, createMap, MAP_WIDTH, MAP_HEIGHT } from '../world/TileMap';

export class GameScene extends Phaser.Scene {
  public player!: Player;
  public zombies!: Phaser.GameObjects.Group;
  public walls!: Phaser.Physics.Arcade.StaticGroup;
  public items!: Phaser.Physics.Arcade.StaticGroup;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // Set world bounds
    this.physics.world.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);

    // Create tile map
    this.walls = this.physics.add.staticGroup();
    this.items = this.physics.add.staticGroup();
    createMap(this);

    // Create player at starting position
    this.player = new Player(this, 5 * TILE_SIZE, 5 * TILE_SIZE);

    // Create zombies group
    this.zombies = this.add.group();
    this.spawnZombies();

    // Set up camera to follow player
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
    this.cameras.main.setZoom(1.5);

    // Set up input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Set up collisions
    this.physics.add.collider(this.player.sprite, this.walls);
    this.physics.add.collider(this.zombies, this.walls);
    this.physics.add.collider(this.zombies, this.zombies);

    // Zombie attacks player
    this.physics.add.overlap(
      this.player.sprite,
      this.zombies,
      this.handleZombieAttack,
      undefined,
      this
    );

    // Player picks up items
    this.physics.add.overlap(
      this.player.sprite,
      this.items,
      this.handleItemPickup,
      undefined,
      this
    );
  }

  update(_time: number, delta: number): void {
    // Handle player input
    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    this.player.update(left, right, up, down);

    // Update all zombies
    this.zombies.getChildren().forEach((zombie) => {
      (zombie as Zombie).update(this.player, delta);
    });
  }

  private spawnZombies(): void {
    // Spawn some zombies at predefined locations
    const zombiePositions = [
      { x: 15, y: 8 },
      { x: 20, y: 15 },
      { x: 8, y: 18 },
      { x: 25, y: 5 },
      { x: 12, y: 22 },
    ];

    zombiePositions.forEach((pos) => {
      const zombie = new Zombie(this, pos.x * TILE_SIZE, pos.y * TILE_SIZE);
      this.zombies.add(zombie);
      this.physics.add.collider(zombie, this.walls);
    });
  }

  private handleZombieAttack(
    playerSprite: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    zombieObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const zombie = zombieObj as Zombie;
    if (zombie.canAttack()) {
      this.player.takeDamage(10);
      zombie.attack();

      // Emit event for UI to update
      this.events.emit('playerHealthChanged', this.player.health);

      // Visual feedback - flash red
      (playerSprite as Phaser.GameObjects.Sprite).setTint(0xff0000);
      this.time.delayedCall(100, () => {
        (playerSprite as Phaser.GameObjects.Sprite).clearTint();
      });

      // Check for death
      if (this.player.health <= 0) {
        this.handlePlayerDeath();
      }
    }
  }

  private handleItemPickup(
    _playerSprite: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    itemSprite: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    // Remove the item
    (itemSprite as Phaser.GameObjects.Sprite).destroy();

    // Heal player a bit
    this.player.heal(20);
    this.events.emit('playerHealthChanged', this.player.health);

    // Play pickup effect (simple flash)
    this.cameras.main.flash(100, 255, 255, 0, false);
  }

  private handlePlayerDeath(): void {
    // Stop the game
    this.physics.pause();

    // Tint player red
    this.player.sprite.setTint(0xff0000);

    // Show death message
    const deathText = this.add.text(
      this.cameras.main.scrollX + 400,
      this.cameras.main.scrollY + 300,
      'YOU DIED\n\nPress R to restart',
      {
        fontSize: '48px',
        color: '#ff0000',
        align: 'center',
      }
    );
    deathText.setOrigin(0.5);
    deathText.setScrollFactor(0);
    deathText.setDepth(100);

    // Listen for restart
    this.input.keyboard!.once('keydown-R', () => {
      this.scene.restart();
      this.events.emit('playerHealthChanged', 100);
    });
  }
}
