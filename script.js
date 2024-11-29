// Tüm input alanlarını ve toplam tutarları işleyip hesaplama yapan fonksiyon
function hesapla() {
    const paraBirimleri = [
        { id: "200", deger: 200 },
        { id: "100", deger: 100 },
        { id: "50", deger: 50 },
        { id: "20", deger: 20 },
        { id: "10", deger: 10 },
        { id: "5", deger: 5 },
        { id: "5_demir", deger: 5 },
        { id: "1", deger: 1 },
        { id: "0_50", deger: 0.5 },
        { id: "0_25", deger: 0.25 },
        { id: "0_10", deger: 0.1 },
        { id: "0_05", deger: 0.05 }
    ];

    let toplamTutar = 0;

    paraBirimleri.forEach(para => {
        const adetInput = document.getElementById(`adet${para.id}`);
        const toplamCell = document.getElementById(`toplam${para.id}`);

        const adet = parseInt(adetInput.value) || 0;
        const toplam = adet * para.deger;

        toplamCell.textContent = toplam.toFixed(2) + " TL";
        toplamTutar += toplam;
    });

    document.getElementById("toplamTutar").textContent = toplamTutar.toFixed(2) + " TL";
}

// Kaydet butonu için işlem
document.getElementById("kaydet").addEventListener("click", function () {
    const kasaNo = document.getElementById("kasaNo").value;
    const subeNo = document.getElementById("subeNo").value;
    const tarih = document.getElementById("tarih").value;
    const toplamTutar = document.getElementById("toplamTutar").textContent;

    if (!kasaNo || !subeNo || !tarih) {
        alert("Lütfen tüm bilgileri doldurun!");
        return;
    }

    alert(`Kasa No: ${kasaNo}\nŞube No: ${subeNo}\nTarih: ${tarih}\nToplam Tutar: ${toplamTutar}`);
});

// Sil butonu için işlem
document.getElementById("sil").addEventListener("click", function () {
    if (confirm("Tüm bilgileri silmek istediğinizden emin misiniz?")) {
        document.querySelectorAll("input[type='number']").forEach(input => input.value = "");
        document.querySelectorAll("td[id^='toplam']").forEach(td => td.textContent = "0 TL");
        document.getElementById("toplamTutar").textContent = "0 TL";
    }
});

// PDF oluşturma (örnek, daha sonra gerçek PDF entegrasyonu yapılabilir)
document.getElementById("pdf").addEventListener("click", function () {
    alert("Bu özellik henüz aktif değil!");
});