// ==================== GLOBAL VARIABLES ====================
const bgMusic = document.getElementById('bgMusic');
const overlay = document.getElementById('overlay');
const openBtn = document.getElementById('openBtn');
const heartsContainer = document.getElementById('heartsContainer');
const prankQuestion = document.getElementById('prankQuestion');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const musicToggle = document.getElementById('musicToggle');
const relationshipCounter = document.getElementById('relationshipCounter');

let musicStarted = false;
let noClickCount = 0;

// ==================== FLOATING HEARTS ANIMATION ====================
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';

    heartsContainer.appendChild(heart);

    // Remove heart after animation completes
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// Generate hearts continuously
setInterval(createHeart, 300);

// ==================== MUSIC CONTROL ====================
function startMusic() {
    if (!musicStarted) {
        bgMusic.play().catch(error => {
            console.log('Music autoplay prevented:', error);
        });
        musicStarted = true;
        musicToggle.textContent = '🎵';
    }
}

// Music Play/Pause Toggle
musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicStarted = true;
        musicToggle.textContent = '🎵';
    } else {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
    }
});

// ==================== SECTION NAVIGATION ====================
function showSection(sectionId) {
    // Hide all sections
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        setTimeout(() => {
            targetSection.classList.add('active');

            // Trigger extra features on specific sections
            if (sectionId === 'letter') {
                triggerConfetti();
                startFadeIn();
            }
        }, 100);
    }
}

// ==================== EVENT: OPEN INVITATION BUTTON ====================
openBtn.addEventListener('click', () => {
    startMusic();
    showSection('home');
});

// ==================== EVENT: ALL NEXT BUTTONS ====================
const nextButtons = document.querySelectorAll('.btn-next');
nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        const nextSection = button.getAttribute('data-next');
        showSection(nextSection);
    });
});

// ==================== EVENT: PRANK SECTION ====================
// "Yes" button - go to letter
yesBtn.addEventListener('click', () => {
    showSection('letter');
});

// "No" button - prank interaction
noBtn.addEventListener('click', () => {
    noClickCount++;

    if (noClickCount === 1) {
        prankQuestion.textContent = "Awh... try again please? 🥺";
        moveButtonRandomly();
    } else if (noClickCount === 2) {
        prankQuestion.textContent = "Please? I really want you to see it... 😢";
        moveButtonRandomly();
    } else if (noClickCount >= 3) {
        prankQuestion.textContent = "Pretty please with a cherry on top? 🍒";
        moveButtonRandomly();
    }
});

// Move "No" button to random position
function moveButtonRandomly() {
    const container = document.querySelector('#prank .content-wrapper');
    const containerRect = container.getBoundingClientRect();
    const buttonRect = noBtn.getBoundingClientRect();

    // Calculate random position within container bounds
    const maxX = containerRect.width - buttonRect.width - 40;
    const maxY = containerRect.height - buttonRect.height - 40;

    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;

    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

// ==================== PREVENT MUSIC PAUSE ON NAVIGATION ====================
// Ensure music continues playing across all sections
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && musicStarted) {
        bgMusic.play().catch(error => {
            console.log('Music resume prevented:', error);
        });
    }
});

// ==================== INITIAL HEARTS ====================
// Create initial hearts on page load
for (let i = 0; i < 15; i++) {
    setTimeout(createHeart, i * 200);
}

// ==================== SMOOTH SCROLL FOR LETTER SECTION ====================
const letterWrapper = document.querySelector('.letter-wrapper');
if (letterWrapper) {
    letterWrapper.style.scrollBehavior = 'smooth';
}

// ==================== SECRET EASTER EGG ====================
const secretImage = document.querySelector('.prank-image');
let secretClickCount = 0;
if (secretImage) {
    secretImage.style.cursor = 'pointer';
    secretImage.addEventListener('click', () => {
        secretClickCount++;
        if (secretClickCount === 5) {
            alert('Hehe, you found a secret! I love you! 💕');
            secretClickCount = 0;
        }
    });
}

// ==================== PHOTO MESSAGE MODAL ====================
function showMessage(text) {
    const modal = document.getElementById('messageModal');
    const modalText = document.getElementById('modalText');

    modalText.textContent = text;
    modal.classList.add('active');
}

function closeMessage() {
    document.getElementById('messageModal').classList.remove('active');
}

// ==================== EXTRA FEATURES ====================
// 1. Confetti Effect
function triggerConfetti() {
    if (typeof confetti === 'function') {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        function randomInRange(min, max) { return Math.random() * (max - min) + min; }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
}

// 2. Fade In Letter Effect
function startFadeIn() {
    const paragraphs = document.querySelectorAll('.letter-content p');
    paragraphs.forEach((p, index) => {
        // Delay each paragraph by 1.2s to create a typing/reading effect
        setTimeout(() => {
            p.classList.add('visible');
            // Auto scroll slightly to keep reading in view on mobile
            if (window.innerWidth <= 768) {
                const letterWrapper = document.querySelector('.letter-wrapper');
                letterWrapper.scrollTop = letterWrapper.scrollHeight;
            }
        }, index * 1200);
    });
}

// 3. Relationship Counter
// You can change this date! Format: Year, Month(0-11), Day
const anniversaryDate = new Date(2023, 0, 1);

function updateCounter() {
    if (!relationshipCounter) return;
    const now = new Date();
    const diffTime = Math.abs(now - anniversaryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    relationshipCounter.innerHTML = `We've been together for <b>${diffDays}</b> lovely days 💕`;
}
updateCounter();

// ==================== LOG INITIALIZATION ====================
console.log('💌 Valentine Website Loaded Successfully!');
console.log('🎵 Music will start when you click "Open Invitation"');
console.log('❤️ Enjoy the experience!');
