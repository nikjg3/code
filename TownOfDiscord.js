// require the discord.js module
const Discord = require('discord.js');
const fs = require('fs');

var nigger = ["nig","nigger","niger","nigg"];

var nigger2 = /(\b(n|i){1,32}((g{2,32}){1,32}|[gq]{2,32})[ea3r]{1,32}|(nig\s))/gi;

const { prefix, token } = require('./config.json');
// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});
client.on('message', message => {
const nigcount = require('./nig.json'); 
const ID = message.author.username;
console.log(nigcount[ID]);
if(message.author.username != "NigBot"){
if(nigcount[ID] == null)
{
	nigcount[ID] = 0;
	fs.writeFileSync('./nig.json', JSON.stringify(nigcount));
}
  if (message.content.match(nigger2)) {
	nigcount[ID] += 1;
	fs.writeFileSync('./nig.json', JSON.stringify(nigcount));
    message.channel.send(message.author.username + ' has been a naughty boy ' + nigcount[ID] + " times!");
	message.pin({ reason: 'nigger' })
  }
if (message.content =="!n") {
	message.channel.send("Nig Leaderboard\n" + "---------------\n" + JSON.stringify(nigcount,null,1).replace(/[{},"]/g, ""));
}
}
});



// login to Discord with your app's token
client.login(token);

