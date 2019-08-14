//Dependencies

const Discord = require('discord.js');
const client = new Discord.Client();
const update = require('./lib/update.js');
const auth = require('./auth.json');
var admin = require('./lib/admin.js');

//Load configuration and blacklist files 
console.log("\n Loading files... \n")

if(admin.loadConfig()== true){
	console.log("\tConfiguration file loaded\n");
}
if(admin.loadBlacklist() == true){
	console.log("\tBlacklist file loaded\n")
}



//This string will be used to store the daily pact vendors
var todayVendorString = "";
//This string is just used to generate the first part of the string to show events.
function event_alert() { return "In the next  " + admin.config().getMargin() + " minutes "};
var timezoneOffset = 0;
//In case bot disconnects and reconnects no need to relaunch event timers.
var reconnect = false;



/**
 * This function asks for the events that will happen in "margin" minutes 
 * and sends them to the alert channel.
 */
function botUpdateEvent(){
	if(admin.config().getAutoalerts() == false)
		return;
	//Check which events happen in the next "margin" minutes

	var comingEvents = update.comingEvents(admin.config().getMargin());
	var eventMessage = " ";

	//If any event takes place
	if(comingEvents.length !== 0){
		for(var event_n in comingEvents){
			event = comingEvents[event_n];

			var eHour = event["Time"].Hour + admin.config().getTimeOffset();
			if(eHour>24){
				eHour -= 24;
			}
			var event_string = "EVENTO: "+ event["Name"]+" en " + event["Waypoint"] + " a las " + eHour +":"+  event["Time"].Minutes;
			eventMessage+= event_string +"\n";
			console.log(event_string);
			
		}
		//Send it to the channel.
		client.channels.get(admin.config().getAlertChannel()).send(eventMessage);
	}
}

/**
* This function launches the pact vendor refresh event.
* The event is launched at XX:00:30 to prevent it from conflicting with other events.
* @param timer4pv the time i want the pact vendor to update at.
* @param timeNow current time.
*/
function pvUpdateEvent(timer4pv,timeNow){
	var hourD=timer4pv.getHours()-timeNow.getHours();

  	updatePactVendor();
  	try{
	  	if(hourD < 0){
	  		setTimeout(function(){
	  			updatePactVendor(); 
	  			setInterval(function(){updatePactVendor();},3600*24*1000)},timeInMS(timer4pv)-timeInMS(timeNow)+30000);
	  		//console.log(timeInMS(tenAMUTC2)-timeInMS(timeNow));
	  	}else{
	  		setTimeout(function(){
	  			updatePactVendor(); 
	  			setInterval(function(){updatePactVendor();},3600*24)},3600*24*1000 - timeInMS(timer4pv)-timeInMS(timeNow)+30000);
	  		//setTimeout(updatePactVendor(),3600*24 - (timeInMS(tenAMUTC2)-timeInMS(timeNow)));
	  		//console.log(3600*24 - (timeInMS(tenAMUTC2)-timeInMS(timeNow)))
  		}
  	}catch(err){
  		console.log("Error at pvUpdateEvent: "+err.message);
  	}
}
/**
* This function updates the string with the pact vendor locations.
*
*/
function updatePactVendor(){
	todayVendorString = update.mercaderesInfo();
}

/**
* This function transforms a hour into miliseconds
*/
function timeInMS(date){
  		return (date.getHours()*3600+date.getMinutes()*60 + date.getSeconds())*1000;
}

/**
* This function launches all timed tasks:
* 	·Checking for events every minute, 
*	·Updating the pact vendor string daily.
*/
function initAutoUpdates(){
	//Si esta reconectando no tiene que timear nada.
	if(reconnect == true)
		return;
	//To make it "smoother", the events will update every minute at 01 seconds, and pact vendor will update
  	// every day 8 am. 
  	var timeNow = new Date();
  	var timer4pv = new Date("1-1-2019T8:00:00");
  	timezoneOffset = timeNow.getTimezoneOffset()/60;
  	pvUpdateEvent(timer4pv,timeNow);

  	//Make the event bot launch at the next minute+1second and then relaunch itself every minute
  	var left4Update =60-timeNow.getSeconds();
  	try{
  		setTimeout(function(){botUpdateEvent(); setInterval(function(){botUpdateEvent();},60000)},(left4Update+1)*1000);
	}catch(err){
		console.log("Error at botUpdate");
	}
}

