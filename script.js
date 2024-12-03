
document.addEventListener('DOMContentLoaded', function() {
    const chatbox = document.getElementById('chatbox');
    const messageInput = document.getElementById('message');
    const sidebar = document.getElementById('sidebar');
    let isDarkMode = false;
    let isSoundOn = true;
    
    const audio = new Audio('notification.mp3'); // Bildirim sesi dosyası
    
    // Sohbet geçmişini tutacak bir dizi
    const conversationHistory = [];

    document.getElementById('sendButton').addEventListener('click', sendMessage);

    function sendMessage() {
        const userMessage = messageInput.value;
        if (userMessage.trim() !== "") {
            addMessageToChatbox(userMessage, true);
            conversationHistory.push('Siz: ' + userMessage);
            fetchResponse(userMessage);
            messageInput.value = '';
            if (isSoundOn) playNotificationSound();
        }
    }

    function toggleSidebar() {
        sidebar.style.left = sidebar.style.left === '0px' ? '-250px' : '0px';
    }

    function changeTheme() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
    }

    function toggleSound() {
        isSoundOn = !isSoundOn;
        alert(`Ses ${isSoundOn ? 'açık' : 'kapalı'}`);
    }

    function viewNotifications() {
        alert("Bildirim ayarları henüz aktif değil.");
    }

    function editProfile() {
        alert("Profil ayarları henüz aktif değil.");
    }

    function viewHelp() {
        alert("Yardım ve destek burada bulunabilir.");
    }

    function logout() {
        alert("Çıkış yapıldı.");
        // Çıkış işlemleri burada gerçekleştirilebilir
    }

    function addMessageToChatbox(message, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', isUser ? 'user' : 'ai');

        const avatar = document.createElement('div');
        avatar.classList.add('avatar');

        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.innerText = message;

        messageElement.appendChild(isUser ? bubble : avatar);
        messageElement.appendChild(isUser ? avatar : bubble);

        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    async function fetchResponse(prompt) {
        const fullConversation = conversationHistory.join('\n');
        const url = `https://darkness.ashlynn.workers.dev/chat/?prompt=${encodeURIComponent(fullConversation)}&model=meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`;

        // Yükleniyor göstergesi
        addMessageToChatbox("Yükleniyor...", false);

        try {
            const response = await fetch(url);
            const data = await response.json();
            chatbox.lastChild.remove(); // Yükleniyor mesajını kaldır
            let aiResponse = data.response || "Bir hata oluştu.";
            aiResponse = formatCodeBlocks(aiResponse);
            addMessageToChatbox(aiResponse, false);
            if (isSoundOn) playNotificationSound();
            // Otomatik okuma devre dışı
            // await playTextToSpeech(aiResponse);
            conversationHistory.push('AI: ' + aiResponse);
        } catch (error) {
            chatbox.lastChild.remove(); // Yükleniyor mesajını kaldır
            addMessageToChatbox('AI: Bir hata oluştu.', false);
            console.error('Error:', error);
        }
    }

    function formatCodeBlocks(text) {
        return text.replace(/```(\w+)\n([\s\S]*?)```/g, (match, language, code) => {
            const codeLines = code.split('\n');
            if (codeLines.length > 400) {
                downloadCodeAsFile(language, code);
                return `Kod ${codeLines.length} satır uzunluğunda ve dosya olarak indirildi.`;
            } else {
                return `Kod:\n${code}`;
            }
        });
    }

    function downloadCodeAsFile(language, code) {
        const blob = new Blob([code], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `code.${language || 'txt'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function playNotificationSound() {
        audio.play();
    }

    // Otomatik okuma fonksiyonu çağrılmıyor, bu yüzden devre dışı
    // async function playTextToSpeech(text) {
    //     const utterance = new SpeechSynthesisUtterance(text);
    //     window.speechSynthesis.speak(utterance);
    // }

    function startVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Tarayıcınız ses tanıma özelliğini desteklemiyor.");
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'tr-TR';
        recognition.start();

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
        };

        recognition.onerror = function(event) {
            alert("Bir hata oluştu: " + event.error);
        };
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', 'user');
                
                const avatar = document.createElement('div');
                avatar.classList.add('avatar');

                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                bubble.innerHTML = `<a href="${e.target.result}" download="${file.name}">${file.name}</a>`;
                
                messageElement.appendChild(bubble);
                messageElement.appendChild(avatar);

                chatbox.appendChild(messageElement);
                chatbox.scrollTop = chatbox.scrollHeight;
            };
            reader.readAsDataURL(file);
        }
    }
});
