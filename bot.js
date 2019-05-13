const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = 'NTc3NDUzMjc3Mzg2NjM3MzEz.XNlSUg.SUPK9tCJj7DwBns0gBNY6VFQL7w';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Please stop, it hurts!');
  }
});

client.on('message', msg => {
  if (msg.content === 'pong') {
    message.member.send('I just want it all to end');
  }
});
client.login(TOKEN);
