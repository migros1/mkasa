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

        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.newChatBtn.addEventListener('click', () => this.startNewChat());
    }

    startNewChat() {
        this.currentSessionId = Date.now();
        this.chatSessions.push({
            id: this.currentSessionId,
            messages: [],
            context: {}
        });
        this.chatArea.innerHTML = '';
        this.updateChatHistory();
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Geçerli oturumu bul veya yeni oturum oluştur
        let currentSession = this.chatSessions.find(s => s.id === this.currentSessionId);
        if (!currentSession) {
            this.startNewChat();
            currentSession = this.chatSessions[this.chatSessions.length - 1];
        }

        // Kullanıcı mesajını kaydet
        this.appendMessage('user', message, currentSession);
        this.messageInput.value = '';

        // AI yanıtını oluştur
        this.generateAIResponse(message, currentSession);
    }

    appendMessage(type, content, session) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(
            'mb-4', 'p-3', 'rounded-lg', 
            type === 'user' ? 'bg-blue-100 self-end' : 
            type === 'ai' ? 'bg-green-100 self-start' : 
            'bg-gray-200'
        );

        // Kod blokları için özel biçimlendirme
        const formattedContent = this.formatCodeBlocks(content);

        messageElement.innerHTML = `
            <div class="flex items-start">
                <div class="mr-2">
                    ${type === 'user' ? '👤' : type === 'ai' ? '🤖' : '🔔'}
                </div>
                <div>${formattedContent}</div>
            </div>
        `;

        this.chatArea.appendChild(messageElement);
        this.chatArea.scrollTop = this.chatArea.scrollHeight;

        // Mesajı oturum geçmişine kaydet
        session.messages.push({ type, content });
        this.updateChatHistory();
        this.saveSessions();
    }

    formatCodeBlocks(content) {
        return content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => `
            <pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                <code class="language-${lang || 'plaintext'}">${this.escapeHTML(code.trim())}</code>
            </pre>
        `);
    }

    escapeHTML(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    async generateAIResponse(userMessage, session) {
        try {
            // Simüle edilmiş AI yanıt mekanizması
            const context = session.context || {};
            const aiResponse = await this.simulateSmartResponse(userMessage, context);
            
            this.appendMessage('ai', aiResponse, session);
            
            // Bağlamı güncelle
            session.context = this.updateContext(context, userMessage, aiResponse);
        } catch (error) {
            this.appendMessage('system', 'Bir hata oluştu. Lütfen tekrar deneyin.', session);
        }
    }

    async simulateSmartResponse(userMessage, context) {
        // Gelişmiş yanıt üretme simülasyonu
        const responses = [
            'Anladım, devam edebilirsiniz.',
            'Önceki bağlamı dikkate alarak cevap veriyorum.',
            'Bu konuda daha fazla detay verebilir misiniz?'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    updateContext(currentContext, userMessage, aiResponse) {
        // Basit bir bağlam güncelleme mekanizması
        return {
            ...currentContext,
            lastUserMessage: userMessage,
            lastAIResponse: aiResponse,
            messageCount: (currentContext.messageCount || 0) + 1
        };
    }

    updateChatHistory() {
        this.chatHistoryContainer.innerHTML = this.chatSessions
            .map(session => `
                <div class="p-2 hover:bg-gray-100 cursor-pointer" 
                     data-session-id="${session.id}">
                    Sohbet ${new Date(session.id).toLocaleString()}
                </div>
            `)
            .join('');

        // Geçmiş sohbetlere tıklama eventos
        this.chatHistoryContainer.querySelectorAll('[data-session-id]').forEach(el => {
            el.addEventListener('click', (e) => {
                const sessionId = parseInt(e.currentTarget.dataset.sessionId);
                this.loadChatSession(sessionId);
            });
        });
    }

    loadChatSession(sessionId) {
        const session = this.chatSessions.find(s => s.id === sessionId);
        if (session) {
            this.currentSessionId = sessionId;
            this.chatArea.innerHTML = '';
            session.messages.forEach(msg => {
                this.appendMessage(msg.type, msg.content, session);
            });
        }
    }

    saveSessions() {
        localStorage.setItem('chatSessions', JSON.stringify(this.chatSessions));
    }

    loadSavedSessions() {
        const savedSessions = localStorage.getItem('chatSessions');
        if (savedSessions) {
            this.chatSessions = JSON.parse(savedSessions);
            this.currentSessionId = this.chatSessions[this.chatSessions.length - 1]?.id;
            this.updateChatHistory();
        }
    }
}

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    window.chatApp = new ChatApp();
});
