// ==========================================================================
// Chatbot Assistant Interaction Engine
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chat-messages");
    const suggestionChips = document.querySelectorAll(".suggestion-chip");
    const robotSpeech = document.getElementById("robot-speech");

    if (!chatMessages) return;

    const botAnswers = {
        strengths: "Misbah's key strengths lie in designing autonomous agent reasoning systems (ReAct, Planning), building neural network architectures, and developing algorithmic solutions in Python. He is highly detail-oriented and focuses on clean architecture.",
        stack: "His primary tech stack includes Python, PyTorch, SQL, Git, and HTML/CSS/JavaScript. He specializes in utilizing large language models and building agent frameworks.",
        projects: "He has built a NumericalAnalysis Solver that dynamically computes step-by-step matrix and bisection solutions, and is currently developing autonomous multi-agent reasoning models.",
        about: "I'm a 3rd year AI Engineering student with a passion for building intelligent agents that solve real-world problems. I enjoy designing systems that can reason, plan, and act autonomously.",
        role: "Misbah is currently in his 3rd academic year of AI Engineering and is actively seeking a junior position or internship where he can contribute to cutting-edge AI systems."
    };

    function addMessage(sender, text) {
        const bubble = document.createElement("div");
        bubble.classList.add("chat-bubble");
        bubble.classList.add(sender === "bot" ? "bubble-bot" : "bubble-user");
        bubble.textContent = text;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function botRespond(queryType) {
        // Remove typing indicator if any previous is stuck
        const prevTyping = document.getElementById("bot-typing");
        if (prevTyping) prevTyping.remove();

        // Append temporary Typing... bubble
        const typingBubble = document.createElement("div");
        typingBubble.classList.add("chat-bubble", "bubble-bot");
        typingBubble.textContent = "Typing...";
        typingBubble.id = "bot-typing";
        chatMessages.appendChild(typingBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Update mascot text
        if (robotSpeech) robotSpeech.textContent = "Analyzing...";

        setTimeout(() => {
            const typing = document.getElementById("bot-typing");
            if (typing) typing.remove();

            let reply = "";
            if (queryType && botAnswers[queryType]) {
                reply = botAnswers[queryType];
                if (robotSpeech) robotSpeech.textContent = "Found it!";
            } else {
                reply = "That's an interesting query! Misbah is dedicated to building state-of-the-art agent architectures. You can reach him directly at bazina.misbah@gmail.com for detailed inquiries.";
                if (robotSpeech) robotSpeech.textContent = "Here it is!";
            }

            addMessage("bot", reply);
            
            // Reset mascot speech bubble text after 3s
            if (robotSpeech) {
                setTimeout(() => {
                    robotSpeech.textContent = "Ask me!";
                }, 3000);
            }

        }, 750);
    }

    // Click listener for suggestions chips
    suggestionChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const type = chip.getAttribute("data-type");
            const textText = chip.textContent;
            addMessage("user", textText);
            botRespond(type);
        });
    });
});
