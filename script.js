// Password System
const CREDENTIALS = {
    username: 'sigma',
    password: 'what-the'
};

// Check if user is already authenticated
function checkAuthOnLoad() {
    const isAuthenticated = localStorage.getItem('gameHubAuth') === 'true';
    if (isAuthenticated) {
        showMainSite();
    }
}

// Password verification
function checkPassword() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
        localStorage.setItem('gameHubAuth', 'true');
        showMainSite();
    } else {
        errorMessage.textContent = 'Invalid credentials. Try again.';
        document.getElementById('usernameInput').value = '';
        document.getElementById('passwordInput').value = '';
    }
}

// Show main site
function showMainSite() {
    document.getElementById('passwordOverlay').style.display = 'none';
    document.getElementById('mainSite').style.display = 'block';
    loadGames();
}

// Game data storage
let allGames = [];
let filteredGames = [];

// Load games from JSON files in game folders
async function loadGames() {
    try {
        // Get list of game folders
        const gamesList = await loadGamesList();
        
        for (const gameFolder of gamesList) {
            try {
                const response = await fetch(`games/${gameFolder}/config.json`);
                if (response.ok) {
                    const gameConfig = await response.json();
                    gameConfig.folder = gameFolder;
                    gameConfig.imagePath = `games/${gameFolder}/image.png`;
                    gameConfig.gamePath = `games/${gameFolder}/CODE/index.html`;
                    allGames.push(gameConfig);
                }
            } catch (error) {
                console.log(`Could not load config for ${gameFolder}:`, error);
            }
        }
        
        filteredGames = [...allGames];
        renderGames();
    } catch (error) {
        console.log('Error loading games:', error);
        // Show placeholder if no games found
        showPlaceholder();
    }
}

// Get list of game folders (since we can't directly list directories, we'll try common names)
async function loadGamesList() {
    // Try to load a games-list.json file, or fallback to known games
    try {
        const response = await fetch('games-list.json');
        if (response.ok) {
            const gamesList = await response.json();
            return gamesList.folders || [];
        }
    } catch (error) {
        // Fallback to checking known game folders
        console.log('No games-list.json found, checking for known games');
    }
    
    // Fallback: try some common folder names
    const possibleGames = ['sample-game', 'color-clicker', 'game1', 'game2', 'game3'];
    const existingGames = [];
    
    for (const gameName of possibleGames) {
        try {
            const response = await fetch(`games/${gameName}/config.json`);
            if (response.ok) {
                existingGames.push(gameName);
            }
        } catch (error) {
            // Game doesn't exist, skip
        }
    }
    
    return existingGames;
}

// Create game card HTML
function createGameCard(game) {
    const imageExists = game.imagePath;
    return `
        <div class="game-card" data-game-name="${game.name.toLowerCase()}" data-game-desc="${game.description.toLowerCase()}">
            <div class="game-thumbnail">
                ${imageExists ? 
                    `<img src="${game.imagePath}" alt="${game.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">` + 
                    `<div class="placeholder-icon" style="display: none"></div>` :
                    `<div class="placeholder-icon"></div>`
                }
            </div>
            <h3>${game.name.replace(/[🎮🌈🎯🎲🎪🎨🎭🎪🔥⭐🌟💎🎊🎉]/g, '').trim()}</h3>
            <p>${game.description}</p>
            <button class="play-btn" onclick="openGame('${game.gamePath}')">PLAY NOW</button>
        </div>
    `;
}

// Render games to the grid
function renderGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    
    if (filteredGames.length === 0) {
        showPlaceholder();
        return;
    }
    
    const gameCards = filteredGames.map(createGameCard).join('');
    const comingSoonCard = `
        <div class="game-card">
            <div class="game-thumbnail">
                <div class="placeholder-icon"></div>
            </div>
            <h3>COMING SOON</h3>
            <p>More games will be added here</p>
            <button class="play-btn" disabled>COMING SOON</button>
        </div>
    `;
    
    gamesGrid.innerHTML = gameCards + comingSoonCard;
}

// Show placeholder when no games
function showPlaceholder() {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = `
        <div class="game-card">
            <div class="game-thumbnail">
                <div class="placeholder-icon"></div>
            </div>
            <h3>NO GAMES FOUND</h3>
            <p>Add some games to get started</p>
            <button class="play-btn" disabled>COMING SOON</button>
        </div>
    `;
}

// Search/Filter functionality
function filterGames() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    
    if (searchTerm === '') {
        filteredGames = [...allGames];
    } else {
        filteredGames = allGames.filter(game => 
            game.name.toLowerCase().includes(searchTerm) ||
            game.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderGames();
}

// Open game in new blank tab
function openGame(gamePath) {
    const newTab = window.open('about:blank', '_blank');
    newTab.location.href = gamePath;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthOnLoad();
    
    // Add Enter key support for password
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    document.getElementById('usernameInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('passwordInput').focus();
        }
    });
});