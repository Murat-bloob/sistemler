const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async(client, message, args) => {  
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!!";  

  if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed()
  .setTitle(`**Yetki Hatası**`)
  .setColor('#f8f8f9')
  .setThumbnail(message.author.avatarURL())
  .setDescription(`**•** \`${prefix}bot-log\` **kullanmak için,** \`Yönetici\` **yetkisine sahip olman gerekiyor.**`)).then(a => a.delete({timeout: 10000}));
   
let mentionChannel = message.mentions.channels.first();
  db.set(`logChannel.${message.guild.id}`, mentionChannel.id);
    if(!message.mentions.channels.first()) return message.channel.send(new Discord.MessageEmbed().setColor('#f8f8f9').setTitle('Bir hata oldu!').setDescription('Bir kanal etiketlemeyi unuttunuz.'));

  message.channel.send(new Discord.MessageEmbed()
  .setAuthor("EtherZ Bot",client.user.avatarURL())
  .setColor("#f8f8f9")
  .setDescription(`**<a:tenor:807201675738611800> | Kanal başarıyla ${mentionChannel} olarak ayarlandı**`)
  .setFooter("Tüm Hakları Saklıdır."))
}
exports.conf = {
  enabled: true,
  guildonly: false,
  aliases: [],
  permlevel: 0
}
exports.help = {
  name: 'bot-log',
   cooldown: 5  
}