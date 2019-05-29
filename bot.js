const Discord = require('discord.js');
const client = new Discord.Client();

const { prefix, token } = require('./config.json');

//Created variables
var que = []; // Stores players waiting in que
var players = [];// Stores players in the game
var mafia = [];
var innocents = [];
var playersVoted = [];
var alive = [];
var dead = [];
var mainChannel;
var generalChannel = "575496493360873500"
var timeTillVote = 1;
var timeTillNight = 1;
var a = 0;
var b = 0;
var timerId;
var timerId2;
var gameRunning = false;
var gameName = "";
var day = 1;
var maxDays;
var minPlayers = 1;
var voteOpen = false;
var mafiaKillAllowed = false;


// Finds messages that start with the prefix to be excuted as commands (see function processCommand)
client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return
    }
    if (receivedMessage.channel.type == "dm") {
		return;
	}
    if (receivedMessage.content.startsWith(prefix)) {
        processCommand(receivedMessage)
    }
	a = timeTillVote;
	b = timeTillNight;
})


// Confirms login in the console
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Lists all players in the que
function listPlayers(arguments, receivedMessage){
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
function joinGame(arguments, receivedMessage){
	if (mainChannel != null){
		if (!que.includes(receivedMessage.member.id)) {
			mainChannel.send(receivedMessage.author + " has joined the game");
			que.push(receivedMessage.member.id) 
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
function setup(arguments, receivedMessage){
	mainChannel = receivedMessage.channel
	if (arguments == ""){
		gameName = receivedMessage.author.username + "'s Game"
	}
	else{
		arguments.forEach(function(element){
			gameName += " " + element;
		});
	}
	console.log(gameName);
	client.user.setPresence({ status: 'online', game: { name: gameName } });
	mainChannel.send(gameName + " has started in this channel");
}

//A basic help function
function help(arguments, receivedMessage){
	if (mainChannel != null) {
		mainChannel.send("Commands: `" + prefix + "help ` `" + prefix + "join ` `" + prefix + "setup `");
	}
	else {
		receivedMessage.channel.send("Please use `" + prefix + "setup` to set a channel");
	}
}

//Starts the countdown till game starts
function startCheck(arguments, receivedMessage){
	if (mainChannel != null) {
		//Checks to see if there is a game running
		if (gameRunning == false){
			if (que.length < minPlayers)
			{
				mainChannel.send("There needs to be at least " + minPlayers + " players to start the game");
			}
			else if (!que.length == 0){
				gameRunning = true
				players = que; //Moves the que to the game
				que = []; //Wipes Que
				alive = players.splice();
				startGame();
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

//Starts the nightime routine
function nightTime(receivedMessage){
	timeTillNight = b
	mafia.forEach(function(element) {
	client.users.get(element).send("Which player will see their demise?")
	client.users.get(element).send("Choose who you want to kill")
	for (i = 0; i <= players.length - 1; i++){
		client.users.get(element).send("<@" + players[i] + ">")
		
		client.on('message', msg => {
		const filter = (reaction, user) => reaction.emoji.name === "☠";
		
		let collector = msg.createReactionCollector(filter, { time: 5000 })
		
		collector.on('collect', (reaction, collector) => {
			if(players.includes = collector.message.content){
				id = collector.message.content.slice(2, collector.message.content.length - 1)
				client.users.get(id).send("[" + gameName + "]" + " :ghost:  You have died... :ghost:")
				dead.push(collector.message.content)
				startDay(receivedMessage)
				return;
			}
		return;
		});

		})
		}
	})
	mafiaKillAllowed = true;
}

//Opens Voting for players
 function votingOpen(){
	 mainChannel.send("Voting has opened \n type `!vote @player` to vote to hang them");
	 voteOpen = true;
	 timerId = setInterval(countdownVoteOpen, 1000);
	 timeLeft = 10
 }
 
//Runs a simple countdown till voting
 function countdownVoteOpen(receivedMessage) {
      if (timeTillVote == 0) {
		clearTimeout(timerId);
		votingOpen();
	  }
	  timeTillVote--;
 }
 
//Runs a simple countdown till night
 function countdownTillNight(receivedMessage){
	  if (timeTillNight == 0) {
		clearTimeout(timerId2);
		nightTime();
	  }
	  timeTillNight--;
 }

//Starts the game
function startGame(arguments, receivedMessage){
	console.log("Game Started")
	maxDays = players.length - 1;
	mafia[0] = players[Math.floor(Math.random()*players.length)];
	client.users.get(mafia[0]).send("[" + gameName + "]" + " You are a mafioso", {files: ["./Mafioso.png"]})
	players.forEach(function(element) {
		if (element != mafia[0]){
			innocents.push(element) 
			for (i = 0; i < innocents.length; i++) {
					client.users.get(innocents[i]).send("[" + gameName + "]" + " You are a innocent", {files: ["./Innocent.png"]})
				}
			}	
		});
	startDay(receivedMessage);
}

//Starts each day with a greeting
function startDay(receivedMessage){
	if (day == 1){
		mainChannel.send("Day: " + day + " has begun, good morning :sunrise: " + (timeTillNight/60) + " minutes till nightfall");
		timerId2 = setInterval(countdownTillNight, 1000); //Creates timer
		day++;
	}
	else{
		mainChannel.send("Day: " + day + " has begun \nAnd the body of " + dead[dead.length-1] + " has be found overnight :open_mouth: \nYou have " + (timeTillVote/60) + " minutes until voting opens to vote who killed them");
		timerId = setInterval(countdownVoteOpen, 1000); //Creates timer
	}
}

//The vote command
function vote(arguments, receivedMessage){
	if (mainChannel != null) {
		if (voteOpen){
			if(alive.includes(receivedMessage.member.user.id)){
				if(!playersVoted.includes(receivedMessage.member.user)){
					if(players.indexOf(receivedMessage.mentions.members.first())){
						if (!playersVoted.length == alive.length){
							playersVoted.push(receivedMessage.member.user)
							receivedMessage.channel.send(receivedMessage.author.username + " has voted for " + receivedMessage.mentions.members.first())
						}
						// if (!playersVoted.length == alive.length)
						else{
							votePassed(receivedMessage);
						}
					}
					// if(players.indexOf(receivedMessage.mentions.members.first()))
					else{
						receivedMessage.channel.send("Player is not in the game");
					}
				}
				// if(!playersVoted.includes(receivedMessage.member.user))
				else{
					receivedMessage.channel.send("You have already voted!");
				}
			}
			else{
				receivedMessage.member.user.send("[" + gameName + "]" +" :zipper_mouth: Dead people don't talk!! :zipper_mouth: ")
				receivedMessage.delete(1000);
			}
		}
		// if (voteOpen)
		else
		{
			receivedMessage.channel.send("Voting is not open!");
		}
	}
	// if (mainChannel != null)
	else {
		receivedMessage.channel.send("Please use `" + prefix + "setup` to set a channel");
	}
}


function votePassed(receivedMessage){
	
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
        startCheck(arguments, receivedMessage)
	}
	else if (primaryCommand == "vote") {
        vote(arguments, receivedMessage)
	}
	else {
        receivedMessage.channel.send("I don't understand the command. Use please use `" + prefix + "help`")
    }
}


client.login(token);