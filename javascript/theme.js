document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js-enabled');

// Theme toggle functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const sunIcon = `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`;
    const moonIcon = `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"/></svg>`;
    const forestIcon = `<svg viewBox="-100 -200 200 400" width="24" height="24"><polygon points="0,0 80,120 -80,120" fill="white" /><polygon points="0,-40 60,60 -60,60" fill="white" /><polygon points="0,-80 40,0 -40,0" fill="white" /><rect x="-20" y="120" width="40" height="30" fill="white" /></svg>`;

    function updateThemeAndIcon(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'light') {
            themeToggle.innerHTML = sunIcon;
        } else if(theme === 'dark'){
            themeToggle.innerHTML = moonIcon;
        } else {
            themeToggle.innerHTML = forestIcon;
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    updateThemeAndIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme;
        
        if (currentTheme === 'light') {
            newTheme = 'dark';
        } else if (currentTheme === 'dark') {
            newTheme = 'forest';
        } else {
            newTheme = 'light';
        }
        
        updateThemeAndIcon(newTheme);
    });
}

// Initialize theme when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

 // Hamburger menu functionality
 document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburgerBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !navLinks.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});

// Form validation code
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const commentsInput = document.getElementById('comments');
    const formErrors = [];

    // Function to update character countdown
    const updateCharacterCountdown = () => {
        const remaining = 500 - commentsInput.value.length;
        const countdown = document.getElementById('comments-countdown');
        countdown.textContent = `${remaining} characters remaining`;
        if (remaining < 50) {
            countdown.style.color = remaining < 20 ? 'red' : 'orange';
        } else {
            countdown.style.color = 'inherit';
        }
    };

    // Function to handle input validation
    const handleValidation = (input, pattern, errorMessage) => {
        input.addEventListener('input', () => {
            const regex = new RegExp(pattern);
            if (!regex.test(input.value)) {
                input.setCustomValidity(errorMessage);
                input.reportValidity();
                formErrors.push({ field: input.name, error: errorMessage });
                input.classList.add('flash-error');
                setTimeout(() => input.classList.remove('flash-error'), 500);
            } else {
                input.setCustomValidity('');
            }
        });
    };

    // Function to enforce pattern and remove invalid characters
    const enforcePattern = (input, pattern) => {
        input.addEventListener('input', () => {
            const regex = new RegExp(pattern);
            if (!regex.test(input.value)) {
                input.value = input.value.replace(/[^A-Za-z\s]/g, '');
                input.classList.add('flash-error');
                setTimeout(() => input.classList.remove('flash-error'), 500);
            }
        });
    };

    // Apply validation and masking
    handleValidation(nameInput, '^[A-Za-z\\s]+$', 'Please enter a valid name (only letters and spaces).');
    handleValidation(commentsInput, '^[A-Za-z0-9 .,!?()&@#$%^*+=\\-_/]+$', 'Invalid character entered.');
    enforcePattern(nameInput, '^[A-Za-z\\s]+$');
    enforcePattern(commentsInput, '^[A-Za-z0-9 .,!?()&@#$%^*+=\\-_/]+$');

    // Update character countdown on input
    commentsInput.addEventListener('input', updateCharacterCountdown);

    // Submit form with errors
    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            alert('Please correct the errors in the form.');
        } else {
            const errorsField = document.createElement('input');
            errorsField.type = 'hidden';
            errorsField.name = 'form-errors';
            errorsField.value = JSON.stringify(formErrors);
            form.appendChild(errorsField);
        }
    });

    // Initialize character countdown
    updateCharacterCountdown();
});