
document.addEventListener('DOMContentLoaded', function() {
    const listeContainer = document.getElementById('liste-container');
    const searchInput = document.getElementById('searchInput');
    const kasiyerBilgileri = JSON.parse(localStorage.getItem('kasiyerBilgileri')) || [];

    function displayLists(data) {
        listeContainer.innerHTML = '';
        if (data.length === 0) {
            listeContainer.innerHTML = '<p>Henüz herhangi bir kayıt bulunmamaktadır.</p>';
        } else {
            data.forEach((bilgi, index) => {
                const listeItem = document.createElement('div');
                listeItem.classList.add('liste-item');

                listeItem.innerHTML = `
                    <h3>Liste ${index + 1}</h3>
                    <p><strong>Tarih:</strong> ${bilgi.tarih}</p>
                    <p><strong>Kasiyer Sicili:</strong> ${bilgi.kasiyerSicili}</p>
                    <p><strong>Kasa No:</strong> ${bilgi.kasaNo}</p>
                    <p><strong>Kasiyer Ad Soyad:</strong> ${bilgi.kasiyerAdSoyad}</p>
                    <a class="pdf-button" onclick="createPDF(${index})">PDF İndir</a>
                `;

                listeContainer.appendChild(listeItem);
            });
        }
    }

    displayLists(kasiyerBilgileri);

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filteredData = kasiyerBilgileri.filter(bilgi => bilgi.tarih.toLowerCase().includes(query));
        displayLists(filteredData);
    });

    window.createPDF = function(index) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const bilgi = kasiyerBilgileri[index];

        const kağıtPara = bilgi.paraBirimleri.slice(0, 6);
        const demirPara = bilgi.paraBirimleri.slice(6);

        doc.setFontSize(16);
        doc.text("Geçmiş Liste", 20, 20);

        doc.setFontSize(12);
        doc.text(`Tarih: ${bilgi.tarih}`, 20, 40);
        doc.text(`Kasiyer Sicili: ${bilgi.kasiyerSicili}`, 20, 50);
        doc.text(`Kasa No: ${bilgi.kasaNo}`, 20, 60);
        doc.text(`Kasiyer Ad Soyad: ${bilgi.kasiyerAdSoyad}`, 20, 70);

        doc.setFontSize(14);
        doc.text("Kağıt Paralar:", 20, 90);
        kağıtPara.forEach((adet, i) => {
            const paraBirimi = [200, 100, 50, 20, 10, 5][i];
            doc.text(`${paraBirimi} TL: ${adet}`, 30, 100 + i * 10);
        });

        doc.setFontSize(14);
        doc.text("Demir Paralar:", 120, 90);
        demirPara.forEach((adet, i) => {
            const paraBirimi = [5, 1, 0.5, 0.25, 0.1, 0.05, 0.01][i];
            doc.text(`${paraBirimi} TL: ${adet}`, 130, 100 + i * 10);
        });

        doc.save(`Gecmis_Liste_${index + 1}.pdf`);
    };
});
