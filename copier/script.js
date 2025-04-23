const codeElement = document.getElementById('code-content');
const statusElement = document.getElementById('copy-status');
const footerElement = document.querySelector('.code-footer');
const themeToggle = document.getElementById('theme-toggle');
const shareButton = document.getElementById('share-button');
const html = document.documentElement;
const logoImage = document.querySelector('.logo-link img');

// Theme toggle functionality
function toggleTheme(e) {
    // Prevent event from bubbling up
    e.stopPropagation();
    
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    
    // Update icon
    themeToggle.querySelector('.material-icons-outlined').textContent = 
        newTheme === 'light' ? 'dark_mode' : 'light_mode';
    
    // Update logo
    logoImage.src = newTheme === 'light' ? './logo.svg' : './dark-logo.svg';
    
    // Save preference
    localStorage.setItem('theme', newTheme);
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    // Set initial icon
    themeToggle.querySelector('.material-icons-outlined').textContent = 
        savedTheme === 'light' ? 'dark_mode' : 'light_mode';
    
    // Set initial logo
    logoImage.src = savedTheme === 'light' ? './logo.svg' : './dark-logo.svg';
}

themeToggle.addEventListener('click', toggleTheme);
initializeTheme();

function highlightCode(code) {
    // Split code into lines and add line numbers
    const lines = code.split('\n');
    const numberedLines = lines.map((line, index) => {
        const lineNumber = index + 1;
        return `<span class="line-number">${lineNumber}</span><span class="line-content">${highlightSyntax(line)}</span>`;
    });
    
    return numberedLines.join('\n');
}

function highlightSyntax(line) {
    // Escape HTML tags first
    line = line.replace(/[<>&]/g, function(match) {
        return {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
        }[match];
    });

    // HTML/XML tags
    line = line.replace(/(&lt;\/?[a-zA-Z0-9-]+(?:\s+[a-zA-Z0-9-]+="[^"]*")*\s*\/?\&gt;)/g, '<span class="tag">$1</span>');
    
    // Keywords for multiple languages
    const keywords = [
        // JavaScript
        'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'extends',
        'new', 'try', 'catch', 'throw', 'async', 'await', 'import', 'export', 'default',
        // Python
        'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'import', 'from', 'as',
        // C/C++
        'int', 'float', 'double', 'char', 'void', 'struct', 'union', 'enum', 'typedef',
        // C#
        'using', 'namespace', 'public', 'private', 'protected', 'class', 'interface', 'static'
    ];
    
    const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    line = line.replace(keywordPattern, '<span class="keyword">$1</span>');

    // Strings (single quotes, double quotes, and template literals)
    line = line.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="string">$1</span>');
    
    // Comments (single line and multi-line)
    line = line.replace(/(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/g, '<span class="comment">$1</span>');
    
    // Numbers
    line = line.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="number">$1</span>');
    
    // Functions
    line = line.replace(/\b([A-Za-z_]\w*)\s*\(/g, '<span class="function">$1</span>(');
    
    // CSS Properties and Values
    line = line.replace(/([a-z-]+)\s*:/g, '<span class="property">$1</span>:');
    line = line.replace(/:\s*([^;]+);/g, ': <span class="value">$1</span>;');
    
    return line;
}

fetch('../paste-content-here.txt')
  .then(response => response.text())
  .then(data => {
    if (!data.trim()) {
      codeElement.textContent = 'No code available.';
      document.getElementById('copy-button').disabled = true;
    } else {
      codeElement.innerHTML = highlightCode(data);
      // Update copy functionality to remove line numbers when copying
      const originalCode = data;
      const copyButton = document.getElementById('copy-button');
      copyButton.addEventListener('click', async function(e) {
        try {
          await navigator.clipboard.writeText(originalCode);
          
          // Add clicked class for animation
          copyButton.classList.add('clicked');
          
          setTimeout(() => {
            copyButton.classList.remove('clicked');
          }, 1500);

          // Show toast notification
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
    
    const pieces = 50; // Increased number of pieces
    const spread = 60; // Increased spread radius
    
    for (let i = 0; i < pieces; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random size between 5-8px
        const size = Math.random() * 3 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Random rotation
        const rotation = Math.random() * 360;
        const initialRotation = Math.random() * 360;
        
        // Random position within spread radius
        const angle = (i / pieces) * 360 + Math.random() * 30;
        const radians = (angle * Math.PI) / 180;
        const distance = Math.random() * spread;
        
        const left = x + (distance * Math.cos(radians));
        const top = y + (distance * Math.sin(radians));
        
        confetti.style.left = `${left}px`;
        confetti.style.top = `${top}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${initialRotation}deg)`;
        
        // Add custom animation
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

// URL shortening functionality
async function shortenURL(url) {
    try {
        const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error('URL shortening failed');
        }
        const data = await response.json();
        return data.shorturl;
    } catch (error) {
        console.error('Error shortening URL:', error);
        return url; // Return original URL if shortening fails
    }
}

// Share button functionality
shareButton.addEventListener('click', async function() {
    const currentURL = window.location.href;
    
    try {
        // Show loading state
        shareButton.classList.add('loading');
        statusElement.textContent = 'Shortening URL...';
        statusElement.classList.add('show');
        
        // Get shortened URL
        const shortURL = await shortenURL(currentURL);
        await navigator.clipboard.writeText(shortURL);
        
        // Remove loading state
        shareButton.classList.remove('loading');

        // Show success message
        statusElement.textContent = 'Shortened URL copied to clipboard!';
        setTimeout(() => {
            statusElement.classList.remove('show');
        }, 3000);
    } catch (err) {
        // Remove loading state
        shareButton.classList.remove('loading');
        
        // Show error message
        statusElement.textContent = 'Failed to shorten and copy URL';
        statusElement.classList.add('show');
        setTimeout(() => {
            statusElement.classList.remove('show');
        }, 3000);
    }
});
