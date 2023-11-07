const Discord = require('discord.js');
const fetch = require('node-fetch'); // API isteği için kullanılacak

const client = new Discord.Client();
const prefix = '!'; // Örnek prefix: !

client.on('message', async (message) => {
  if (message.author.bot) return; // Botlardan gelen mesajları işleme alma
  if (!message.content.startsWith(prefix)) return; // Prefix ile başlamayan mesajları işleme alma

  // Prefix ile başlayan mesajı alın ve komutu ve argümanları ayırın
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'yapay') {
    const soru = args.join(' ');

    // API'ye soru gönderme
    const apiUrl = `https://api.fatihyalcin1.repl.co/yapayv1?soru=${encodeURIComponent(soru)}`;

    try {
      const response = await fetch(apiUrl);

      if (response.status === 200) {
        const data = await response.json();

        // Cevap embedini oluşturma
        const embed = new Discord.MessageEmbed()
          .setTitle('Yapay Zeka Cevabı')
          .setColor('#0099ff')
          .addField('Cevap', data.cevap);

        message.channel.send(embed);
      } else {
        message.channel.send('API yanıt vermedi.');
      }
    } catch (error) {
      console.error('API isteği sırasında bir hata oluştu:', error);
      message.channel.send('API isteği sırasında bir hata oluştu.');
    }
  }
});

client.login('MTEwODcwMTUzNzMwMTE3MjIzNA.Gh_RxU.EKWtcr8ldVOIyiYnzb_uD3j5p1dqeNK_ucjAFE');
