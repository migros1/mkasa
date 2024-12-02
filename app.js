class ChatApp {
    constructor() {
        this.chatSessions = [];
        this.currentSessionId = null;
        this.initializeDOM();
        this.loadSavedSessions();
    }

    initializeDOM() {
        this.chatArea = document.getElementById('chatArea');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.chatHistoryContainer = document.getElementById('chatHistory');

        // Event listener'ları ekle
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.newChatBtn.addEventListener('click', () => this.startNewChat());
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Eğer mevcut bir oturum yoksa yeni bir oturum başlat
        if (!this.currentSessionId) {
            this.startNewChat();
        }

        // Geçerli oturumu bul
        const currentSession = this.chatSessions.find(s => s.id === this.currentSessionId);

        // Kullanıcı mesajını ekle
        this.appendMessage('user', message, currentSession);
        this.messageInput.value = '';

        // AI yanıtını oluştur
        this.generateAIResponse(message, currentSession);
    }

    startNewChat() {
        // Yeni bir oturum kimliği oluştur
        this.currentSessionId = Date.now();
        
        // Yeni oturumu diziye ekle
        const newSession = {
            id: this.currentSessionId,
            messages: [],
            context: {}
        };
        this.chatSessions.push(newSession);

        // Sohbet alanını temizle
        this.chatArea.innerHTML = '';
        
        // Geçmiş sohbetleri güncelle
        this.updateChatHistory();
    }

    appendMessage(type, content, session) {
        // Mesaj elementi oluştur
        const messageElement = document.createElement('div');
        messageElement.classList.add(
            'mb-4', 'p-3', 'rounded-lg', 
            type === 'user' ? 'bg-blue-100 text-right' : 
            type === 'ai' ? 'bg-green-100' : 
            'bg-gray-200'
        );

        // İçeriği biçimlendir (kod blokları için)
        const formattedContent = this.formatCodeBlocks(content);

        // Mesaj içeriğini ayarla
        messageElement.innerHTML = `
            <div class="flex items-start">
                <div class="mr-2">
                    ${type === 'user' ? '👤' : type === 'ai' ? '🤖' : '🔔'}
                </div>
                <div>${formattedContent}</div>
            </div>
        `;

        // Mesajı sohbet alanına ekle
        this.chatArea.appendChild(messageElement);
        
        // Scroll'u en alta götür
        this.chatArea.scrollTop = this.chatArea.scrollHeight;

        // Mesajı oturum geçmişine kaydet
        if (session) {
            session.messages.push({ type, content });
        }
    }

    formatCodeBlocks(content) {
        // Kod bloklarını biçimlendir
        return content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => `
            <pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                <code class="language-${lang || 'plaintext'}">${this.escapeHTML(code.trim())}</code>
            </pre>
        `);
    }

    escapeHTML(unsafe) {
        // HTML özel karakterlerini escape et
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    generateAIResponse(userMessage, session) {
        // Basit bir AI yanıt simülasyonu
        const aiResponses = [
            'Anladım, devam edebilirsiniz.',
            'Bu konuda daha fazla bilgi alabilir miyim?',
            'İlginç bir yaklaşım.',
            'Söylediklerinizi değerlendirebilirim.',
            'Başka ne söylemek istersiniz?'
        ];

        // Rastgele bir yanıt seç
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

        // AI mesajını ekle
        this.appendMessage('ai', randomResponse, session);
    }

    updateChatHistory() {
        // Sohbet geçmişini güncelle
        if (this.chatSessions.length === 0) {
            this.chatHistoryContainer.innerHTML = `
                <div class="text-gray-500 text-center py-4">
                    Henüz sohbet geçmişi yok
                </div>
            `;
            return;
        }

        // Sohbet geçmişi listesini oluştur
        this.chatHistoryContainer.innerHTML = this.chatSessions
            .map(session => `
                <div class="p-2 hover:bg-gray-100 cursor-pointer" 
                     data-session-id="${session.id}">
                    Sohbet - ${new Date(session.id).toLocaleString()}
                </div>
            `)
            .join('');
    }
}

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    window.chatApp = new ChatApp();
});
