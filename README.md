# Zombie Survival

A Project Zomboid-inspired zombie survival game built with Phaser 3 and TypeScript.

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at `http://localhost:3000` and open the game in your browser.

### Build for Production

```bash
npm run build
```

## Controls

- **WASD** or **Arrow Keys** - Move player
- **R** - Restart (when dead)

## Current Features

- ✅ Top-down tile-based map
- ✅ Player movement with collision
- ✅ Zombies that chase when player is nearby
- ✅ Zombies wander when player is far
- ✅ Health system with damage from zombies
- ✅ Health pickups (yellow items)
- ✅ Death screen with restart
- ✅ Camera follows player

## Roadmap (Suggested Next Features)

### Phase 1: Combat
- [ ] Melee attack (press Space)
- [ ] Attack cooldown and damage
- [ ] Weapon inventory

### Phase 2: Survival
- [ ] Hunger/thirst bars
- [ ] Food items to collect
- [ ] Stamina system (running)

### Phase 3: Inventory
- [ ] Inventory UI (press I)
- [ ] Multiple item types
- [ ] Item stacking

### Phase 4: World Expansion
- [ ] Larger map with multiple buildings
- [ ] Day/night cycle
- [ ] More zombie spawns at night

### Phase 5: Advanced
- [ ] Crafting system
- [ ] Barricading doors
- [ ] Save/load game

## Project Structure

```
src/
├── main.ts              # Game configuration and entry point
├── scenes/
│   ├── BootScene.ts     # Asset loading and placeholder generation
│   ├── GameScene.ts     # Main gameplay scene
│   └── UIScene.ts       # HUD overlay (health bar)
├── entities/
│   ├── Player.ts        # Player class with movement and health
│   └── Zombie.ts        # Zombie AI (chase, wander, attack)
└── world/
    └── TileMap.ts       # Map data and tile creation
```

## Adding Real Assets

The game currently uses programmatically generated placeholder graphics. To add real sprites:

1. Add images to a `public/assets/` folder
2. Load them in `BootScene.ts` using `this.load.image()` or `this.load.spritesheet()`
3. Remove the placeholder generation code

## License

MIT
