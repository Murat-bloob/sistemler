const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async(client, message, args) => {
  message.delete()

  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!!";  

  let Yetkili = await db.fetch(`modRole.${message.guild.id}`);
  if(!Yetkili) return message.channel.send(`Sistem ayarlanmamış. Ayarlamak İçin !!mod-rol`)

  if(!message.member.roles.cache.has(Yetkili))  return message.channel.send(new Discord.MessageEmbed()
  .setTitle(`**Yetki Hatası**`)
  .setColor('#f8f8f9')
  .setThumbnail(message.author.avatarURL())
  .setDescription(`**•** \`${prefix}tablo\` **kullanmak için,** <@${Yetkili}> **yetkisine sahip olman gerekiyor.**`)).then(a => a.delete({timeout: 10000}));
   
	 let succSize = db.get(`serverData.${message.guild.id}.succSize`) || 0;
	 let waitSize = db.get(`serverData.${message.guild.id}.waitSize`) || 0;
	 let redSize = db.get(`serverData.${message.guild.id}.redSize`) || 0;
	   
	 const embed = new Discord.MessageEmbed()
	  .setColor("#f8f8f9")
	  .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	  .setTimestamp()
	  .setDescription(`**Toplam Botlar;** \`${succSize + waitSize + redSize}\` \n**Onaylanan Botlar;** \`${succSize}\`\n**Bekleyen Botlar;** \`${waitSize}\`\n**Reddedilen Botlar;** \`${redSize}\``)
	  .setFooter(client.user.username, client.user.avatarURL())
     message.channel.send(embed)
  }
exports.conf = {
  enabled: true,
  guildonly: false,
  aliases: [],
  permlevel: 0
}
exports.help = {
  name: 'tablo',
   cooldown: 5  
}