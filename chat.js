document.getElementById("sendButton").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", function() {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(tab.getAttribute("data-tab")).classList.add("active");
    });
});

document.getElementById("saveSettingsButton").addEventListener("click", saveSettings);

let messages = [];

function saveSettings() {
    const username = document.getElementById("username").value;
    const profilePic = document.getElementById("profilePic").value;
    
    localStorage.setItem("username", username);
    localStorage.setItem("profilePic", profilePic);

    alert("Ayarlar kaydedildi!");
}

function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const username = localStorage.getItem("username") || "Anonim";
    const profilePic = localStorage.getItem("profilePic") || "default-profile.png";

    if (userInput.trim() === "") return;

    const timestamp = new Date().toLocaleTimeString();
    appendMessage(username, userInput, profilePic, timestamp);
    messages.push({ sender: username, message: userInput, profilePic, timestamp });

    document.getElementById("userInput").value = "";

    fetch(`https://darkness.ashlynn.workers.dev/chat/?prompt=${encodeURIComponent(userInput)}&=meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`)
        .then(response => response.json())
        .then(data => {
            const responseMessage = formatMessage(data.response);
            appendMessage("API", responseMessage, "api-profile.png", timestamp);
            messages.push({ sender: "API", message: responseMessage, profilePic: "api-profile.png", timestamp });
        })
        .catch(error => {
            console.error("Error fetching API:", error);
            appendMessage("API", "API çağrısında bir hata oluştu.", "error-profile.png", timestamp);
            setTimeout(() => sendMessage(userInput), 3000); // Yeniden deneme mekanizması
        });
}

function formatMessage(message) {
    // Kod bloklarını algıla ve vurgula
    const codePattern = /(```[\s\S]*?```)/g;
    return message.replace(codePattern, match => `<pre>${match.replace(/```/g, '')}</pre>`);
}

function appendMessage(sender, message, profilePic, timestamp) {
    const chatBox = document.getElementById("chatBox");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `<img src="${profilePic}" alt="Profile Picture"><div><strong>${sender}:</strong> ${message} <span style="font-size: 0.8em; color: #888;">(${timestamp})</span></div>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function saveMessages() {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
}

function loadMessages() {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
        messages.forEach(msg => appendMessage(msg.sender, msg.message, msg.profilePic, msg.timestamp));
    }
}

window.onload = loadMessages;
window.onunload = saveMessages;