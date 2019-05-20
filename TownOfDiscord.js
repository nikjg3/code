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
    if (!message.content.startsWith(prefix) || message.author.bot) return;

const args = message.content.slice(prefix.length).split(/ +/);
const command = args.shift().toLowerCase();

    if (message.content === `${prefix}ping`) {
        message.channel.send('Don\'t do drugs');
    } else if (message.content === `${prefix}beep`) {
        message.channel.send('Beep beep, get the hell outta the way');
    }
    else if (message.content === `${prefix}server`) {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    }
    else if (message.content === `${prefix}DM`) {
        message.author.send(`Slide right in`);
    }
    else if (command === 'args-info') {
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }
    	else if (args[0] === 'foo') {
            return message.channel.send('bar');
        }
    
        message.channel.send(`First argument: ${args[0]}`);
    }
});


// login to Discord with your app's token
client.login(token);

