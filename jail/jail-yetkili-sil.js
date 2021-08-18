const Discord = require('discord.js');
const db = require("quick.db");

exports.run = async (client, message, args) => {
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!!"; 
  if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed()
  .setTitle(`**Yetki Hatası**`)
  .setColor('#f8f8f9')
  .setThumbnail(message.author.avatarURL())
  .setDescription(`**•** \`${prefix}jail-yetkili-sıfırla\` **kullanmak için,** \`Yönetici\` **yetkisine sahip olman gerekiyor.**`)).then(a => a.delete({timeout: 10000}));
  db.delete(`jail.yetkilirole.${message.guild.id}`);
  return message.channel.send(new Discord.MessageEmbed()
  .setAuthor("EtherZ Bot", client.user.avatarURL())
  .setColor("#f8f8f9")
  .setDescription(`**<a:tenor:807201675738611800> | Jail yetkili rol başarıyla sıfırlandı**`)
  .setFooter("Tüm Hakları Saklıdır."))
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
}

exports.help = {
  name: 'jail-yetkili-sıfırla',
     usage: '!!jail-yetkili-sıfırla',
   cooldown: 5  
};