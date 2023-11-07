const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const bot = require('./yapay.js');
const hesapDosya = 'hesap.txt';
const alinanDosya = 'alinan.txt';
let hesaplar = {};
let alinanHesaplar = [];

fs.readFile(hesapDosya, 'utf8', (err, data) => {
  if (err) {
    console.error('Hesap dosyasını okuma hatası:', err);
  } else {
    const satirlar = data.split('\n');
    satirlar.forEach((satir) => {
      const [kullanici, sifre] = satir.split(':');
      hesaplar[kullanici] = sifre;
    });
  }
});

app.get('/', (req, res) => {
  res.send('Merhaba, bu bir Node.js API!');
});

app.get('/disneyapi', (req, res) => {
  const hesapKeys = Object.keys(hesaplar);
  if (hesapKeys.length === 0) {
    res.status(404).json({ hata: 'Hesap bulunamadı' });
  } else {
    const randomKullanici = hesapKeys[Math.floor(Math.random() * hesapKeys.length)];
    const sifre = hesaplar[randomKullanici];
    alinanHesaplar.push(`${randomKullanici}:${sifre}`);

    fs.appendFile(alinanDosya, `${randomKullanici}:${sifre}\n`, (err) => {
      if (err) {
        console.error('Hesap taşıma hatası:', err);
      } else {
        delete hesaplar[randomKullanici];
        fs.writeFile(
          hesapDosya,
          Object.entries(hesaplar)
            .map(([kullanici, sifre]) => `${kullanici}:${sifre}`)
            .join('\n'),
          (err) => {
            if (err) {
              console.error('Hesap silme hatası:', err);
            }
          }
        );
      }
    });

    res.json({ kullanici: randomKullanici, sifre });
  }
});


app.use(express.static('web'));

// Ana sayfa yönlendirmesi için
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/web/index.html'); // index.html dosyasının yolu
});

app.listen(port, () => {
  console.log(`API çalışıyor: http://localhost:${port}`);
});
