// ===== Valentine's Day Magic for Elizabeth =====

// ===== Configuration =====
const CONFIG = {
    loveMessage: `Eight years. Eight beautiful, incredible years of building a life with you — and I still fall more in love with you every single day.

You are not just my partner, you are my best friend, my rock, and the most amazing mother to our sweet Zoe. Watching you love her, guide her, and light up her world fills my heart in ways I never knew possible.

Thank you for standing by me through everything — the highs, the lows, and every moment in between. Thank you for choosing us, every single day.

And now, as we wait for our little boy to arrive in July, I can't help but feel overwhelmed with gratitude. You've given me the most beautiful family I could ever dream of, and I promise to spend the rest of my life making sure you know how loved you are.

So my darling Elizabeth, I have one very important question to ask you...`,
    typingSpeed: 40,
    heartEmojis: ['💕', '💗', '💖', '💝', '💓', '❤️', '🌹', '✨'],
    noButtonMessages: [
        "Are you sure? 🥺",
        "Please reconsider! 💕",
        "I'll be so sad... 😢",
        "Just click Yes! 💗",
        "You can't escape love! 💖",
        "Resistance is futile! 🌹",
        "My heart needs you! ❤️"
    ]
};

// ===== State =====
let noClickCount = 0;
let typingComplete = false;

// ===== DOM Elements =====
const els = {
    envelope: document.getElementById('envelope'),
    envelopeSection: document.getElementById('envelope-section'),
    letterSection: document.getElementById('letter-section'),
    questionSection: document.getElementById('question-section'),
    celebrationSection: document.getElementById('celebration-section'),
    typedText: document.getElementById('typed-text'),
    continueBtn: document.getElementById('continue-btn'),
    yesBtn: document.getElementById('yes-btn'),
    noBtn: document.getElementById('no-btn'),
    hint: document.getElementById('hint'),
    heartsContainer: document.getElementById('hearts'),
    confettiCanvas: document.getElementById('confetti-canvas'),
    bgMusic: document.getElementById('bg-music'),
    musicToggle: document.getElementById('music-toggle')
};

// ===== Music State =====
let musicPlaying = false;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    setupEnvelope();
    setupButtons();
    setupMusic();
});

// ===== Music Controls =====
function setupMusic() {
    els.musicToggle.addEventListener('click', toggleMusic);
    
    // Update button when music ends/plays
    els.bgMusic.addEventListener('play', () => {
        musicPlaying = true;
        els.musicToggle.textContent = '🔊';
    });
    
    els.bgMusic.addEventListener('pause', () => {
        musicPlaying = false;
        els.musicToggle.textContent = '🔇';
    });
    
    // Fallback loop - restart if it ends (belt and suspenders)
    els.bgMusic.addEventListener('ended', () => {
        els.bgMusic.currentTime = 0;
        els.bgMusic.play();
    });
}

function toggleMusic() {
    if (musicPlaying) {
        els.bgMusic.pause();
    } else {
        els.bgMusic.play();
    }
}

function startMusic() {
    els.bgMusic.loop = true; // Ensure looping
    els.bgMusic.volume = 0.4; // Gentle volume
    els.bgMusic.play().catch(() => {
        // Autoplay blocked, that's okay
    });
}

// ===== Floating Hearts Background =====
function createFloatingHearts() {
    const numHearts = 15;
    
    for (let i = 0; i < numHearts; i++) {
        setTimeout(() => {
            createHeart();
        }, i * 500);
    }
    
    // Continuously add new hearts
    setInterval(createHeart, 2000);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = CONFIG.heartEmojis[Math.floor(Math.random() * CONFIG.heartEmojis.length)];
    
    // Random position and properties
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (8 + Math.random() * 8) + 's';
    heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    heart.style.animationDelay = Math.random() * 2 + 's';
    
    els.heartsContainer.appendChild(heart);
    
    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, 20000);
}

// ===== Envelope Animation =====
function setupEnvelope() {
    els.envelope.addEventListener('click', openEnvelope);
    els.envelope.addEventListener('touchend', (e) => {
        e.preventDefault();
        openEnvelope();
    });
}

function openEnvelope() {
    els.envelope.classList.add('opened');
    
    // Start the romantic music
    startMusic();
    
    // Transition to letter after envelope opens
    setTimeout(() => {
        els.envelopeSection.classList.add('hidden');
        els.letterSection.classList.remove('hidden');
        startTyping();
    }, 800);
}

