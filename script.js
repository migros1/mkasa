function hesapla() {
    var total = 0;
    var values = {
        '200': 200,
        '100': 100,
        '50': 50,
        '20': 20,
        '10': 10,
        '5': 5,
        '1': 1,
        '0_50': 0.50,
        '0_25': 0.25,
        '0_10': 0.10,
        '0_05': 0.05,
        '0_01': 0.01,
        '5_demir': 5
    };
    for (var key in values) {
        var adet = document.getElementById("adet" + key).value;
        var toplam = adet * values[key];
        document.getElementById("toplam" + key).innerText = toplam.toFixed(2);
        total += parseFloat(toplam);
    }
    document.getElementById("total").innerText = total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
}

function setDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    document.getElementById("tarih").value = today;
}

function kaydet() {
    var data = {
        kasiyerSicil: document.getElementById("kasiyer_sicil").value,
        kasaNo: document.getElementById("kasa_no").value,
        tarih: document.getElementById("tarih").value,
        paralar: {
            200: document.getElementById("adet200").value,
            100: document.getElementById("adet100").value,
            50: document.getElementById("adet50").value,
            20: document.getElementById("adet20").value,
            10: document.getElementById("adet10").value,
            5: document.getElementById("adet5").value,
            5_demir: document.getElementById("adet5_demir").value,
            1: document.getElementById("adet1").value,
            0.50: document.getElementById("adet0_50").value,
            0.25: document.getElementById("adet0_25").value,
            0.10: document.getElementById("adet0_10").value,
            0.05: document.getElementById("adet0_05").value,
            0.01: document.getElementById("adet0_01").value,
        }
    };
    localStorage.setItem("kasaSayimi", JSON.stringify(data));
    alert("Kasa sayımı başarıyla kaydedildi!");
}

function sil() {
    localStorage.removeItem("kasaSayimi");
    document.getElementById("kasiyer_sicil").value = "";
    document.getElementById("kasa_no").value = "";
    document.getElementById("tarih").value = "";
    var keys = [
        "200", "100", "50", "20", "10", "5", "5_demir",
        "1", "0_50", "0_25", "0_10", "0_05", "0_01"
    ];
    keys.forEach(function(key) {
        document.getElementById("adet" + key).value = "";
        document.getElementById("toplam" + key).innerText = "0";
    });
    document.getElementById("total").innerText = "0 TL";
    alert("Kasa sayımı başarıyla silindi!");
}

function pdfOlustur() {
    var doc = new jsPDF();
    doc.fromHTML(document.querySelector('.container'), 15, 15, {
        'width': 170
    });
    doc.save('kasa_sayimi.pdf');
}

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
        keys.forEach(function(key) {
            document.getElementById("adet" + key).value = savedData.paralar[key];
            var toplam = savedData.paralar[key] * parseFloat(key.replace('_', '.').replace('demir', ''));
            document.getElementById("toplam" + key).innerText = toplam.toFixed(2);
        });
        hesapla();
    }
}