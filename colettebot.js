/* === Requires === */

// discord.js module
var Discord = require("discord.js");

// twitch module
var TwitchObject = require('./lib/twitch.js');

// filesystem
var fs = require('fs');

// nconf -- Configuration Files
var nconf = require('nconf');

/*************************************************************/

/* === Configurations === */

// discord.js
// Uses the discord.js module made by hydrabolt.
// This instantiates a Discord Client that the bot uses.
// @TODO - FUNCTIONS DOCUMENTATION

// var Auth = require("./auth.json"); // @TODO JSON STORAGE 
var colette = new Discord.Client();

// Twitch
// Access to twitch module & functions found in twitch.js
// Comment if you aren't using twitch functionality.
// @TODO - FUNCTIONS DOCUMENTATION

/*
  Twitch Application Client ID
  Must be generated using a Twitch account.
  Go to your account settings and click on the "Connections" tab.
  At the very bottom, click on "Register an application".
 */
var twitch_id = 'tn2tqa6lnu7gj3pl5h680dc40sbv5r2';

// Instantiate Twitch Object

var twitch = new TwitchObject(twitch_id);


/*************************************************************/

/* === Variables === */

// Define Interval Array Variable
var stream_check_interval_ids = [];

// Admin account to restrict Bot commands!
// There are ways to get this ID ;)
var ADMIN_ID = '77517077325287424'; // My account ID <3
var PM_CHANNEL_ID = '83297162842079232'; // My pm channel ID so colette can PM me <3

// Twitch Announcement Channel
var ANN_CHANNEL = 'announcements';

// General Channel
var GENERAL_CHANNEL = 'general';

// Notifications
var notify_mentions = true;

/* === Configurations === */
// @todo replace variables when this is complete.

// Attempt to load configuration file.
// If it fails, set default configurations and create configuration file.
var configs;

// try {
//   var data = fs.readFileSync('configurations/config.json');
// } catch (err) {
//   // console.log(err);
//   console.log("Configuration file not found. Creating...");
// }

// try {
//   configs = JSON.parse(data);
//   console.log(configs);
// }
// catch (err) {
//   console.log('There has been an error parsing your JSON.')
//   console.log(err);
// }

// Command/Reactions Cooldowns
var cooldowns = [];

/*************************************************************/

/* === The Good Stuff === */

