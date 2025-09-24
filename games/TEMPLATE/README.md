# Game Template

This is a template folder for creating new games for your HTML5 Game Hub.

## Structure

```
game-folder/
├── config.json        # Game configuration (name, description, etc.)
├── image.png          # Game thumbnail image (optional)
└── CODE/
    └── index.html     # Main game file
```

## How to Add a New Game

1. **Copy this TEMPLATE folder**
   - Make a copy of the entire TEMPLATE folder
   - Rename it to your game name (e.g., \"snake-game\", \"tetris\", etc.)

2. **Update config.json**
   ```json
   {
       \"name\": \"Your Game Name\",
       \"description\": \"A brief description of your game\",
       \"emoji\": \"🎮\",
       \"version\": \"1.0\",
       \"author\": \"Your Name\",
       \"category\": \"Action/Puzzle/Casual/etc\"
   }
   ```

3. **Add your game**
   - Put your game's HTML file at `CODE/index.html`
   - Include any CSS, JavaScript, or other assets in the CODE folder

4. **Add thumbnail (optional)**
   - Add an image named `image.png` in the game folder
   - Recommended size: 400x200 pixels
   - If no image is provided, the emoji will be used as thumbnail

5. **Update games-list.json**
   - Add your game folder name to the list:
   ```json
   {
       \"folders\": [
           \"sample-game\",
           \"your-new-game\"
       ]
   }
   ```

## Tips

- Keep game files under 10MB for fast loading
- Test your game independently before adding to the hub
- Use relative paths for any assets (images, sounds, etc.)
- The game will open in a new tab when played

## Example Games Structure

```
games/
├── snake-game/
│   ├── config.json
│   ├── image.png
│   └── CODE/
│       └── index.html
├── tetris/
│   ├── config.json
│   ├── image.png
│   └── CODE/
│       ├── index.html
│       ├── style.css
│       └── game.js
└── puzzle-game/
    ├── config.json
    └── CODE/
        └── index.html
```