// src/main/resources/public/script.js (COMPLETE REPLACEMENT)
document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    const restartButton = document.getElementById('restartButton');
    const feedbackText = document.getElementById('feedbackText');
    const triesCount = document.getElementById('triesCount');

    // Function to handle guessing
    const handleGuess = async () => {
        const guess = guessInput.value;
        if (!guess) return;

        // Send the guess to the Java backend using the "value" parameter.
        const response = await fetch(`/guess?value=${guess}`, { method: 'POST' });
        const data = await response.json();

        updateFeedback(data.message);
        triesCount.textContent = data.tries;

        if (data.gameOver) {
            guessButton.style.display = 'none';
            restartButton.style.display = 'inline-block';
        }
        guessInput.value = '';
        guessInput.focus();
    };

    // New function to handle themed feedback and styling
    function updateFeedback(message) {
        if (message === 'Too high!') {
            feedbackText.textContent = 'The wind rustles the high branches... a bit lower.';
            feedbackText.className = 'feedback-high';
        } else if (message === 'Too low!') {
            feedbackText.textContent = 'You hear a whisper from the forest floor... look higher.';
            feedbackText.className = 'feedback-low';
        } else if (message.includes('Congratulations')) {
            feedbackText.textContent = 'The heart of the forest reveals its secret!';
            feedbackText.className = 'feedback-correct';
        } else {
            feedbackText.textContent = message;
            feedbackText.className = '';
        }
    }

    // Function to handle restarting the game
    const handleRestart = async () => {
        await fetch('/restart', { method: 'POST' });
        
        feedbackText.textContent = 'The forest is quiet, awaiting your whisper.';
        feedbackText.className = '';
        triesCount.textContent = '0';
        guessInput.value = '';
        guessButton.style.display = 'inline-block';
        restartButton.style.display = 'none';
        guessInput.focus();
    };

    // Attach functions to button clicks
    guessButton.addEventListener('click', handleGuess);
    restartButton.addEventListener('click', handleRestart);

    // Allow pressing Enter to guess
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });

    guessInput.focus();
});