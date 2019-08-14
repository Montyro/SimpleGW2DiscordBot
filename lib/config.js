
const fs = require('fs');
var cFilePath = '../persistent_data/config.json';
var config_file = require(cFilePath);
var config = {}
/**
* This variable is used as a placeholder in case there is no config to load, or if you corrupted your
* config. 
*/
var default_config = {
	adminId : "your_discord_id_here",
	botId : "your_bot_id_here",
	autoalerts : false,
	timeOffset : 2,
	margin : 10,
	alertChannel : "your_channel_id_here",
}



/**
* This function loads the JSON string with the config and parses it and applies it to 
* the configuration variable.
*/
function load_config(){
    	config = config_file;
    	if(config == {}){
			config = default_config;
			return false;
    	}
    	return true;

}

/**
* This function is used to write the configuration file.
*/
function save_config(){
	fs.writeFile('./persistent_data/config.json', JSON.stringify(config), function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    //console.log("Configuration was saved");
	}); 
	//console.log(config);
	return;
}


/**
* List of variables and functions accesible from other files.
*/
module.exports = {
	//Getters
	getAdminId : function(){return config.adminId;},
	getBotId : function(){return config.botId;},
	getAutoalerts : function(){return config.autoalerts;},
	getTimeOffset : function(){return config.timeOffset;},
	getMargin : function(){return config.margin;},
	getConfig : function(){return config;},
	getAlertChannel : function(){return config.alertChannel;},
	//Setters
	setAutoalerts : function(bool){config.autoalerts = bool;},
	setMargin : function(int){config.margin = parseInt(int);},
	setTimeOffset : function(int){config.timeOffset = parseInt(int);},
	setAlertChannel : function (string){config.alertChannel =  string;},
	//Methods
	save : function(){save_config();},
	load : function(){return load_config();},
	//setMargin : function(margin){setMargin(parseInt(margin));},
	init : function(){init();},
	//setAutoalerts : function(bool){setAutoalerts(bool);}

}