// REACTIONS TO "message" EVENT
// "message" IS TRIGGERED WHEN USERS SEND A MESSAGE.
colette.on("message", function (msg) {

  // Log Messages for DEV purposes
  console.log(msg);

  // /* == Admin Only Reactions == */
  if(isAdminMessage(msg)) {
    // ping command
    // Checking her pulse. :3
    if( msg.content === "ping") {
      pmAdmin("I'm alive. Don't worry. ;) :blue_heart:");
    }

    // Yelling at Colette
    if( msg.content === "COLETTE") {
      colette.sendMessage(msg.channel, "AIGA");
    }

    // Dissing me.
    if( msg.content === "Hey guys.") {
      var answers = new Array(
        "Hey Aiga!",
        "Ew. o_o Go away Aiga\n\n\njk lol",
        "_slaps aiga_"
      );

      colette.sendMessage(msg.channel.id, answers[Math.floor((Math.random() * answers.length))]);
    }

    // Notify Mentions Activator/Deactivator
    if( msg.content === "!aNM") {
      notify_mentions = true;
      colette.sendMessage(msg.channel, "Gotcha.");
    }

    if( msg.content === "!dNM") {
      notify_mentions = false;
      colette.sendMessage(msg.channel, "Done!");
    }

    // !setName command
    // Changes the bot's name to the given text.
    if( msg.content.substring(0, '!setName'.length) == '!setName' ) {
      var newName = msg.content.replace("!setName ", "");
      colette.setUsername(newName).catch(function(err){
        console.log(err);
      });
      colette.sendMessage( msg.channel, "Aww but I liked my name...Fiiine.");
    }

    // !setGeneral
    // Changes general channel.
    // Could have some use. :)
    if( msg.content.substring(0, '!setGeneral'.length) == '!setGeneral' ) {
      GENERAL_CHANNEL = msg.content.replace("!setGeneral ", "");
      colette.sendMessage( msg.channel, "Gotcha! The general channel has been changed to **" + GENERAL_CHANNEL + "**!");
    }

    /*************************************************************/

    /* === Twitch Announcements === */

    // !setAnn command.
    // Accepts 1 argument sets which channel the announcement should be posted to.
    if( msg.content.substring(0, '!setAnn'.length) == '!setAnn' ) {
      ANN_CHANNEL = msg.content.replace("!setAnn ", "");
      colette.sendMessage( msg.channel, "Gotcha! The announcement channel has been changed to **" + ANN_CHANNEL + "**!");
    }

    // !ann command.
    // Accepts 1 argument and checks if the channel is live.
    if( msg.content.substring(0, '!ann'.length) == '!ann' ) {

      console.log(msg.channel.server.channels);

      var twitch_channel = msg.content.replace("!ann ", "");

      twitch.streamIsOnline(twitch_channel, function( data ) {
        if(data.stream) {
          colette.sendMessage( msg.channel, "Success! That stream is online Aiga! I'll announce it now. :blue_heart:");
          colette.sendMessage( colette.getChannel("name", ANN_CHANNEL), "HELLOOOO @everyone !\n\n**" + data.stream_channel + "** is live! Come watch!\n\n" + data.stream_link);
        } else {
          colette.sendMessage( msg.channel, "Sorry Aiga! That stream is either invalid or offline!");
        }
      });
    }

    // // !autoAnnOn command.
    // Twitch Stream Interval Check - Activate
    if( msg.content.substring(0, '!autoAnnOn'.length) == '!autoAnnOn' ) {
      var twitch_channel = msg.content.replace("!autoAnnOn ", "");

      colette.sendMessage( msg.channel, "I've activated auto announcements for the following stream: **" + twitch_channel + "** !\nThis only works for valid Twitch channels. There will never be an alert if the channel is invalid.\nThe message will be announced once the channel goes live!");

      stream_check_interval_ids[twitch_channel] = setInterval(function () {
        twitch.streamIsOnline(twitch_channel, function( data ) {
          if(data.stream) {
            colette.sendMessage( msg.channel, "Oh! **" + twitch_channel + "** went online Aiga! I\'ll announce it now! :) :blue_heart:");
            colette.sendMessage( colette.getChannel("name", ANN_CHANNEL), "HELLOOOO @everyone !\n\n**" + data.stream_channel + "** is live! Come watch!\n\n" + data.stream_link);
            clearInterval(stream_check_interval_ids[twitch_channel]);
          } else {
            console.log("Stream checked. Offline...");
          }
        });
      }, 1000 * 5);
    } // END Twitch Stream Interval Check - Activate
    
    // !autoAnnOff
    // Twitch Stream Interval Check - Manual Deactivation
    if( msg.content.substring(0, '!autoAnnOff'.length) == '!autoAnnOff' ) {
      var twitch_channel = msg.content.replace("!autoAnnOff ", "");
      // @todo clear all if no argument
      // if with new message
      clearInterval(stream_check_interval_ids[twitch_channel]);

      colette.sendMessage( msg.channel, "I've deactivated auto announcements for **" + twitch_channel + "**!");
    
    } // END Twitch Stream Interval Check - Manual Deactivation

    /* === END Twitch Announcements === */

    /*************************************************************/

  } /* == END Admin Only Commands == */

  if( /Aiga/i.test(msg.content) && msg.author.id !== colette.user.id ) {
    if(notify_mentions == true) {
      pmAdmin("Looks like " + msg.author.username + " from the **" + msg.channel.server.name + "** server mentioned you. Here's the message:\n\n_'" + msg.content + "'_");
    }

    // Write to a log
  }

  // Response to PMs
  // Currently a bug when INITIATING a PM channel. 
  // Will be fixed in the future.
  // if(msg.isPrivate && msg.author != colette.user  ) {
  //   cooldowns['isPrivate'] = true;

  //   colette.sendMessage(msg.channel.id, "Hi! I understand that you wish to speak with me but...I'm a bot. :( This is all I can say!\n I'll message Aiga for you though. :3");
  //   pmAdmin("Hey! " + msg.author.username + " messaged me...I think they're trying to flirt with me! :S");
  // }

  // Funny message when I'm tagged
  if(msg.isMentioned('77517077325287424')) {
    // @TODO Will add different answers depending on the time of day.
    if(!cooldowns['isMentioned']) {
      var answers = new Array(
        "I call upon the envoy of the shadow realm. I summon thee...come, Aigachu!",
        "Eww. We don't need Aigachu. >_>",
        "Ouuuh you called him! He just might show up now...",
        "Trying to summon Aiga are we? Let me help.\n\nHEY AIGA YOU GOD DAMN SWINE CMERE."
      );

      colette.sendMessage(msg.channel.id, answers[Math.floor((Math.random() * answers.length))]);

      cooldowns['isMentioned'] = true;
      setTimeout(function(){ cooldowns['isMentioned'] = false }, 1000 * 60 * 3);
    }
  }

}); // END REACTIONS TO "message" EVENT


