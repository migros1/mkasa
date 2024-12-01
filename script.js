
// Tarih alanını otomatik olarak doldur
const tarihAlani = document.getElementById('tarih');
tarihAlani.value = new Date().toLocaleString();

// Kasiyer Bilgileri formunun doğrulamaları
const kasiyerForm = document.getElementById('kasiyer-form');
const kasiyerSicilAlani = document.getElementById('kasiyer-sicil');
const kasaNoAlani = document.getElementById('kasa-no');
const kasiyerAdSoyadAlani = document.getElementById('kasiyer-ad-soyad');
const kaydetButonu = document.getElementById('kaydet-butonu');

const paraBirimiInputlari = document.querySelectorAll('.para-birimi input[type="number"]');
const paraBirimleriToplami = document.querySelectorAll('.para-birimi .toplam');

function formDogrulama() {
    if (kasiyerSicilAlani.value && kasaNoAlani.value && kasiyerAdSoyadAlani.value) {
        kaydetButonu.disabled = false;
    } else {
        kaydetButonu.disabled = true;
    }
}

kasiyerSicilAlani.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    formDogrulama();
});

kasaNoAlani.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    if (this.value > 99) {
        this.value = 99;
    }
    formDogrulama();
});

kasiyerAdSoyadAlani.addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
    if (this.value.length > 100) {
        this.value = this.value.slice(0, 100);
    }
    formDogrulama();
});

// Para Birimleri bölümünün işlevleri
paraBirimiInputlari.forEach((input, index) => {
    input.addEventListener('input', function() {
        if (this.value.length > 8) {
            this.value = this.value.slice(0, 8);
        }
        hesaplaToplamTutar();
    });
});

function hesaplaToplamTutar() {
    const birimDegerleri = [200, 100, 50, 20, 10, 5, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01];
    let toplamTutar = 0;

    paraBirimiInputlari.forEach((input, i) => {
        const adet = parseInt(input.value) || 0;
        const toplam = adet * birimDegerleri[i];
        paraBirimleriToplami[i].textContent = `${toplam.toFixed(2)} TL`;
        toplamTutar += toplam;
    });

    console.log(`Toplam Tutar: ${toplamTutar.toFixed(2)} TL`);
}

// Kontrol Butonları işlevleri
kaydetButonu.addEventListener('click', function() {
    const kasiyerBilgileri = {
        kasiyerSicili: kasiyerSicilAlani.value,
        kasaNo: kasaNoAlani.value,
        kasiyerAdSoyad: kasiyerAdSoyadAlani.value,
        tarih: tarihAlani.value,
        paraBirimleri: Array.from(paraBirimiInputlari).map(input => parseInt(input.value) || 0)
    };

    localStorage.setItem('kasiyerBilgileri', JSON.stringify(kasiyerBilgileri));
    console.log('Kasiyer bilgileri kaydedildi.');
});

document.getElementById('listeyi-temizle-butonu').addEventListener('click', function() {
    paraBirimiInputlari.forEach(input => input.value = 0);
    paraBirimleriToplami.forEach(span => span.textContent = '0 TL');
    console.log('Liste temizlendi.');
});

document.getElementById('gecmis-listelerim-butonu').addEventListener('click', function() {
    const kasiyerBilgileri = JSON.parse(localStorage.getItem('kasiyerBilgileri'));
    if (kasiyerBilgileri) {
        kasiyerSicilAlani.value = kasiyerBilgileri.kasiyerSicili;
        kasaNoAlani.value = kasiyerBilgileri.kasaNo;
        kasiyerAdSoyadAlani.value = kasiyerBilgileri.kasiyerAdSoyad;
        tarihAlani.value = kasiyerBilgileri.tarih;

        paraBirimiInputlari.forEach((input, index) => {
            input.value = kasiyerBilgileri.paraBirimleri[index];
            const toplam = kasiyerBilgileri.paraBirimleri[index] * birimDegerleri[index];
            paraBirimleriToplami[index].textContent = `${toplam.toFixed(2)} TL`;
        });

        console.log('Geçmiş liste yüklendi.');
    } else {
        console.log('Geçmiş liste bulunamadı.');
    }
});
