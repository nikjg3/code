// require the discord.js module
const Discord = require('discord.js');

var nigger = ["nig","nigger","niger","nigg"];
var nigcount = 0;

const { prefix, token } = require('./config.json');
// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});
client.on('message', message => {
for (var i = 0; i < nigger.length; i++) {
  if (message.content.includes(nigger[i])) {
	nigcount = nigcount + 1;
    message.channel.send('Thats ' + nigcount + " nigs!");
	message.pin({ reason: 'nigger' })
    break;
  }
}
});



// login to Discord with your app's token
client.login(token);