// Event when messages are DELETED.
// Will soon have similar commands to the message events.
// Will soon log deleted messages. (THIS IS POLICE AS FUCK.)
colette.on("messageDelete", function (channel, msg) {

  console.log("MESSAGE WAS DELETED BY " + (msg ? msg.author.username : channel.name));

});

// Event when messages are UPDATED/EDITED.
// Will soon have similar commands to the message events.
// Will soon log edited messages. (THIS IS POLICE AS FUCK.)
colette.on("messageUpdate", function (msg, formerMsg) {

  console.log(msg.author.username, "changed", formerMsg.content, "to", msg.content);

});

// Event when users are added to servers.
colette.on("serverNewMember", function (user) {
  console.log("new user", user);

  // PM me about server removals adds.
  // Will soon send which server it happened on as well.
  pmAdmin("Looks like we have a newcomer in a _certain_ server: **" + user.username + "**");
});

// Event when users are removed from servers.
colette.on("serverRemoveMember", function (user) {
  console.log("left user", user);

  // PM me about server removals.
  // Will soon send which server it happened on as well.
  pmAdmin("Whoa yikes! The following user was removed from a server: **" + user.username + "**");
});

// User information change event.
colette.on("userUpdate", function (oldUser, newUser) {
  console.log(oldUser, "vs", newUser);

  // Send name change information to me in PMs
  pmAdmin("Name change logged. :) Here's the information:\nUser's ID: **" + oldUser.id + "**\n\nOld Name: **" + oldUser.username + "**\nNew Name: **" + newUser.username + "**\n-------------------------------");

  // Log name change information in files.
  // @TODO
});

colette.on("channelCreate", function(chann){
  console.log(chann);
})


// Login
colette.login("aigabot.sama@gmail.com", "xu8h7gy@")
  .then(function (token) {
    console.log("wooo!");
  }).catch(function (error) {
    console.log(error);
  });

colette.on("ready", function () {
  console.log("Ready!");
})


/*************************************************************/

/* === Useful Functions === */

// Check invoker. If it's you, roll the command.
// @TODO - ROLE HANDLING INSTEAD OF ACCOUNT ID
function isAdminMessage(message) {
  var author_id = message.author.id;
  if(author_id == ADMIN_ID) {
    return true;
  } else {
    return false;
  }
}

function pmAdmin(message) {
  colette.sendMessage(colette.getChannel("id", PM_CHANNEL_ID), message);
}