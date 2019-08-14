//Import the js with the variable that has all events (GW2T_CHAIN_DATA)
var chains = require('./chains.js')

var eventList = [];
 
/*The structure of this variable is [event1,event2,...] 
* and each event has these relevant fields:
*  ·Name
*. ·Waypoint
*. .Timing (UTC +0)
* @param {Number} margin How minutes ahead should i look for.
* @return {Array} the upcoming events
*/
function comingEvents(margin){
	//Hour of the day in minutes and utc
	var timeNow = new Date();
	var utcH = timeNow.getUTCHours();
	var utcM = timeNow.getUTCMinutes();
	var utcTimeM = utcH * 60 + utcM;
	var soonEvents = [];

    //Iterate through the parsed events
    for(var event_n in eventList){
    	event = eventList[event_n]

    	//For each time in timing list
    	for(var timing_n in event["Timing"]){
    		timing = event.Timing[timing_n];
    		if(timing == null)
    			continue;

    		//If midnight check
    		if(conflicts(timing["Hour"])){	
				if((adaptToDayChange(margin,timing.Minutes) - utcTimeM) == margin){
    				var upcomingEvent = {"Name":event["Name"],
    									 "Waypoint":event["Waypoint"],
    									 "Time":timing};
    				soonEvents.push(upcomingEvent);
    			}
    		}else{ 
    			//Normal check.
    			if((toMinutes(timing) - utcTimeM) == margin){
    				var upcomingEvent = {"Name":event["Name"],
    									 "Waypoint":event["Waypoint"],
    									 "Time":timing};
    									 soonEvents.push(upcomingEvent);
    			}
    		}
    	}
    }
    return soonEvents;
}
/**
* This function returns ALL events within the margin.
* @param {Number} margin
* @return {Array} list of events
*/
function comingEventsIn(margin){
	//Hour of the day in minutes and utc
	var timeNow = new Date();
	var utcH = timeNow.getUTCHours();
	var utcM = timeNow.getUTCMinutes();
	var utcTimeM = utcH * 60 + utcM;
	var soonEvents = [];

    //Iterate through the parsed events
    for(var event_n in eventList){
    	event = eventList[event_n]

    	//For each time in timing list
    	for(var timing_n in event["Timing"]){
    		timing = event.Timing[timing_n];
    		if(timing == null)
    			continue;
    		//console.log(event);
    		//If midnight check
    		if(conflicts(timing["Hour"])){	
    			var minutes = adaptToDayChange(margin,timing.Minutes) - utcTimeM;
    			if(minutes<0){
    				continue;
    			}
				if(minutes <= margin){
    				var upcomingEvent = {"Name":event["Name"],
    									 "Waypoint":event["Waypoint"],
    									 "Time":timing};
    				soonEvents.push(upcomingEvent);
    			}
    		}else{ 
    			//Normal check.
    			var minutes = toMinutes(timing) - utcTimeM;
    			if(minutes<0){
    				continue;
    			}
    			if(minutes <= margin){
    				var upcomingEvent = {"Name":event["Name"],
    									 "Waypoint":event["Waypoint"],
    									 "Time":timing};
    				soonEvents.push(upcomingEvent);
    			}
    		}
    	}
    }
    return soonEvents;
}


// This function will parse the raw data into a smaller one with the relevant atributes and the hours as ints


// Returns if a value is a string
function isString (value) {
	return typeof value === 'string' || value instanceof String;
}

