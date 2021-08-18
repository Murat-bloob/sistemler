const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async(client, message, args) => {
  message.delete()
  let Yetkili = await db.fetch(`modRole.${message.guild.id}`);
  if(!Yetkili) return message.channel.send(`Sistem ayarlanmamış. Ayarlamak İçin !!mod-rol`)

  
 let Kanal = await db.fetch(`processChannel.${message.guild.id}`);
  if(!Kanal) return message.channel.send(`Sistem ayarlanmamış. Ayarlamak İçin !!onay-red-log`)

   
   let Kanal2 = await db.fetch(`logChannel.${message.guild.id}`);
  if(!Kanal2) return message.channel.send(`Sistem ayarlanmamış. Ayarlamak İçin !!başvuru-kanal`)

  
  let Dev = await db.fetch(`devRole.${message.guild.id}`);
  if(!Dev) return message.channel.send(`Sistem ayarlanmamış. Ayarlamak İçin !!dev-rol`)

  
      const embed = new Discord.MessageEmbed()
     .setColor("#f8f8f9")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!!";  

  if(!message.member.roles.cache.has(Yetkili)) return message.channel.send(new Discord.MessageEmbed()
  .setTitle(`**Yetki Hatası**`)
  .setColor('#f8f8f9')
  .setThumbnail(message.author.avatarURL())
  .setDescription(`**•** \`${prefix}bot-reddet\` **kullanmak için,** <@${Yetkili}> **yetkisine sahip olman gerekiyor.**`)).then(a => a.delete({timeout: 10000}));
   
	   
	  if(message.channel.id !== Kanal) return message.channel.send(embed.setDescription(`Bu Komutu Sadece <#${Kanal}> Kanalında Kullanabilirsin!`));
      let botID = args[0];
      let redReason = args.slice(1).join(' ');
      if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("Reddetmek istediğiniz Botun ID sini Belirtiniz."));
	  if(!redReason) return message.channel.send(embed.setDescription("Lütfen Bir Sebeb Belirtiniz."));
	  
	  let discordBot = null;
      try {
		  discordBot = await client.users.fetch(botID);
	  }	catch {
          return message.channel.send(embed.setDescription("Discord Apide Böyle Bir Bot Bulamadım."));
	  }	
	  
	  let bot =  db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	  if(!bot) return message.channel.send(embed.setDescription(`**${discordBot.username}** Adlı Bot Sisteme Daha Önceden Eklenmemiş.`));

	  if(bot.status == "Reddedildi")  return message.channel.send(embed.setDescription(`**${discordBot.username}** Adlı Bot Zaten Reddedilmiş Durumda!`))
	  if(bot.status == "Beklemede")  db.subtract(`serverData.${message.guild.id}.waitSize`, 1)
	  if(bot.status == "Onaylı")  db.subtract(`serverData.${message.guild.id}.succSize`, 1)
       let memberData = await client.users.fetch(bot.owner)
   
       if(message.guild.members.cache.get(bot.owner)) message.guild.members.cache.get(bot.owner).roles.remove(Dev)
		   
	   db.add(`serverData.${message.guild.id}.redSize`, 1);
	   db.set(`serverData.${message.guild.id}.botsData.${botID}.status`, "Reddedildi")
	   db.set(`serverData.${message.guild.id}.botsData.${botID}.redReason`, redReason)
     const Reddedildi = new Discord.MessageEmbed()
     .setColor("#f8f8f9") 
     .setAuthor("EtherZ Bot", client.user.avatarURL())                                  
     .setDescription(`:lock: \`${discordBot.tag} (${discordBot.id})\` **Adlı Bot \`${redReason}\` Sebebi İle Reddedildi!**`)
     .addField(`Sahip Hakkında`,`<@${memberData.id}> **(${memberData.id})**`)
     .setTimestamp()
     message.guild.channels.cache.get(Kanal2).send(`<@${memberData.id}>`,Reddedildi)

    message.react('✅')

  }

exports.conf = {
  enabled: true,
  guildonly: false,
  aliases: ['reddet'],
  permlevel: 0
}
exports.help = {
  name: 'bot-reddet',
   cooldown: 5  
}