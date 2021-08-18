const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async(client, message, args) => {
  message.delete()
	  let Yetkili = await db.fetch(`modRole.${message.guild.id}`);
  if(!Yetkili) return message.channel.send(`Sistem ayarlanmamış. Ayarlamak İçin !!mod-rol`)

  
 let Kanal = await db.fetch(`processChannel.${message.guild.id}`);
  if(!Kanal) return message.channel.send(`Sistem ayarlanmamış. Ayarlamak İçin !!onay-red-log`)

  
    	let botID = args[0]
		
	    const embed = new Discord.MessageEmbed()
        .setColor("#f8f8f9")
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	    .setTimestamp()
        .setFooter(client.user.username, client.user.avatarURL())
		  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!!";  

  if(!message.member.roles.cache.has(Yetkili))  return message.channel.send(new Discord.MessageEmbed()
  .setTitle(`**Yetki Hatası**`)
  .setColor('#f8f8f9')
  .setThumbnail(message.author.avatarURL())
  .setDescription(`**•** \`${prefix}bot-sil\` **kullanmak için,** <@${Yetkili}> **yetkisine sahip olman gerekiyor.**`)).then(a => a.delete({timeout: 10000}));
   
	    
	    if(message.channel.id !== Kanal) return message.channel.send(embed.setDescription(`Bu Komutu Sadece <#${Kanal}> Kanalında Kullanabilirsin!`)).then(a => a.delete({timeout: 10000}));
   
		 if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("Lütfen Profiline Bakmak istediğiniz Botun IDsini Yazınız")).then(a => a.delete({timeout: 10000}));
		
		 let bot = db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	     let discordBot = null;
         try {
	    	 discordBot = await client.users.fetch(botID);
	     }	catch {
            return message.channel.send(embed.setDescription("Discord Apide Böyle Bir Bot Bulamadım.")).then(a => a.delete({timeout: 10000}));
	     }	
		 
		 if(!bot) return message.channel.send(embed.setDescription(`Sistemde **${discordBot.username}** İsimli Bot Bulamadım.`)).then(a => a.delete({timeout: 10000}));
    
    if(bot.status == "Onaylı") db.subtract(`serverData.${message.guild.id}.succSize`, 1)
	  if(bot.status == "Beklemede")  db.subtract(`serverData.${message.guild.id}.waitSize`, 1)
	  if(bot.status == "Reddedildi")  db.subtract(`serverData.${message.guild.id}.redSize`, 1)
    
    db.delete(`serverData.${message.guild.id}.botsData.${botID}`);
    return message.channel.send(embed.setDescription(`**${discordBot.username}** isimli Bot Sistemden Silindi.`)).then(a => a.delete({timeout: 10000}));
  message.react('✅')
  
}
exports.conf = {
  enabled: true,
  guildonly: false,
  aliases: [],
  permlevel: 0
}
exports.help = {
  name: 'bot-sil',
   cooldown: 5  
}