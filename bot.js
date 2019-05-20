const Discord = require('discord.js');
const client = new Discord.Client();

const { prefix, token } = require('./config.json');

//Created variables
var que = []; // Stores players waiting in que
var players = [];// Stores players in the game
var mainChannel;
var generalChannel = "575496493360873500"


// Finds messages that start with the prefix to be excuted as commands (see function processCommand)
client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return
    }
    
    if (receivedMessage.content.startsWith(prefix)) {
        processCommand(receivedMessage)
    }
})

// Confirms login in the console
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Lists all players in the que
function listPlayers(arguments, receivedMessage)
{
	if (mainChannel != null) {
			mainChannel.send("Players currently in que")
			mainChannel.send(que)
	}
	else {
		receivedMessage.channel.send("Please use `" + prefix + "setup` to set a channel");
	}

}

//Adds the player to the que
function joinGame(arguments, receivedMessage)
{
	if (mainChannel != null){
		mainChannel.send(receivedMessage.member.user + " has joined the game");
		que.push(receivedMessage.member.user) 
	}	
	else {
		receivedMessage.channel.send("Please use `" + prefix + "setup` to set a channel");
	}
}

//Defines what channel messages will be sent in
function setup(arguments, receivedMessage)
{
	mainChannel = receivedMessage.channel
	mainChannel.send("The bot will now use this channel");
}

//A basic help function
function help(arguments, receivedMessage)
{
	if (mainChannel != null) {
		mainChannel.send("Commands: " + prefix + "help " + prefix + "join " + prefix + "setup ");
	}
	else {
		receivedMessage.channel.send("Please use `" + prefix + "setup` to set a channel");
	}
}

//Starts the game
function startGame(arguments, receivedMessage)
{
	players = que; //Moves the que to the game
}

//Processes commands by sepearting
function processCommand(receivedMessage) {
	let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) 

    if (primaryCommand == "help") {
        help(arguments, receivedMessage)
    } 
	else if (primaryCommand == "setup") {
        setup(arguments, receivedMessage)
	}
	else if (primaryCommand == "join") {
        joinGame(arguments, receivedMessage)
	}
	else if (primaryCommand == "players") {
        listPlayers(arguments, receivedMessage)
	}
	else {
        receivedMessage.channel.send("I don't understand the command. Use please use " + prefix + "help")
    }
}


client.login(token);