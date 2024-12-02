const API_URL = "https://darkness.ashlynn.workers.dev/chat/";
const MODEL = "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo";

const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

const chatHistory = []; // Sohbet geçmişi

// Mesaj gönderme işlevi
sendButton.addEventListener("click", async () => {
    const userMessage = userInput.value.trim();
    if (!userMessage) return; // Boş mesajları engelle

    // Kullanıcı mesajını arayüze ekle
    addMessage("user", userMessage);
    userInput.value = ""; // Alanı temizle

    try {
        // API'ye istekte bulun
        const response = await fetch(`${API_URL}?prompt=${encodeURIComponent(userMessage)}&model=${MODEL}`);
        const data = await response.text();

        // Cevabı arayüze ekle
        addMessage("bot", data);
    } catch (error) {
        console.error("API error:", error);
        addMessage("bot", "An error occurred. Please try again.");
    }
});

// Mesaj ekleme işlevi
function addMessage(sender, text) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);

    // Kod bloklarını belirgin şekilde göstermek için düzenleme
    if (text.startsWith("```") && text.endsWith("```")) {
        const language = text.split("\n")[0].replace(/```/g, "").trim(); // Kod türünü al
        const code = text.split("\n").slice(1, -1).join("\n");

        messageElement.innerHTML = `
            <pre><code class="language-${language}">${escapeHTML(code)}</code></pre>
        `;
    } else {
        messageElement.textContent = text;
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Otomatik kaydırma
    chatHistory.push({ sender, text }); // Sohbet geçmişine ekle
}

// HTML kaçış işlevi (XSS önleme)
function escapeHTML(string) {
    return string.replace(/[&<>"']/g, function (match) {
        const escape = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
        return escape[match];
    });
}

// Uzun kodları otomatik indirilebilir yapma
function handleLongCode(text) {
    if (text.length > 500) {
        const blob = new Blob([text], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "code.txt";
        link.textContent = "Download Code";
        chatMessages.appendChild(link);
    }
}
