const Discord = require('discord.js');
const db = require("quick.db");

exports.run = async (client, message, args) => {
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!!"; 

  let karı = db.fetch("kadın."+message.guild.id)
  if(!karı) return message.channel.send(`**Rol ayarlanmamış. Ayarlamak İçin** \`${prefix}kız-rol\``)
const kadınroleID = await db.fetch(`kadın.${message.guild.id}`);
const yetkiliroleID = await db.fetch(`jail.yetkilirole.${message.guild.id}`);
const jailRoleID = await db.fetch(`jail.karantinarole.${message.guild.id}`);
const nn = new Discord.MessageEmbed().setThumbnail();
if(!args[0] || !message.mentions.members.first()) return message.channel.send(nn.setTitle('Bir hata oldu!').setColor('#f8f8f9').setDescription(`Kullanıcı Etiketleyerek dener misin?`)).then(a => a.delete({timeout: 10000}));


let member = message.mentions.members.first();
let jeloo = message.guild.members.cache.get(member.id).roles.remove(jailRoleID);
let kero = message.guild.members.cache.get(member.id).roles.add(kadınroleID);
let kadın = message.guild.roles.cache.get(kadınroleID);
let yetkili = message.guild.roles.cache.get(yetkiliroleID);
let jailled = message.guild.roles.cache.get(jailRoleID);
if(!kadın || !yetkili || jailled) return;

if(!message.member.roles.cache.has(yetkiliroleID)) return message.channel.send(nn.setDescription(`${yetkili} | Rolüne sahip olman gerekiyor.`));
db.add(`say.kadın.${message.author.id}.${message.guild.id}`, 1);
message.channel.send(new Discord.MessageEmbed()

.setDescription(`${member} **Kullanıcısına ${kadın} rolü verilerek karantinadan çıkartıldı.**`)
.setFooter(message.author.username, message.author.avatarURL())
.setThumbnail(member.user.avatarURL() ? member.user.avatarURL({dynamic: true}) : 'https://cdn.discordapp.com/attachments/799219254892822528/803748168201535488/E5.png'))

};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
}

exports.help = {
  name: 'k-kız',
   cooldown: 5  
};