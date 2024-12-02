document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    const chatArea = document.getElementById('chatArea');

    console.log('Butonlar yüklendi:', {
        sendButton: !!sendButton,
        messageInput: !!messageInput,
        chatArea: !!chatArea
    });

    if (!sendButton || !messageInput || !chatArea) {
        console.error('DOM elemanları bulunamadı!');
        return;
    }

    function sendMessage() {
        console.log('Mesaj gönderme fonksiyonu çağrıldı');
        const message = messageInput.value.trim();
        
        if (message === '') {
            console.warn('Boş mesaj');
            return;
        }

        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chatArea.appendChild(messageElement);
        
        messageInput.value = '';
        console.log('Mesaj gönderildi:', message);
    }

    sendButton.addEventListener('click', function() {
        console.log('Butona tıklandı');
        sendMessage();
    });

    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    console.log('Sohbet uygulaması başlatıldı');
});
