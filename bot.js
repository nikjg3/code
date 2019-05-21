const Discord = require('discord.js');
const client = new Discord.Client();

const { prefix, token } = require('./config.json');

//Created variables
var que = []; // Stores players waiting in que
var players = [];// Stores players in the game
var mafia = [];
var innocents = [];
var mainChannel;
var generalChannel = "575496493360873500"
var timeLeft = 10;
var timerId;
var gameRunning = false;



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
		if (!que.length == 0){
			mainChannel.send("Players currently in que")
			mainChannel.send(que)
		}
		else
			mainChannel.send("There are currently no players in the que")
	}
	else {
		receivedMessage.channel.send("Please use `" + prefix + "setup` to set a channel");
	}

}

//Adds the player to the que
function joinGame(arguments, receivedMessage)
{
	if (mainChannel != null){
		if (!que.includes(receivedMessage.member.user)) {
			mainChannel.send(receivedMessage.member.user + " has joined the game");
			que.push(receivedMessage.member.user) 
		}
		else{
			mainChannel.send("You are already in the que");
		}
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
		mainChannel.send("Commands: `" + prefix + "help ` `" + prefix + "join ` `" + prefix + "setup `");
	}
	else {
		receivedMessage.channel.send("Please use `" + prefix + "setup` to set a channel");
	}
}

//Starts the countdown till game starts
function startCountdown(arguments, receivedMessage)
{
	if (mainChannel != null) {
		//Checks to see if there is a game running
		if (gameRunning == false){
			if (que.length <= 1)
			{
				mainChannel.send("There needs to be at least 2 players to start the game");
			}
			else if (!que.length == 0){
				gameRunning = true
				players = que; //Moves the que to the game
				timerId = setInterval(countdown, 1000); //Creates timer
			}
			else{
			mainChannel.send("There are currently no players in the que");
			}
		}
		else{
			mainChannel.send("There is already a game running in this server");
		}
	}
	else {
		receivedMessage.channel.send("Please use `" + prefix + "setup` to set a channel");
	}
}

//Runs a simple countdown till the game starts
 function countdown() {
      if (timeLeft == 0) {
		clearTimeout(timerId);
        startGame();
      } 
	  else if (timeLeft == 30){
		mainChannel.send("The game will start in " + timeLeft + " seconds");
		timeLeft--;
	  }
	  else if (timeLeft == 20){
		mainChannel.send("The game will start in " + timeLeft + " seconds");
		timeLeft--;
	  }
	  else if (timeLeft == 10){
		mainChannel.send("The game will start in " + timeLeft + " seconds");
		timeLeft--;
	  }
	  else if (timeLeft == 5){
		mainChannel.send("The game will start in " + timeLeft + " seconds");
		timeLeft--;
	  }
	  else {
        timeLeft--;
      }
 }
 
//Starts the game
function startGame(arguments, receivedMessage)
{
	mafia[0] = players[Math.floor(Math.random()*players.length)];
	mafia[0].send("You are a mafioso", {files: ["https://vignette.wikia.nocookie.net/town-of-salem/images/e/e3/Mafioso_Skin.png/revision/latest?cb=20181221193552.png"]})
	players.forEach(function(element) {
		if (element != mafia[0])
		{
		innocents.push(element) 
		innocents.forEach(function(element) {
				element.send("You are a innocent", {files: ["https://hypixel.net/proxy/BcmjTMrMwQRqWG5vIx7S07FfcSvBRqB%2BawyKznN%2FZQtlUAwe5V%2FM9LJ%2F1HDQnNDDbxulL%2FNE%2BYUuDww%2Bs2oM0XWM7CPaT1MEkPZtsFwlYatILR6ZtlyCZRCeIHbEis1yPX2Ymv7nieVFtsvHqDCm/image.png"]})
			});
		}
	});
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
	else if (primaryCommand == "start") {
        startCountdown(arguments, receivedMessage)
	}
	else {
        receivedMessage.channel.send("I don't understand the command. Use please use `" + prefix + "help`")
    }
}


client.login(token);