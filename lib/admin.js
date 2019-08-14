var config = require('./config.js');
var users = require('./users.js');

/**
* This function returns a string with the help message for admin commands.
* @return a string with the help message.
*/

function adminHelp(){
	var helpString = "The available admin commands are: \n";
		helpString += "\t alerts <toggle/on/off>\n";
		helpString += "\t margin <int> \n";
		helpString += "\t setTimeOffset <int> \n";
		helpString += "\t showUsers \n";
		helpString += "\t banUser <id>\n";
		helpString += "\t save_cfg \n";
		helpString += "\t setAlertChannel <channelid>\n";
		helpString += "\t (use syntax !admin <command> <parameter_if_any>) \n";
		return helpString;
}

/**
* This function parses the messages for !admin alerts command.
* @param msg the text message with the command.
*/
function alerts(msg){
	switch(msg.content.split(" ")[2]){
		case "toggle":
			config.setAutoalerts(!(config.getAutoalerts()));
			msg.reply(config.getAutoalerts() ? "Alertas activadas" : "Alertas desactivadas");
			config.save();
		break;
		case "on":
			config.setAutoalerts(true);
			msg.reply("Alertas activadas");
			config.save();
		break;
		case "off":
			config.setAutoalerts(false);
			msg.reply("Alertas desactivadas");
			config.save();
		break;
		default:
			msg.reply("Available alerts commands: \n \t ·toggle \n \t ·on \n \t ·off");
		break;
			
	}
}

/**
* This function parses all !admin <commmand> messages.
* @param msg the received message.
*/
function adminActions(msg){
	//Check if author is an admin
	if(msg.author.id === config.getAdminId()){

		switch(msg.content.split(" ")[1]){
			case "alerts":
				alerts(msg);
			break;
			case "setTimeOffset":
				if(isNaN(msg.content.split(" ")[2])){
					msg.reply("Wrong syntax. Type !admin help for admin commands");
				}else{
					var newTOff =msg.content.split(" ")[2];
					config.setTimeOffset(newTOff);
					config.save();
					msg.reply("The time offset is now: UTC+"+newTOff);
				}
			break;
			case "margin":
				if(isNaN(msg.content.split(" ")[2])){
						msg.reply("Wrong syntax. Type !admin help for admin commands");
					}else{
						var newMargin =msg.content.split(" ")[2];
						config.setMargin(newMargin);
						config.save();
						msg.reply("New margin set at "+ config.getMargin() + " minutes");
					}
			break;
			case "showUsers":
				msg.reply(users.printRecentAuthors());
			break;
			case "banUser":
				let ban_us = msg.content.split(" ")[2]
				let ret = users.banUser(ban_us);
				msg.reply(ret ? "Usuario baneado" : "Error al banear");
			break;
			case "save_cfg":
				config.save();
			break;
			case "help":
				msg.reply(adminHelp());
			break;
			case "setAlertChannel":
				let channel = msg.content.split(" ")[2];
				config.setAlertChannel(channel);
				config.save();
				msg.reply("The new alert channel is: "+ channel);
			break;
			default:
				msg.reply("!admin help for admin commands");
			break;
		}

	}else{
		//If message comes from someone other than admin user discard it

		msg.reply("You are not an admin...");
	}

}
/**
* The functions that will be accesible from bot.js
*/
module.exports = {
	adminActions : function(msg){adminActions(msg);},
	loadConfig : function(){ 
					//config.init();
					if(config.load() === false){
						console.log("No valid configuration file, using default...");
						return false;
					}else{
						
						return true;
					}},
	loadBlacklist : function(){ 
					//config.init();
					if(users.load() === false){
						console.log("No valid blacklist file...");
						return false;
					}else{
						
						return true;
					}},
	config : function(){ return config;},
	users : function(){return users;}
 }