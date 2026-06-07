/**
 * BazinaBot — FAQ chatbot for Misbah Bazina's portfolio.
 * Responds to predefined questions via suggestion chips.
 */

/** @type {Record<string, string>} FAQ response database keyed by topic. */
const BOT_RESPONSES = {
    strengths: 'Misbah\'s key strengths lie in designing autonomous agent reasoning systems (ReAct, Planning), building neural network architectures, and developing algorithmic solutions in Python. He is highly detail-oriented and focuses on clean architecture.',
    stack: 'His primary tech stack includes Python, PyTorch, SQL, Git, and HTML/CSS/JavaScript. He specializes in utilizing large language models and building agent frameworks.',
    projects: 'He has built a NumericalAnalysis Solver that dynamically computes step-by-step matrix and bisection solutions, and is currently developing autonomous multi-agent reasoning models.',
    about: 'I\'m a 3rd year AI Engineering student with a passion for building intelligent agents that solve real-world problems. I enjoy designing systems that can reason, plan, and act autonomously.',
    role: 'Misbah is currently in his 3rd academic year of AI Engineering and is actively seeking a junior position or internship where he can contribute to cutting-edge AI systems.',
};

const TYPING_DELAY_MS = 750;
const SPEECH_RESET_MS = 3000;

/**
 * Creates and appends a chat bubble to the message container.
 * @param {'bot'|'user'} sender - Who sent the message.
 * @param {string} text - The message content.
 * @param {HTMLElement} container - The chat messages container.
 */
function addChatMessage(sender, text, container) {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', sender === 'bot' ? 'bubble-bot' : 'bubble-user');
    bubble.textContent = text;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

/**
 * Updates the robot mascot's speech bubble text.
 * @param {HTMLElement|null} speechEl - The speech bubble element.
 * @param {string} text - The text to display.
 */
function updateRobotSpeech(speechEl, text) {
    if (speechEl) speechEl.textContent = text;
}

/**
 * Handles a bot response: shows typing indicator, then reveals the answer.
 * @param {string} queryType - The FAQ topic key.
 * @param {HTMLElement} chatContainer - The chat messages container.
 * @param {HTMLElement|null} robotSpeech - The robot speech bubble element.
 */
function triggerBotResponse(queryType, chatContainer, robotSpeech) {
    // Clean up any stuck typing indicator
    const staleTyping = document.getElementById('bot-typing');
    if (staleTyping) staleTyping.remove();

    // Show typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.classList.add('chat-bubble', 'bubble-bot');
    typingBubble.id = 'bot-typing';
    typingBubble.setAttribute('aria-label', 'Bot is typing');
    typingBubble.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
    chatContainer.appendChild(typingBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    updateRobotSpeech(robotSpeech, 'Analyzing...');

    setTimeout(() => {
        const typing = document.getElementById('bot-typing');
        if (typing) typing.remove();

        const reply = BOT_RESPONSES[queryType] || 
            'That\'s an interesting query! You can reach Misbah directly at bazina.misbah@gmail.com for detailed inquiries.';

        addChatMessage('bot', reply, chatContainer);
        updateRobotSpeech(robotSpeech, 'Found it!');

        setTimeout(() => updateRobotSpeech(robotSpeech, 'Ask me!'), SPEECH_RESET_MS);
    }, TYPING_DELAY_MS);
}

/* Initialize chatbot on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-messages');
    const chips = document.querySelectorAll('.suggestion-chip');
    const robotSpeech = document.getElementById('robot-speech');

    if (!chatContainer) return;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const topic = chip.dataset.type;
            const label = chip.textContent;
            addChatMessage('user', label, chatContainer);
            triggerBotResponse(topic, chatContainer, robotSpeech);
        });
    });
});