/**
* This function parses the data in chains.js to be usable, and more compact.
*/
function parseChainData(){
	for(var raw_event_n in chains.GW2T_CHAIN_DATA){
		raw_event = chains.GW2T_CHAIN_DATA[raw_event_n];
		//console.log(raw_event);
		/*if(raw_event["series"] != 2){
			continue;
		}*/
		//Timings as string
		var raw_times = raw_event["timing"];
		var pTimes = [];
		var push = true;
		///console.log();
		if(typeof raw_times[0] === 'undefined'){
			var hIn =raw_times.hourInitial;
			var hMul = raw_times.hourMultiplier;
			var mOff = raw_times.minuteOffset;
			//console.log(raw_event.name_es + raw_event.timing);
			if(mOff == 0)
				mOff = '00';
			var hIter = hIn;
			var times = [];
			while(hIter < 24){

				var time = {"Hour":hIter,"Minutes":mOff};
				//console.log(time);
				times.push(time);
				hIter += hMul;
			}

			var parsed_event = {"Name":raw_event["name_es"],
								"Waypoint":raw_event["waypoint"],
								"Timing":times};
			eventList.push(parsed_event);


		}else{
			//I change them to an object that has hour and minutes, and put them into an array
			for( var raw_time_n in raw_times){
				//console.log(raw_time_n);
				raw_time = raw_times[raw_time_n];
				if(isString(raw_time) == false){
					push = false;
					continue;
				}
				var sTime = raw_time.split(':'); 
				var time = {"Hour":parseInt(sTime[0]),"Minutes":sTime[1]}
				pTimes.push(time);
			}
			//console.log(raw_event);
			//Create the parsed event
			var parsed_event = {"Name":raw_event["name_es"],
								"Waypoint":raw_event["waypoint"],
								"Timing":pTimes};

			//And push it on the event list
			//console.log(parsed_event);
			if(push==true){
				eventList.push(parsed_event);
				//console.log(parsed_event);
			}
		}

    }
}

//This function is just to "make the condition clear"
function conflicts(hour){
	if(hour == 0)
		return true;
}
//If function is close
function adaptToDayChange(margin,minutes){
	if(minutes <= margin)
 		return 24*60 + minutes;
 	else
 		return minutes;
}
function toMinutes(timing){
	//console.log(timing["Hour"]+":"+timing["Minutes"] + " is " );
	var h = parseInt(timing.Hour*60);
	var m = parseInt(timing.Minutes);
	//console.log(h+m);
	return h+m;
}

function mercaderesInfo(){
		var codes = {
				Mehem: ["[&BIsHAAA=]","[&BIcHAAA=]","[&BH8HAAA=]","[&BH4HAAA=]","[&BKsHAAA=]","[&BJQHAAA=]","[&BH8HAAA=]"],
				Fox: ["[&BDoBAAA=]","[&BEwDAAA=]","[&BEgAAAA=]","[&BMIBAAA=]","[&BF0AAAA=]","[&BMMCAAA=]","[&BNMCAAA=]"],
				Derwena: ["[&BC0AAAA=]","[&BKYBAAA=]","[&BBkAAAA=]","[&BKEAAAA=]","[&BIMAAAA=]","[&BNUGAAA=]","[&BJIBAAA=]"],
				Yana: ["[&BP8DAAA=]","[&BNIEAAA=]","[&BKgCAAA=]","[&BP0CAAA=]","[&BO4CAAA=]","[&BJsCAAA=]","[&BBEDAAA=]"],
				Katelyn: ["[&BIUCAAA=]","[&BIMCAAA=]","[&BGQCAAA=]","[&BDgDAAA=]","[&BF0GAAA=]","[&BHsBAAA=]","[&BEICAAA=]"],
				Verma: ["[&BCECAAA=]","[&BA8CAAA=]","[&BIMBAAA=]","[&BPEBAAA=]","[&BOQBAAA=]","[&BNMAAAA=]","[&BBABAAA=]"]
				};

		var date = new Date();
		//console.log(date.getDay())
		var day = date.getDay();
		if(day == 7){
			day=0;
		}
		var vendorString = "Ubicaciones de vendedores del pacto de hoy: "
		for(var vendor in codes){
			vendorString+= vendor + ":" +codes[vendor][day] +", ";
		}
		vendorString = vendorString.substring(0,vendorString.length-2);

		//client.channels.get("607144937938485261").send(vendorString);
		//console.log(vendorString);
		return vendorString;
}
//To make it simpler to init
function init(){
	parseChainData();
}

module.exports = {
	init : function(){init();},
	comingEvents: function(margin){return comingEvents(margin);},
	mercaderesInfo : function(){return mercaderesInfo();},
	comingEventsIn: function(margin){return comingEventsIn(margin);}
};


//parseChainData();
//var aux = comingEventsIn(15);
//console.log(aux);
//console.log(mercaderesInfo());
//console.log(aux);

