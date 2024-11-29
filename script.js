// Toplam hesapla fonksiyonu
function hesapla() {
    var keys = [
        { key: "200", multiplier: 200 },
        { key: "100", multiplier: 100 },
        { key: "50", multiplier: 50 },
        { key: "20", multiplier: 20 },
        { key: "10", multiplier: 10 },
        { key: "5", multiplier: 5 },
        { key: "5_demir", multiplier: 5 },
        { key: "1", multiplier: 1 },
        { key: "0_50", multiplier: 0.5 },
        { key: "0_25", multiplier: 0.25 },
        { key: "0_10", multiplier: 0.1 },
        { key: "0_05", multiplier: 0.05 },
        { key: "0_01", multiplier: 0.01 },
    ];

    let total = 0;

    keys.forEach(function (item) {
        var adet = document.getElementById("adet" + item.key).value;
        var toplam = (adet ? parseFloat(adet) : 0) * item.multiplier;
        document.getElementById("toplam" + item.key).textContent = toplam.toFixed(2);
        total += toplam;
    });

    document.getElementById("toplamTutar").textContent = total.toFixed(2) + " TL";
}

// Kaydet fonksiyonu (LocalStorage)
function saveData() {
    var kasaNo = document.getElementById("kasaNo").value;
    var subeNo = document.getElementById("subeNo").value;
    var tarih = document.getElementById("tarih").value;

    var keys = [
        "200", "100", "50", "20", "10", "5", "5_demir",
        "1", "0_50", "0_25", "0_10", "0_05", "0_01"
    ];

    var paralar = {};
    keys.forEach(function (key) {
        paralar[key] = document.getElementById("adet" + key).value || 0;
    });

    var data = {
        kasaNo: kasaNo,
        subeNo: subeNo,
        tarih: tarih,
        paralar: paralar,
    };

    localStorage.setItem("kasaSayimi", JSON.stringify(data));
    alert("Veriler başarıyla kaydedildi!");
}

// Sil fonksiyonu
function clearData() {
    if (confirm("Tüm veriler silinecek, emin misiniz?")) {
        localStorage.removeItem("kasaSayimi");
        location.reload();
    }
}

// Verileri yükleme fonksiyonu
function loadData() {
    var savedData = JSON.parse(localStorage.getItem("kasaSayimi"));

    if (savedData) {
        document.getElementById("kasaNo").value = savedData.kasaNo || "";
        document.getElementById("subeNo").value = savedData.subeNo || "";
        document.getElementById("tarih").value = savedData.tarih || "";

        var keys = [
            "200", "100", "50", "20", "10", "5", "5_demir",
            "1", "0_50", "0_25", "0_10", "0_05", "0_01"
        ];

        keys.forEach(function (key) {
            document.getElementById("adet" + key).value = savedData.paralar[key] || 0;
        });

        hesapla();
    }
}

// PDF oluşturma fonksiyonu
function generatePDF() {
    const element = document.body; // Tüm sayfayı PDF'e çeviriyoruz
    html2pdf()
        .set({
            margin: 1,
            filename: "Kasa_Sayimi.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { orientation: "portrait" },
        })
        .from(element)
        .save();
}

// Sayfa yüklendiğinde otomatik yükleme
window.onload = function () {
    loadData();
};

// Olay dinleyicileri
document.getElementById("kaydet").addEventListener("click", saveData);
document.getElementById("sil").addEventListener("click", clearData);
document.getElementById("pdf").addEventListener("click", generatePDF);