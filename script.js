// Paraların hesaplanması
function hesapla() {
    var total = 0;
    var values = {
        '200': 200,
        '100': 100,
        '50': 50,
        '20': 20,
        '10': 10,
        '5': 5,
        '5_demir': 5,
        '1': 1,
        '0_50': 0.50,
        '0_25': 0.25,
        '0_10': 0.10,
        '0_05': 0.05,
        '0_01': 0.01
    };

    for (var key in values) {
        var adet = document.getElementById("adet" + key).value || 0;
        var toplam = adet * values[key];
        document.getElementById("toplam" + key).innerText = toplam.toFixed(2);
        total += toplam;
    }
    document.getElementById("total").innerText = total.toFixed(2) + " TL";
}

// Tarihin otomatik ayarlanması
function setDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    document.getElementById("tarih").value = today;
}

// Verilerin kaydedilmesi
function kaydet() {
    var data = {
        kasiyerSicil: document.getElementById("kasiyer_sicil").value,
        kasaNo: document.getElementById("kasa_no").value,
        tarih: document.getElementById("tarih").value,
        paralar: {}
    };
    var keys = [
        "200", "100", "50", "20", "10", "5", "5_demir",
        "1", "0_50", "0_25", "0_10", "0_05", "0_01"
    ];

    keys.forEach(function(key) {
        data.paralar[key] = document.getElementById("adet" + key).value || 0;
    });

    localStorage.setItem("kasaSayimi", JSON.stringify(data));
    alert("Kasa sayımı başarıyla kaydedildi!");
}

// Verilerin silinmesi
function sil() {
    localStorage.removeItem("kasaSayimi");
    location.reload();
    alert("Tüm veriler silindi!");
}

// PDF oluşturma
function pdfOlustur() {
    const { jsPDF } = window.jspdf;
    var doc = new jsPDF();
    doc.html(document.querySelector(".container"), {
        callback: function (doc) {
            doc.save("kasa_sayimi.pdf");
        },
        x: 10,
        y: 10
    });
}

// Sayfa yüklenirken verilerin yüklenmesi
function loadData() {
    setDate();
    var savedData = localStorage.getItem("kasaSayimi");
    if (savedData) {
        savedData = JSON.parse(savedData);
        document.getElementById("kasiyer_sicil").value = savedData.kasiyerSicil;
        document.getElementById("kasa_no").value = savedData.kasaNo;
        document.getElementById("tarih").value = savedData.tarih;

        var keys = [
            "200", "100", "50", "20", "10", "5", "5_demir",
            "1", "0_50", "0_25", "0_10", "0_05", "0_01"
        ];

        keys.forEach(function (key) {
            document.getElementById("adet" + key).value = savedData.paralar[key] || 0;
        });

        // Hesaplamayı güncelle
        hesapla();
    }
}

// Sayfa yüklendiğinde otomatik olarak çalıştırılacak fonksiyon
window.onload = function () {
    loadData();
};