// Login functionality
const PASSWORD = 'goon';

// Check if user is already authenticated
const isAuthenticated = () => {
    return localStorage.getItem('authenticated') === 'true';
};

// Set authentication status
const setAuthenticated = (status) => {
    localStorage.setItem('authenticated', status);
};

// Initialize login system
const initializeLogin = () => {
    // If already authenticated, show content
    if (isAuthenticated()) {
        document.body.classList.remove('locked');
        return;
    }

    // Create login overlay
    const overlay = document.createElement('div');
    overlay.className = 'login-overlay';
    overlay.innerHTML = `
        <div class="login-container">
            <h2>Enter Password</h2>
            <input type="password" id="password-input" placeholder="Enter password">
            <button id="submit-password">Submit</button>
            <p id="login-error" class="error-message"></p>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add('locked');

    // Add event listeners
    const passwordInput = document.getElementById('password-input');
    const submitButton = document.getElementById('submit-password');
    const errorMessage = document.getElementById('login-error');

    const handleSubmit = () => {
        if (passwordInput.value === PASSWORD) {
            setAuthenticated(true);
            document.body.classList.remove('locked');
            overlay.remove();
        } else {
            errorMessage.textContent = 'Incorrect password';
            passwordInput.value = '';
        }
    };

    submitButton.addEventListener('click', handleSubmit);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLogin);