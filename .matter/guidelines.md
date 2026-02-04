I've configured the runtime environment for your Zombie Survival game. Here's what I've set up:

**Prepare Script:**
- Installs all npm dependencies using `npm ci`

**Run Script (Development Server):**
- Starts the Vite development server on port 3000
- Uses `--host 0.0.0.0` to make the server accessible from the preview URL

The game is a Phaser 3 + TypeScript zombie survival game that runs entirely in the browser. Once the preview environment starts, you'll be able to:
- Use WASD or Arrow Keys to move your player
- Avoid zombies that chase you when nearby
- Collect yellow health pickups
- Press R to restart if you die