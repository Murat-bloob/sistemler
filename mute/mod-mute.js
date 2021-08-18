const Discord = require('discord.js');
const db = require("quick.db");
const moment = require("moment");

const client = new Discord.Client();
const ms = require("ms")
exports.run = async(client, message, args) => {
  let Yetkili = await db.fetch(`muteyetki.role.${message.guild.id}`);
  let mutedd = message.guild.roles.cache.get(Yetkili);
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!!";  
  let log = db.fetch(`mute.log.${message.guild.id}`)

  if(!log) return message.channel.send(`**Sistem ayarlanmamış. Ayarlamak İçin ${prefix}mute-log**`)
  if(!Yetkili) return message.channel.send(`**Sistem ayarlanmamış. Ayarlamak İçin ${prefix}mute-yetkili**`)

message.delete();
function hata(mesaj) {

let embed = new Discord.MessageEmbed()
.setTitle("❌ Olamaz.. Hata!")
.setColor("#f8f8f9")
.setDescription(mesaj)
.setFooter(client.user.username+" | EtherZ Mute Sistemi", client.user.avatarURL())
return message.channel.send(embed).then(tr => tr.delete({timeout: 11000}))
}


moment.locale("tr");

if(!message.member.roles.cache.has(Yetkili)) return message.channel.send(new Discord.MessageEmbed()
.setTitle(`**Yetki Hatası**`)
.setColor('#f8f8f9')
.setThumbnail(message.author.avatarURL())
.setDescription(`**•** \`${prefix}mute\` **kullanmak için,** <@${mutedd}> **yetkisine sahip olman gerekiyor.**`)).then(a => a.delete({timeout: 10000}));  
 
let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username === args[0])
let süre = args[1]
let sebep = args.slice(2).join(" ") || "Belirtilmedi."


if(!user || user.bot) return hata(new Discord.MessageEmbed()
.setTitle('Bir hata oldu!')
.setDescription(`**Kullanıcı etiketleyerek dener misin?**

**Örnek olarak**:
\`\`\`${prefix}mute @üyeetiketi 1m merhaba
${prefix}mute 686185592899633200 1m merhaba\`\`\``)).then(msg=>msg.delete({timeout :3000}))

if(!süre) return hata(new Discord.MessageEmbed()
.setTitle('Bir hata oldu!')
.setDescription(`${message.author} **Süre** Belirtmeyi unutma lütfen! \`1s & 1m & 1h & 1d\` kullanarak dener misin?

**Örnek olarak**:
\`\`\`${prefix}mute @üyetiketi 1m merhaba\`\`\``)
).then(msg=>msg.delete({timeout :3000}))
if(!sebep) sebep = "Bir neden girilmedi!"


let ms_süre;
let dsüre;
let eksüre


if(süre.includes("s")) { 
dsüre = dsüre = "s"
eksüre = "s"
}

if(süre.includes("m")) {
dsüre = dsüre = "m"
eksüre = "m"
}

if(süre.includes("h")) {
dsüre = dsüre = "h"
eksüre = "h"
}

if(süre.includes("d")) {
dsüre = dsüre = "d"
eksüre = "d"
}

if(!dsüre) return hata("Belirttiğin zaman biçimi hatalı! **s(saniye), m(dakika), h(saat), d(gün)**").then(msg=>msg.delete({timeout :3000}))

ms_süre = süre.replace(eksüre, "")

if(isNaN(ms_süre) || ms_süre < 1) return hata(new Discord.MessageEmbed()
.setTitle('Bir hata oldu!')
.setDescription(`${message.author} **Süre** Belirtmeyi unutma lütfen! \`1s & 1m & 1h & 1d\` kullanarak dener misin?

**Örnek olarak**:
\`\`\`${prefix}mute @üyetiketi 1m merhaba\`\`\``)
).then(msg=>msg.delete({timeout :3000})).then(msg=>msg.delete({timeout :3000}))

ms_süre = ms(ms_süre+dsüre)


let mute_rol = message.guild.roles.cache.find(rol => rol.name.toLowerCase().includes("susturuldu") || rol.name.toLowerCase().includes("muted"))

if(!mute_rol) {

message.guild.roles.create({
data: {
name: 'Muted'
},
}).then(rol => {
  rol.setPermissions(0)
message.guild.channels.cache.forEach(kanal => {

kanal.updateOverwrite(rol, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false,

      }); 

})



})
}

let mute_rol2 = message.guild.roles.cache.find(rol => rol.name.toLowerCase().includes("susturuldu") || rol.name.toLowerCase().includes("muted"))
if(mute_rol2) {

let member = message.guild.members.cache.get(user.id)

if(member.roles.cache.has(mute_rol)) return hata("Bu kullanıcı zaten bir muteye sahip!")

const moment = require("moment")
moment.locale("tr")

let tamam = new Discord.MessageEmbed()
.setAuthor(message.author.username, message.author.avatarURL())
.setTitle("✅ Kullanıcı Susturuldu!")
.setDescription(`\`${user.username}\` **adlı Kullanıcı** \`${süre}\` **süreyle** \`${sebep}\` **nedeniyle susturuldu**`)
.setColor("#f8f8f9")
message.channel.send(tamam).then(msg=>msg.delete({timeout :20000}))
member.roles.add(mute_rol)
message.guild.channels.cache.get(log).send(new Discord.MessageEmbed()
.setColor('#f8f8f9')
.setTitle('EtherZ - Chat Mute Sistem')
.setDescription(`
${member.user} isimli yetkili bir kullacıyı susturdu. Bilgiler aşağıda bulunuyor.

・Susturulan kullanıcı → **${message.author.tag}**
・Susturan yetkili → **${member.user.tag}**
・Susturulma sebebi → **${sebep}**
・Susturulma tarihi → **${moment(Date.now()).format(" LL (DD/MM/yyyy) HH:mm:ss")}**
・Susturulma süresi → **${süre}**
`)
.setThumbnail(message.author.avatarURL()))

db.set(`mute_${user.id}`, {kanal: db.fetch(`mute.log.${message.guild.id}`), ms: ms_süre, başlangıç: Date.now(), sebep: sebep, moderator: message.author.id, sunucu: message.guild.id})


} else {

return message.channel.send(new Discord.MessageEmbed()
.setTitle(`**Uyarı**`)
.setDescription(` \`Muted\` **Adlı bir rol oluşturuldu lütfen komudu tekrar girin** `)
.setColor('#fa0606')
.setThumbnail(message.author.avatarURL()));


}

} 

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["sustur"],
  permLevel: 0
};

exports.help = {
  name: 'mute',
  description: '',
    usage: '!!mute @kişi <süre> <sebep>',
   cooldown: 5  
};