/**
* Returns the string with the events that are passed as arg.
* @param {Array} comingEvents the array of events to print.
* @param {Number} minutes "margin" of those events to happen, just used as a variable to print.
* @return {String} all the events in a string.
*/
function eventsToString(comingEvents, minutes){
	var eventMessage = "Eventos en los siguientes  "+ minutes+ " minutos: \n";
	if(comingEvents.length !== 0){
			//console.log("recibidos eventos");
			for(var event_n in comingEvents){
				event = comingEvents[event_n];
				var eHour = event["Time"].Hour + admin.config().getTimeOffset();
				if(eHour>24){
					eHour -= 24;
				}
				var event_string = " - "+ event["Name"]+" en " + event["Waypoint"] + " a las " + eHour +":"+  event["Time"].Minutes;
				eventMessage+= event_string +"\n";
				
				
			}
		return eventMessage;
	}else{
		return "No hay eventos en los siguientes "+ minutes + " minutos";
	}
}




/**
* This function prints the bot information of public commands
* @return the string with said help.
*/
function helpString(){
	var defaultMessage = " The available commands are: \n";
	var commands = 	"\t !pactvendor or !pact  for pact agent locations\n" +
					"\t !events or !events X for events in" +admin.config().getMargin() +" minutes or events in X minutes\n" +
					"\t !info or !help for this message.";
	return defaultMessage+commands;
}


/**
* This function launches when discord client is ready. 
* It initialises required events.
*/
client.on('ready', () => {
	//When ready, load the eventList (from update.js)
  	update.init();

  	//Launch the autoupdates
  	initAutoUpdates();

  	//If everything worked, display on console successfull log in.
	console.log(`Logged in as ${client.user.tag}!`);
	
});

/**
* This function reacts to direct messages received by the bot.
* For now, it will react to:
*	·!pactvendor / !pact for the todayvendorstring
*  	·!events for the events coming in the next "margin" minutes
*   ·!events $int for the events coming in the next $int minutes (from 1-59) or default answer.
*/

client.on('message', msg => {
	//console.log(admin.config);
	if(msg.author.id == admin.config().getBotId())
		return;
	if(!(msg.content.charAt(0) === '!')){
		return;
	}

	//Store the author.
	if(!(admin.users().isValidUser(msg.author))){
		//msg.reply("Bot unavailable for you."); 
		return;
	}

	switch(msg.content.split(" ")[0]){
		case "!admin":
			
			admin.adminActions(msg);
			//console.log("bot.js: \n" );
			//console.log(admin.config);
		break;
		default:

		break;
	}

	//Message mgmt for now ill use if... else if ... else but will change to switch.
  	if (msg.content === '!pactvendor' || msg.content === '!pact') {
    	msg.reply(todayVendorString);
  	}else if(msg.content === '!events'){
  		msg.reply(eventsToString(update.comingEventsIn(admin.config().getMargin()),admin.config().getMargin()));
  	}else if(msg.content.includes("!events")){
  		var msgsplit = msg.content.split(" ");
  		if(msgsplit[0] === '!events'){
  			if(isNaN(msgsplit[1])){
  				msg.reply("Wrong syntax. use !event minutes");
  			}else{
  				msg.reply(eventsToString(update.comingEventsIn(msgsplit[1]),msgsplit[1]));
  			}
  		}
  	}else if(msg.content === ("!help") || msg.content === ("!info") || msg.content === "!ayuda"){
  		msg.reply(helpString());
  	}else{
  		
	  		switch(msg.content.split(" ")[0]){
	  			case "!admin":
	  				
	  			break;
	  			default:
	  				msg.reply("Type !info for a list of available commands");
	  			break;
	  			

	  		

  		}
  }
 
});


client.on('disconnect', function(erMsg, code) {
    console.log('----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----');
    reconnect = true;
    
});

//Launch the client
client.login(auth.token);

