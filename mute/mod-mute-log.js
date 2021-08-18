const Discord = require('discord.js');
const db = require("quick.db");

exports.run = async (client, message, args) => {
let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!!"; 
  if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed()
  .setTitle(`**Yetki Hatası**`)
  .setColor('#f8f8f9')
  .setThumbnail(message.author.avatarURL())
  .setDescription(`**•** \`${prefix}mute-log\` **kullanmak için,** \`Yönetici\` **yetkisine sahip olman gerekiyor.**`)).then(a => a.delete({timeout: 10000}));
  if(!message.mentions.channels.first()) return message.channel.send(new Discord.MessageEmbed().setColor('#f8f8f9').setTitle('Bir hata oldu!').setDescription('Bir kanal etiketlemeyi unuttunuz.'));
  let mentionChannel = message.mentions.channels.first();
  db.set(`mute.log.${message.guild.id}`, mentionChannel.id);
  message.channel.send(new Discord.MessageEmbed()
  .setAuthor("EtherZ Bot",client.user.avatarURL())
  .setColor("#f8f8f9")
  .setDescription(`**<a:tenor:807201675738611800> | Log kanalı başarıyla ${mentionChannel} olarak ayarlandı**`)
  .setFooter("Tüm Hakları Saklıdır."))

};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
}

exports.help = {
  name: 'mute-log',
   usage: '!!mute-log #kanal',
   cooldown: 5  
};