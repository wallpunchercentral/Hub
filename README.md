# 🎮 HTML5 Game Hub - Sigma Edition

A sleek black and white gaming website with password protection, perfect for playing HTML5 games at school!

## 🔐 Access

**Username:** `sigma`  
**Password:** `what-the`

*Login credentials are cached in your browser for convenience.*

## ✨ Features

- 🔒 **Password Protection** - Secure access with cached credentials
- 🔍 **Game Search** - Find games quickly with the search bar
- 🎨 **Black & White Theme** - Clean, professional appearance
- 📱 **Mobile Friendly** - Works on all devices
- 🔗 **New Tab Gaming** - Games open in separate blank tabs
- 📁 **Organized Structure** - Easy game management system

## 🚀 Quick Start

1. **Access the site**: Open `index.html` in any browser
2. **Login**: Use the credentials above
3. **Play games**: Click any game to open in a new tab
4. **Search**: Use the search bar to find specific games

## 📁 Project Structure

```
Hub/
├── index.html              # Main homepage with password system
├── styles.css              # Black & white styling
├── script.js               # Game loading & search functionality
├── games-list.json         # List of available game folders
├── games/                  # All game folders
│   ├── TEMPLATE/           # Template for new games
│   │   ├── config.json     # Game configuration template
│   │   ├── README.md       # How to add games guide
│   │   └── CODE/
│   │       └── index.html  # Game template file
│   └── sample-game/        # Example game included
│       ├── config.json     # Game info (name, description, etc.)
│       ├── image.png       # Game thumbnail (optional)
│       └── CODE/
│           └── index.html  # The actual game
└── README.md               # This file
```

## 🎯 Adding New Games

### Method 1: Use the Template

1. **Copy the template**:
   ```bash
   cp -r games/TEMPLATE games/your-game-name
   ```

2. **Edit `config.json`**:
   ```json
   {
       "name": "🎯 Your Game Name",
       "description": "Brief description of your game",
       "emoji": "🎯",
       "version": "1.0",
       "author": "Your Name",
       "category": "Action"
   }
   ```

3. **Add your game**:
   - Put your game at `games/your-game-name/CODE/index.html`
   - Add thumbnail as `games/your-game-name/image.png` (optional)

4. **Update games list**:
   Add to `games-list.json`:
   ```json
   {
       "folders": [
           "sample-game",
           "your-game-name"
       ]
   }
   ```

### Method 2: Manual Setup

1. Create folder: `games/game-name/`
2. Add `config.json` with game info
3. Create `CODE/` subfolder
4. Add your game as `CODE/index.html`
5. Optional: Add `image.png` for thumbnail
6. Update `games-list.json`

## 🎮 Game Requirements

- **Format**: HTML5 games that run in a browser
- **Structure**: Main file must be `CODE/index.html`
- **Size**: Keep under 10MB for fast loading
- **Compatibility**: Should work in modern browsers
- **Assets**: Use relative paths for images, sounds, etc.

## 🌐 Deploy to GitHub Pages

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Added gaming hub with password protection"
   git push
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch
   - Save

3. **Access online**: `https://yourusername.github.io/Hub`

## 🔒 Security Features

- **Cached Authentication**: Login once per browser
- **Simple Protection**: Keeps casual users out
- **No Server Required**: Pure client-side solution
- **School Friendly**: Professional appearance

## 🎨 Customization

### Change Password
Edit `script.js`:
```javascript
const CREDENTIALS = {
    username: 'your-username',
    password: 'your-password'
};
```

### Modify Colors
Edit `styles.css` to change the black/white theme.

### Add Categories
Extend the game config with categories and add filtering.

## 📱 Mobile Support

- Responsive design works on phones and tablets
- Touch-friendly interface
- Optimized for small screens
- Fast loading on mobile networks

## 🔧 Troubleshooting

**Games not loading?**
- Check `games-list.json` includes your game folder
- Verify `config.json` has correct syntax
- Ensure game file is at `CODE/index.html`

**Password not working?**
- Clear browser cache and try again
- Check credentials in `script.js`
- Ensure JavaScript is enabled

**Search not working?**
- Check game names and descriptions in config files
- Clear search bar and try again

## 🎯 Perfect for School

- **Professional Look**: Black and white theme looks like a work site
- **Fast Access**: Cached login, no repeated passwords
- **Organized**: Easy to find and play games
- **Discrete**: Opens games in new tabs
- **Reliable**: Works on school computers and networks

## 🤝 Contributing

To add more games or features:
1. Fork the repository
2. Add your games using the template
3. Test thoroughly
4. Submit a pull request

---

**Ready to game? Login with `sigma` / `what-the` and start playing! 🎮**