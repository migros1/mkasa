const darkModeSwitch = document.getElementById('darkModeSwitch');
const fruitList = document.getElementById('fruitList');
const favoritesList = document.getElementById('favoritesList');
const searchInput = document.getElementById('searchInput');
const noResultMessage = document.getElementById('noResultMessage');
const voiceIcon = document.getElementById('voiceIcon');
const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Koyu mod durumunu localStorage'dan kontrol et
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeSwitch.checked = true;
}

// Koyu modu aç/kapat
darkModeSwitch.addEventListener('change', () => {
    if (darkModeSwitch.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Ürünleri harici dosyadan yükle ve alfabetik sıraya diz
async function loadProducts() {
    try {
        const response = await fetch('urunler.txt');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text();
        const items = data.split('\n')
            .filter(line => line.trim() !== '')
            .map(line => line.split(' - '))
            .sort((a, b) => a[0].localeCompare(b[0], 'tr'));

        fruitList.innerHTML = ''; // Eski listeyi temizleyelim
        items.forEach(([name, code, imageUrl]) => {
            const imageSrc = imageUrl ? imageUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShIbHkyLtofVVgvXvi9RCFbbtegkcKeXCU8uBDuncOBh0jpu9s41sdYmM&s=10';
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-info">
                    <img src="${imageSrc}" alt="${name}" class="item-image">
                    <div>
                        <div class="item-name">${name}</div>
                        <div class="item-code">Kasa Kodu: ${code}</div>
                    </div>
                </div>
                <div class="icons">
                    <span class="icon" role="button" aria-label="Favorilere ekle" onclick="addToFavorites('${name}', '${code}')">⭐</span>
                    <button class="stock-check-button" onclick="checkStock('${name}')">Stok Kontrol</button>
                    <button class="barcode-button" onclick="convertToBarcode('${code}')">Barkoda Dönüştür</button>
                </div>
            `;
            fruitList.appendChild(li);
        });
    } catch (error) {
        console.error('Ürünler yüklenirken bir hata oluştu:', error);
    }
}

// Favorilere ekle
function addToFavorites(name, code) {
    if (!storedFavorites.some(item => item.name === name && item.code === code)) {
        storedFavorites.push({ name, code });
        localStorage.setItem('favorites', JSON.stringify(storedFavorites));
        loadFavorites();
        
        // Geri bildirim mesajı
        alert(`${name} favorilere eklendi!`);
    }
}

// Favorileri yükle
function loadFavorites() {
    favoritesList.innerHTML = '';
    storedFavorites.forEach(item => {
        if (item.name && item.code) {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-code">Kasa Kodu: ${item.code}</div>
                </div>
                <div class="icons">
                    <span class="icon" role="button" aria-label="Favorilerden çıkar" onclick="removeFromFavorites('${item.name}', '${item.code}')">❌</span>
                    <button class="stock-check-button" onclick="checkStock('${item.name}')">Stok Kontrol</button>
                    <button class="barcode-button" onclick="convertToBarcode('${item.code}')">Barkoda Dönüştür</button>
                </div>
            `;
            favoritesList.appendChild(li);
        }
    });

    // `undefined` ürünleri temizle
    const validFavorites = storedFavorites.filter(item => item.name && item.code);
    if (validFavorites.length !== storedFavorites.length) {
        localStorage.setItem('favorites', JSON.stringify(validFavorites));
    }
}

// Favorilerden çıkar
function removeFromFavorites(name, code) {
    const index = storedFavorites.findIndex(item => item.name === name && item.code === code);
    if (index !== -1) {
        storedFavorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(storedFavorites));
        loadFavorites();
        
        // Geri bildirim mesajı
        alert(`${name} favorilerden çıkarıldı!`);
    }
}

// Listeyi filtrele
function filterList() {
    const filter = searchInput.value.toLowerCase();
    let found = false;
    Array.from(fruitList.children).forEach(li => {
        const text = li.textContent.toLowerCase();
        if (text.includes(filter)) {
            li.style.display = '';
            found = true;
        } else {
            li.style.display = 'none';
        }
    });

    noResultMessage.style.display = found ? 'none' : 'block';
}

// Sesli arama başlat
function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    

    // iOS tarayıcı desteğini kontrol et
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (!SpeechRecognition || isIOS) {
        alert("Maalesef, iOS tarayıcılar sesli aramayı şu anda desteklemiyor.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
        console.log("Sesli arama başlatıldı");
        voiceIcon.classList.add('active');
        searchInput.placeholder = "Aramak istediğiniz ürünün adını veya kodunu şimdi söyleyin!";
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        filterList();
    };

    recognition.onerror = function(event) {
        console.error("Hata oluştu:", event.error);
    };

    recognition.onend = function() {
        console.log("Sesli arama sona erdi");
        voiceIcon.classList.remove('active');
        searchInput.placeholder = "Ürün arayın...";
    };

    recognition.start();
}
        
    if (!SpeechRecognition) {
        alert("Tarayıcınız sesli aramayı desteklemiyor.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
        console.log("Sesli arama başlatıldı");
        voiceIcon.classList.add('active');
        searchInput.placeholder = "Aramak istediğiniz ürünün adını veya kodunu şimdi söyleyin!";
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        filterList();
    };

    recognition.onerror = function(event) {
        console.error("Hata oluştu:", event.error);
    };

    recognition.onend = function() {
        console.log("Sesli arama sona erdi");
        voiceIcon.classList.remove('active');
        searchInput.placeholder = "Ürün arayın...";
    };

    recognition.start();

    // Basılı tutma işlemi
    voiceIcon.addEventListener('mousedown', () => {
        recognition.start();
    });

    voiceIcon.addEventListener('mouseup', () => {
        recognition.stop();
    });
}

// Stok kontrol
function checkStock(productName) {
    const url = `https://www.migros.com.tr/arama?q=${encodeURIComponent(productName)}`;
    window.open(url, '_blank');
}

// Barkoda dönüştür
function convertToBarcode(code) {
    const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(code)}&code=Code128&dpi=96`;
    window.open(barcodeUrl, '_blank');
}

// Çerez kabul etme
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookieBanner').style.display = 'none';
}

// Sayfa yüklendiğinde çalış
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadFavorites();

    // Çerezler kabul edildiyse banner'ı gizle
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        document.getElementById('cookieBanner').style.display = 'none';
    }

    // Sesli arama için etkinleştir
    const voiceRecognitionEnabled = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    if (voiceRecognitionEnabled) {
        voiceIcon.addEventListener('mousedown', startVoiceRecognition);
    }
});