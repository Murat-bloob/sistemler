const discord = require('discord.js')
const db = require('quick.db')

exports.run = async(client, message, args) => {
  message.delete()

    let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!!";
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed()
    .setTitle(`**Yetki Hatası**`)
    .setColor('#f8f8f9')
    .setThumbnail(message.author.avatarURL())
    .setDescription(`**•** \`${prefix}bot-sistem-sıfırla\` **kullanmak için,** \`Yönetici\` **yetkisine sahip olman gerekiyor.**`)).then(a => a.delete({timeout: 10000}));
  
const sıfırlandı = new discord.MessageEmbed()
.setAuthor(client.user.username, client.user.avatarURL())  
.setDescription(`Sunucu İçin Ayarladığınız Sistemleri  Başarıyla Sıfırlandı ! `)
.setThumbnail(client.user.avatarURL())
message.channel.send(sıfırlandı)
db.delete(`addChannel.${message.guild.id}`)
db.delete(`logChannel.${message.guild.id}`)
db.delete(`modRole.${message.guild.id}`)
db.delete(`logChannel.${message.guild.id}`)
db.delete(`devRole.${message.guild.id}`)
db.delete(`processChannel.${message.guild.id}`)
return;
}

exports.conf = {
  enabled: true,
  guildonly: false,
  aliases: [],
  permlevel: 0
}
exports.help = {
  name: 'bot-sistem-sıfırla',
   cooldown: 5  
}