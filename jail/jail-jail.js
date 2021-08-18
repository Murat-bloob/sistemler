const Discord = require('discord.js');
const db = require("quick.db");


exports.run = async (client, message, args) => {
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!!"; 
  
const logChannel = await db.fetch(`jail.log.${message.guild.id}`);
const jailYetkili = await db.fetch(`jail.yetkilirole.${message.guild.id}`);
const karantinaRole = await db.fetch(`jail.karantinarole.${message.guild.id}`);
if(!logChannel) return;
if(!jailYetkili) return;
if(!karantinaRole) return;

const errorEmbed = new Discord.MessageEmbed()
.setColor('#f8f8f9');
const errorEmbed2 = new Discord.MessageEmbed()
.setTitle('Bir hata oldu!');

if(!message.member.permissions.has(jailYetkili)) return message.channel.send(errorEmbed.setDescription(`${message.guild.roles.cache.get(muteYetkili)} | Rolüne sahip olman gerekiyor.`));
if(!args[0]) return message.channel.send(errorEmbed.setTitle('Bir hata oldu!').setDescription(`Kullanıcı etiketleyerek dener misin?`));
let sebep = args.slice(1).join(" ") || "Belirtilmemiş"
let member;
if(message.mentions.members.first()) {
member = message.mentions.members.first();
} else if(args[0]) {
member = message.guild.members.cache.get(args[0]);
if(!member) return message.channel.send(errorEmbed.setTitle('Bir hata oldu!').setDescription(`Kullanıcı etiketleyerek dener misin?`));
}

if(message.author.id === member.id) return message.channel.send(new Discord.MessageEmbed().setColor('#f8f8f9').setTitle('Agaa beeeeeeeee!').setDescription(`O kadar yürekli olamazsın.. 🙄`))
if(member.permissions.has('ADMINISTRATOR')) return message.channel.send(errorEmbed2.setDescription('Yönetici bir kullanıcıya karışamam!'));

message.channel.send(new Discord.MessageEmbed().setTitle('Karantinaya Biri Gitti').setDescription(`${member} Kullanıcısını karantinaya postaladık.`));
member.roles.cache.forEach(s => member.roles.remove(s.id));
member.roles.add(karantinaRole);
db.set(`jail-kullanıcı_${member.id}_${message.guild.id}`, sebep)
message.guild.channels.cache.get(logChannel).send(new Discord.MessageEmbed().setColor('#f8f8f9').setTitle('Karantinaya Biri Geldi')
.setDescription(`${member} Kullanıcısının tüm rollerine el koyuldu.
${message.guild.roles.cache.get(karantinaRole)} Kapsamına alınarak kontrolü kısıtlandı.`).setImage('https://cdn.glitch.com/322deae8-c50e-4ad8-a7d2-ff13f650466d%2Ftenor.gif')
.setFooter(`${message.author.username} Tarafından karantinaya alındı`, message.author.avatarURL() ? message.author.avatarURL({dynamic: true}) : 'https://cdn.glitch.com/8e70d198-9ddc-40aa-b0c6-ccb4573f14a4%2F6499d2f1c46b106eed1e25892568aa55.png').setThumbnail(member.user.avatarURL() ? member.user.avatarURL({dynamic: true}) : 'https://cdn.glitch.com/8e70d198-9ddc-40aa-b0c6-ccb4573f14a4%2F6499d2f1c46b106eed1e25892568aa55.png'))

};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['cezalı', 'Cezalı'],
  permLevel: 0
}

exports.help = {
  name: 'jail',
   cooldown: 5  
};