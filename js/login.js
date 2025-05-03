document.addEventListener('DOMContentLoaded', () => {
    const PASSWORD = 'goon';
    const loginOverlay = document.querySelector('.login-overlay');
    const passwordInput = document.getElementById('password-input');
    const submitButton = document.getElementById('submit-password');
    const errorMessage = document.querySelector('.error-message');
    const body = document.body;

    // Check if user is already authenticated
    if (localStorage.getItem('authenticated') === 'true') {
        loginOverlay.style.display = 'none';
        body.classList.remove('locked');
        return;
    }

    const handleSubmit = () => {
        const password = passwordInput.value;
        
        if (password === PASSWORD) {
            localStorage.setItem('authenticated', 'true');
            loginOverlay.style.display = 'none';
            body.classList.remove('locked');
            errorMessage.textContent = '';
            passwordInput.value = '';
        } else {
            errorMessage.textContent = 'Incorrect password. Please try again.';
            passwordInput.value = '';
        }
    };

    submitButton.addEventListener('click', handleSubmit);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
});