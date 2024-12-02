// Gerekli DOM elemanlarını seç
const chatArea = document.getElementById('chatArea');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Mesaj gönderme fonksiyonu
function sendMessage() {
    // Mesaj içeriğini al
    const messageText = messageInput.value.trim();
    
    // Boş mesaj kontrolü
    if (messageText === '') return;

    // Kullanıcı mesajını ekle
    const userMessageElement = document.createElement('div');
    userMessageElement.classList.add('bg-blue-100', 'p-3', 'rounded-lg', 'mb-2');
    userMessageElement.innerHTML = `
        <div class="flex items-start">
            <div class="mr-2">👤</div>
            <div>${messageText}</div>
        </div>
    `;
    chatArea.appendChild(userMessageElement);

    // Mesaj input alanını temizle
    messageInput.value = '';

    // Yapay zeka yanıtı
    setTimeout(() => {
        const aiResponses = [
            'Anladım, devam edebilirsiniz.',
            'Bu konuda daha fazla bilgi verebilir misiniz?',
            'İlginç bir yaklaşım.',
            'Söylediklerinizi değerlendirebilirim.'
        ];

        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

        const aiMessageElement = document.createElement('div');
        aiMessageElement.classList.add('bg-green-100', 'p-3', 'rounded-lg', 'mb-2');
        aiMessageElement.innerHTML = `
            <div class="flex items-start">
                <div class="mr-2">🤖</div>
                <div>${randomResponse}</div>
            </div>
        `;
        chatArea.appendChild(aiMessageElement);

        // Scroll'u en alta götür
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 500);

    // Scroll'u en alta götür
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Enter tuşu ve gönder butonu için event listener'lar
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
