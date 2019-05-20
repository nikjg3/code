// require the discord.js module
const Discord = require('discord.js');

const { prefix, token } = require('./config.json');
// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    if (message.content === `${prefix}ping`) {
        message.channel.send('Don\'t do drugs');
    } else if (message.content === `${prefix}beep`) {
        message.channel.send('Beep beep, get the hell outta the way');
    }
    else if (message.content === `${prefix}server`) {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    }
});


// login to Discord with your app's token
client.login(token);

