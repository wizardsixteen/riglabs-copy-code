const codeElement = document.getElementById('code-content');
const statusElement = document.getElementById('copy-status');
const footerElement = document.querySelector('.code-footer');
const themeToggle = document.getElementById('theme-toggle');
const shareButton = document.getElementById('share-button');
const html = document.documentElement;
const logoImage = document.querySelector('.logo-link img');

// Theme toggle functionality
function toggleTheme(e) {
    e.stopPropagation();

    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);

    themeToggle.querySelector('.material-icons-outlined').textContent =
        newTheme === 'light' ? 'dark_mode' : 'light_mode';

    logoImage.src = newTheme === 'light' ? './logo.svg' : './dark-logo.svg';

    localStorage.setItem('theme', newTheme);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.querySelector('.material-icons-outlined').textContent =
        savedTheme === 'light' ? 'dark_mode' : 'light_mode';

    logoImage.src = savedTheme === 'light' ? './logo.svg' : './dark-logo.svg';
}

themeToggle.addEventListener('click', toggleTheme);
initializeTheme();

function highlightCode(code) {
    const lines = code.split('\n');
    const numberedLines = lines.map((line, index) => {
        const lineNumber = index + 1;
        return `<span class="line-number">${lineNumber}</span><span class="line-content">${line}</span>`;
    });

    return numberedLines.join('\n');
}

fetch('../paste-content-here.txt')
    .then(response => response.text())
    .then(data => {
        if (!data.trim()) {
            codeElement.textContent = 'No code available.';
            document.getElementById('copy-button').disabled = true;
        } else {
            const originalCode = data;
            // Replacing < and > to ensure they show correctly
            const fixedCode = originalCode.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            codeElement.innerHTML = highlightCode(fixedCode);
            codeElement.setAttribute('data-raw', originalCode);

            const copyButton = document.getElementById('copy-button');
            copyButton.addEventListener('click', async function () {
                try {
                    const rawCode = codeElement.getAttribute('data-raw');
                    await navigator.clipboard.writeText(rawCode);

                    copyButton.classList.add('clicked');
                    setTimeout(() => {
                        copyButton.classList.remove('clicked');
                    }, 1500);

                    statusElement.textContent = 'Code copied to clipboard!';
                    statusElement.classList.add('show');
                    setTimeout(() => {
                        statusElement.classList.remove('show');
                    }, 3000);
                } catch (err) {
                    statusElement.textContent = 'Failed to copy code';
                    statusElement.classList.add('show');
                    setTimeout(() => {
                        statusElement.classList.remove('show');
                    }, 3000);
                }
            });

            document.getElementById('copy-button').disabled = false;
        }
    })
    .catch(error => {
        codeElement.textContent = 'Failed to load code.';
        document.getElementById('copy-button').disabled = true;
        console.error(error);
    });

function createConfetti(x, y) {
    const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#F44336'];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    const pieces = 50;
    const spread = 60;

    for (let i = 0; i < pieces; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const size = Math.random() * 3 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;

        const rotation = Math.random() * 360;
        const initialRotation = Math.random() * 360;

        const angle = (i / pieces) * 360 + Math.random() * 30;
        const radians = (angle * Math.PI) / 180;
        const distance = Math.random() * spread;

        const left = x + distance * Math.cos(radians);
        const top = y + distance * Math.sin(radians);

        confetti.style.left = `${left}px`;
        confetti.style.top = `${top}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${initialRotation}deg)`;

        confetti.style.animation = `
            confettiSpread 1.2s cubic-bezier(0.45, 0, 0.55, 1) forwards,
            confettiRotate ${0.8 + Math.random() * 0.4}s linear infinite
        `;

        container.appendChild(confetti);
    }

    setTimeout(() => {
        container.remove();
    }, 1200);
}

async function shortenURL(url) {
    try {
        const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('URL shortening failed');
        const data = await response.json();
        return data.shorturl;
    } catch (error) {
        console.error('Error shortening URL:', error);
        return url;
    }
}

shareButton.addEventListener('click', async function () {
    const currentURL = window.location.href;

    try {
        shareButton.classList.add('loading');
        statusElement.textContent = 'Shortening URL...';
        statusElement.classList.add('show');

        const shortURL = await shortenURL(currentURL);
        await navigator.clipboard.writeText(shortURL);

        shareButton.classList.remove('loading');
        statusElement.textContent = 'Shortened URL copied to clipboard!';
        setTimeout(() => {
            statusElement.classList.remove('show');
        }, 3000);
    } catch (err) {
        shareButton.classList.remove('loading');
        statusElement.textContent = 'Failed to shorten and copy URL';
        statusElement.classList.add('show');
        setTimeout(() => {
            statusElement.classList.remove('show');
        }, 3000);
    }
});