// ===== Typewriter Effect =====
function startTyping() {
    const text = CONFIG.loveMessage;
    let index = 0;
    
    // Add cursor
    els.typedText.innerHTML = '<span class="cursor"></span>';
    
    function typeChar() {
        if (index < text.length) {
            const char = text[index];
            
            // Handle newlines
            if (char === '\n') {
                els.typedText.innerHTML = els.typedText.innerHTML.replace('<span class="cursor"></span>', '') + 
                    '<br><span class="cursor"></span>';
            } else {
                els.typedText.innerHTML = els.typedText.innerHTML.replace('<span class="cursor"></span>', '') + 
                    char + '<span class="cursor"></span>';
            }
            
            index++;
            
            // Variable speed for natural feel
            const delay = char === '.' || char === ',' || char === '!' || char === '?' 
                ? CONFIG.typingSpeed * 5 
                : CONFIG.typingSpeed;
            
            setTimeout(typeChar, delay);
        } else {
            // Typing complete
            typingComplete = true;
            // Remove cursor after a moment
            setTimeout(() => {
                const cursor = els.typedText.querySelector('.cursor');
                if (cursor) cursor.remove();
            }, 1500);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeChar, 500);
}

// ===== Button Interactions =====
function setupButtons() {
    els.continueBtn.addEventListener('click', showQuestion);
    els.yesBtn.addEventListener('click', celebrate);
    
    // No button magic - runs away!
    els.noBtn.addEventListener('mouseenter', moveNoButton);
    els.noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });
    els.noBtn.addEventListener('click', handleNoClick);
}

function showQuestion() {
    els.letterSection.classList.add('hidden');
    els.questionSection.classList.remove('hidden');
}

function moveNoButton() {
    noClickCount++;
    
    // Show hints
    if (noClickCount <= CONFIG.noButtonMessages.length) {
        els.hint.textContent = CONFIG.noButtonMessages[noClickCount - 1];
    }
    
    // Make the button run away
    const container = els.noBtn.parentElement;
    const containerRect = container.getBoundingClientRect();
    const btnRect = els.noBtn.getBoundingClientRect();
    
    // Calculate random position within viewport
    const maxX = window.innerWidth - btnRect.width - 20;
    const maxY = window.innerHeight - btnRect.height - 20;
    
    const randomX = Math.max(20, Math.random() * maxX);
    const randomY = Math.max(20, Math.random() * maxY);
    
    // Move button to fixed position
    els.noBtn.style.position = 'fixed';
    els.noBtn.style.left = randomX + 'px';
    els.noBtn.style.top = randomY + 'px';
    els.noBtn.style.zIndex = '100';
    
    // Make button smaller each time
    const scale = Math.max(0.5, 1 - (noClickCount * 0.1));
    els.noBtn.style.transform = `scale(${scale})`;
    
    // Eventually hide the button
    if (noClickCount >= 7) {
        els.noBtn.style.opacity = '0';
        setTimeout(() => {
            els.noBtn.style.display = 'none';
            els.hint.textContent = "There's only one choice now... 💕";
        }, 300);
    }
}

function handleNoClick() {
    // If somehow they manage to click it
    els.hint.textContent = "Nice try! But you can't say no to love! 💕";
    moveNoButton();
}

// ===== Celebration =====
function celebrate() {
    els.questionSection.classList.add('hidden');
    els.celebrationSection.classList.remove('hidden');
    
    // Start confetti!
    startConfetti();
    
    // Add extra floating hearts
    for (let i = 0; i < 20; i++) {
        setTimeout(createHeart, i * 100);
    }
    
    // Vibrate on mobile if supported
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
}

// ===== Confetti Animation =====
function startConfetti() {
    const canvas = els.confettiCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#b76e79', '#d4a5a5', '#f8e1e4', '#d4af37', '#ff69b4', '#ff1493'];
    
    // Create confetti particles
    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 4 - 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let activeConfetti = 0;
        
        confetti.forEach(p => {
            if (p.y < canvas.height + 50) {
                activeConfetti++;
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                
                if (p.shape === 'rect') {
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.restore();
                
                // Update position
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;
                
                // Add some wobble
                p.speedX += Math.random() * 0.2 - 0.1;
            }
        });
        
        if (activeConfetti > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
    
    // Keep adding confetti bursts
    let bursts = 0;
    const burstInterval = setInterval(() => {
        bursts++;
        for (let i = 0; i < 30; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: -20,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 4 - 2,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }
        if (bursts >= 5) clearInterval(burstInterval);
    }, 1000);
}

// ===== Handle window resize for confetti =====
window.addEventListener('resize', () => {
    if (els.confettiCanvas) {
        els.confettiCanvas.width = window.innerWidth;
        els.confettiCanvas.height = window.innerHeight;
    }
});
