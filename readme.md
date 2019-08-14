![GW2_logo](https://i.imgur.com/N0lFn7f.jpg)

# Simple Guild Wars 2 Discord Bot

## What it can do:

**Send a message when a relevant event starts, if alerts are turned on.**

	It does not send a message for:
		- Crazed monsters, for these are random.
		- DryTop, for those happen everyhour and you only need to know at XX:00 starts, at XX:40 storm.
	
**Answer these petitions:**

	!info, !help or !ayuda (for help)
	!pact and !pactvendor (for the pact agent vendor locations)
	!event and !event X (to get the upcoming events in 15/X minutes)

**Also has some admin commands like:**

	!admin banUser userid -  to ban users
	!admin showUser - to list the users that have messaged the bot while uptime.
	Some setters for configuration variables.
	Commands to activate and deactivate autoalerts.
	Use !admin help for the bot to list them.


## How to set up:

### Prerequisites:

   - Node installed on your machine.
   - Set up an application for your bot discord from here https://discordapp.com/developers/applications/ or look for a tutorial online.

### Installation instructions:

1. Clone this repo on the machine you want this bot to run.

2. Set up the configuration files:

	Must change or the bot will malfunction:

		In both config.json and config.js: 

			· adminId to your discordId 

			· botId to your bot id.

	Only needed if you want autoalerts:

		In both config.json and config.js:

			· alertsChannel to the id of the channel you want the autoalerts at.

3. Get your bot authentication token and put it on auth.json (otherwise it wont log in)

4. Install discord.js with 

	>npm install discord.js

5. Run the bot with: 

 	> node bot.js

**These steps only if you want autoalerts**

6. First, add your bot to the discord server where the channel you want your autoalerts is.

7. If you have not done the setup for autoalerts on step 2, do it now.

8. Either set the config.json autoalerts attribute to true, and then launch the bot, or launch the bot and make !admin alerts on

9. If you want to change the amount of time the bot has to message before the event comes, do !admin margin _int_ to change it.

 **Note:** If you set autoalerts to on but you have set no channelId the bot will crash when he should have sent a message to a channel. 


#### Final notes:

I built this bot for my guild, and as i'm the one who will run it, i expect myself not to break it, but there are some commands where i have not set up a proper error control.

Also, i got bored a bit at this bot after i realized discord supports no tables on markdown (had some ideas with GW2API and black market...) so i don't expect myself to implement the error control or new functionalities anytime soon.

Also, credits to _gw2timer.com_, which is where i took the chains.js from and saved me a lot of time of typing events info.
