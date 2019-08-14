const fs = require('fs');

var recentAuthors = {};
var bannedUsers = {};
var uFilePath = "../persistent_data/blacklist.json";
var blacklistS =  require(uFilePath);

function addAuthorToList(author){
	if(!(author.id in recentAuthors)){
		recentAuthors[author.id] = author.username;
	}
}

function printRecentAuthors(){
	var string = "Users who recently wrote the bot:\n";
	for(var i in recentAuthors){
		string+= "\t" + i + " " + recentAuthors[i] +"\n";
	}
	return string;
}

function banUser(id){
	if(!(id in bannedUsers)){
		bannedUsers[id] = recentAuthors[id];
		saveBlacklist();
		return true;
	}
	else{
		return false;
	}
}

function saveBlacklist(){
	fs.writeFile('./persistent_data/blacklist.json', JSON.stringify(bannedUsers), function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("Saved blacklist");
	}); 
	return;
}

function loadBlacklist(){
	bannedUsers = blacklistS;
	//console.log("\tLoaded user blacklist\n");
	
	return true;
	
}

//loadBlacklist();

function isValidUser(user){
	if(user.id in bannedUsers){
		return false;
	}else{
		addAuthorToList(user);
		return true;
	}
}

module.exports = {
	isValidUser : function(user){return isValidUser(user);},
	printRecentAuthors : function(){return printRecentAuthors();},
	banUser : function(id){return banUser(id);},
	load : function(){return loadBlacklist();}
}

