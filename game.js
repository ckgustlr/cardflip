// Game State
const gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    timer: 0,
    timerInterval: null,
    isProcessing: false,
    gameStarted: false,
    gameEnded: false
};

// Squirrel-themed emoji set (8 pairs = 16 cards)
const EMOJIS = ['🐿️', '🌰', '🌲', '🍂', '🦔', '🦫', '🐻', '🦊'];

// Format time for display (seconds to MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Calculate star rating based on moves
function getStarRating(moves) {
    if (moves <= 12) return '★★★';
    if (moves <= 18) return '★★☆';
    if (moves <= 24) return '★☆☆';
    return '☆☆☆';
}

// Initialize game
function initGame() {
    // Reset game state
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.timer = 0;
    gameState.isProcessing = false;
    gameState.gameStarted = false;
    gameState.gameEnded = false;

    // Stop timer if running
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }

    // Create card pairs and shuffle
    const cardPairs = [...EMOJIS, ...EMOJIS];
    gameState.cards = shuffleArray(cardPairs);

    // Update UI
    updateStats();
    renderBoard();
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Render game board
function renderBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    gameState.cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-face card-front">
                <span class="card-emoji">${emoji}</span>
            </div>
            <div class="card-face card-back">
                <span class="card-back-pattern">🃏</span>
            </div>
        `;
        card.addEventListener('click', () => handleCardClick(index));
        gameBoard.appendChild(card);
    });
}

// Handle card click
function handleCardClick(index) {
    // Start timer on first card click
    if (!gameState.gameStarted) {
        startTimer();
        gameState.gameStarted = true;
    }

    // Prevent clicking during processing or on already flipped/matched cards
    if (gameState.isProcessing || gameState.gameEnded) return;

    const card = document.querySelector(`[data-index="${index}"]`);
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    // Prevent flipping more than 2 cards
    if (gameState.flippedCards.length >= 2) return;

    // Flip the card
    card.classList.add('flipped');
    gameState.flippedCards.push(index);

    // Check for match when 2 cards are flipped
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        updateStats();
        checkMatch();
    }
}

// Check if flipped cards match
function checkMatch() {
    gameState.isProcessing = true;

    const [index1, index2] = gameState.flippedCards;
    const card1 = document.querySelector(`[data-index="${index1}"]`);
    const card2 = document.querySelector(`[data-index="${index2}"]`);

    const emoji1 = gameState.cards[index1];
    const emoji2 = gameState.cards[index2];

    setTimeout(() => {
        if (emoji1 === emoji2) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            gameState.matchedPairs++;

            // Check if game is won
            if (gameState.matchedPairs === EMOJIS.length) {
                gameWon();
            }
        } else {
            // No match - flip cards back
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        gameState.flippedCards = [];
        gameState.isProcessing = false;
    }, 800);
}

// Start timer
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        updateStats();
    }, 1000);
}

// Stop timer
function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// Update stats display
function updateStats() {
    document.getElementById('moves').textContent = gameState.moves;
    document.getElementById('timer').textContent = formatTime(gameState.timer);
    
    const score = calculateScore(gameState.moves, gameState.timer);
    document.getElementById('score').textContent = score;
    
    const stars = getStarRating(gameState.moves);
    document.getElementById('stars').textContent = stars;
}

// Calculate score (perfect game = 8 moves = 1000 points)
function calculateScore(moves, timeSeconds) {
    if (moves === 0) return 0;
    
    // Base score: (8 / moves) × 1000
    const baseScore = Math.round((8 / moves) * 1000);
    
    // Time penalty (optional): small deduction for longer times
    // No penalty for first 30 seconds, then -1 point per second
    const timePenalty = Math.max(0, timeSeconds - 30);
    
    const finalScore = Math.max(0, baseScore - timePenalty);
    return finalScore;
}

// Game won
function gameWon() {
    gameState.gameEnded = true;
    stopTimer();

    const finalScore = calculateScore(gameState.moves, gameState.timer);
    const stars = getStarRating(gameState.moves);

    // Update modal
    document.getElementById('modalMoves').textContent = gameState.moves;
    document.getElementById('modalTime').textContent = formatTime(gameState.timer);
    document.getElementById('modalScore').textContent = finalScore;
    document.getElementById('modalStars').textContent = stars;

    // Show modal
    const modal = document.getElementById('victoryModal');
    modal.classList.add('show');

    // Focus on name input
    document.getElementById('playerName').focus();
}

// Save score and close modal
async function handleSaveScore() {
    console.log('handleSaveScore called');
    
    const playerNameInput = document.getElementById('playerName');
    const playerName = playerNameInput.value.trim();

    console.log('Player name:', playerName);

    if (!playerName) {
        alert('이름을 입력해주세요!');
        playerNameInput.focus();
        return;
    }

    const finalScore = calculateScore(gameState.moves, gameState.timer);
    console.log('Final score calculated:', finalScore);

    // Disable buttons during save
    const saveBtn = document.getElementById('saveScoreBtn');
    const skipBtn = document.getElementById('skipSaveBtn');
    saveBtn.disabled = true;
    skipBtn.disabled = true;
    saveBtn.textContent = '저장 중...';

    console.log('Calling saveScore function...');
    const result = await saveScore(playerName, gameState.moves, gameState.timer, finalScore);
    console.log('saveScore result:', result);

    if (result.success) {
        alert('점수가 저장되었습니다! 🎉');
        await displayLeaderboard(); // Refresh leaderboard
        closeModal();
        initGame(); // Start new game
    } else {
        alert(`점수 저장에 실패했습니다: ${result.error || '알 수 없는 오류'}`);
        saveBtn.disabled = false;
        skipBtn.disabled = false;
        saveBtn.textContent = '점수 저장';
    }
}

// Close modal without saving
function closeModal() {
    const modal = document.getElementById('victoryModal');
    modal.classList.remove('show');
    
    // Reset modal buttons
    const saveBtn = document.getElementById('saveScoreBtn');
    const skipBtn = document.getElementById('skipSaveBtn');
    saveBtn.disabled = false;
    skipBtn.disabled = false;
    saveBtn.textContent = '점수 저장';
    
    // Clear name input
    document.getElementById('playerName').value = '';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    initGame();

    // New game button
    document.getElementById('newGameBtn').addEventListener('click', () => {
        if (confirm('새 게임을 시작하시겠습니까?')) {
            initGame();
        }
    });

    // Modal buttons
    document.getElementById('saveScoreBtn').addEventListener('click', handleSaveScore);
    document.getElementById('skipSaveBtn').addEventListener('click', () => {
        closeModal();
        initGame();
    });

    // Allow Enter key to save score
    document.getElementById('playerName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSaveScore();
        }
    });

    // Close modal when clicking outside
    document.getElementById('victoryModal').addEventListener('click', (e) => {
        if (e.target.id === 'victoryModal') {
            closeModal();
            initGame();
        }
    });
});
