const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async(client, message, args) => {
  message.delete()

    let Kanal = await db.fetch(`addChannel.${message.guild.id}`);
  if(!Kanal) return message.channel.send(`Sistem ayarlanmamış. Ayarlamak İçin !!başvuru-kanal`)
  
   let Kanal2 = await db.fetch(`logChannel.${message.guild.id}`);
  if(!Kanal2) return message.channel.send(`Sistem ayarlanmamış. Ayarlamak İçin !!bot-log`)

  let bune = args[1] || 'Belirtilmemiş'
      const embed = new Discord.MessageEmbed()
     .setColor("#f8f8f9")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())
	 

	  if(message.channel.id !== Kanal) return message.channel.send(embed.setDescription(`**Bu Komutu Sadece <#${Kanal}> Kanalında Kullanabilirsin!**`)).then(a => a.delete({timeout: 10000}));
	  
	  let botID = args[0];
      if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("**Lütfen Eklemek İstediDiniz Botun ID sini Giriniz.**")).then(a => a.delete({timeout: 10000}));
	  let discordBot = null;
      try {
		  discordBot = await client.users.fetch(botID);
	  }	catch {
          return message.channel.send(embed.setDescription("**Discord Apide Böyle Bir Bot Bulamadım.**")).then(a => a.delete({timeout: 10000}));
	  }		

	  if(!discordBot.bot) return message.channel.send(embed.setDescription("**Lütfen Bot IDsi Giriniz, Kullanıcı ID Girmeyin!**")).then(a => a.delete({timeout: 10000}));
	  let bot =  db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	  
 
	  if(bot) {
		let member = await client.users.fetch(bot.owner);
        return message.channel.send(`<a:tanar:767184093108240474> \`${discordBot.username}\` **Adlı Bot Sisteme** \`${member.username}\` **Tarafından Eklenmiş Durum; **\`${bot.status}\``).then(a => a.delete({timeout: 10000}));
	 }
	
	  db.add(`serverData.${message.guild.id}.waitSize`, 1)
	  db.set(`serverData.${message.guild.id}.botsData.${botID}.owner`,  message.author.id)
	  db.set(`serverData.${message.guild.id}.botsData.${botID}.status`, "Beklemede")
	  
      let sira = db.fetch(`serverData.${message.guild.id}.waitSize`) || 0;
	   
	message.guild.channels.cache.get(Kanal2).send(
	  embed
	  .setDescription(`**Sisteme Bir Bot Eklendi, Bu Bot ile Sırada Toplam \`${sira}\` Bot Mevcut!**`)
	  .addField("**Ekleyen Hakkında**",`${message.author} (**${message.author.tag}**)`)
	  .addField("**Bot Hakkında**", `\`${discordBot.tag}\`(**${discordBot.id}**)`)
    .addField("**Bot Prefix**", `\`${bune}\``)
    .addField("**Bot Davet**", `[0 perm](https://discordapp.com/oauth2/authorize?client_id=${discordBot.id}&scope=bot&permissions=0) || [8 perm](https://discordapp.com/oauth2/authorize?client_id=${discordBot.id}&scope=bot&permissions=8) `)
	  )
  message.react('✅')
  }
exports.conf = {
  enabled: true,
  guildonly: false,
  aliases: [],
  permlevel: 0
}
exports.help = {
  name: 'bot-ekle',
   cooldown: 5  
}