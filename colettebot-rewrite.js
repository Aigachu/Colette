/* === Requires === */

// discord.js module
var Discord = require("discord.js");

// twitch module
var TwitchObject = require('./lib/twitch.js');

// filesystem
var fs = require('fs');

// request
var request = require('request');

// moment
var moment = require('moment-timezone');

// nconf -- Configuration Files
var nconf = require('nconf');

/********************************************************************************************/

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


/********************************************************************************************/

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

// Server Configurations
// @todo

// Emotes Initiation
var Emotes = reloadEmotes();

// Login
colette.login("aigabot2@gmail.com", "xu8h7gy@")
  .then(function (token) {
    console.log("wooo!");
  }).catch(function (error) {
    console.log(error);
  });

colette.on("ready", function () {
  console.log("Ready!");
})

/********************************************************************************************/

/* === The Juicy Stuff === */

// Array of all commands.
CommandPrefix = "!";
Commands = [];

Commands[ "ping" ] = {
  oplevel: 0,
  fn: function( bot, params, msg, msgServer ) {

    bot.sendMessage(msg.channel, "New, CLEAN pong. That's right, we're fancy now Aiga.");

  }
}

Commands[ "pong" ] = {
  oplevel: 1,
  fn: function( bot, params, msg, msgServer ) {

    bot.sendMessage(msg.channel, "New, CLEAN ping. That's right, we're fancy now Aiga.");

  }
}

Commands[ "setName" ] = {
  oplevel: 1,
  fn: function( bot, params, msg, msgServer ) {
    if(params[1]) {
      var newName = params[1];
      bot.setUsername(newName).catch(function(err){
        console.log(err);
      });
      bot.sendMessage( msg.channel, "Changing my name!");
    } else {
      bot.sendMessage( msg.channel, "Change it to what?...I can't change it to blank. -_-");
    }
  }
}

Commands[ "setGeneral" ] = {
  oplevel: 1,
  fn: function( bot, params, msg, msgServer ) {
    if(params[1]) {
      GENERAL_CHANNEL = params[1];
      bot.sendMessage( msg.channel, "Gotcha! The general channel has been changed to **" + GENERAL_CHANNEL + "**!");
    } else {
      bot.sendMessage( msg.channel, "Aigaaa...Don't mess with me. That's blank. -_-");
    }
  }
}

Commands[ "joinServer" ] = {
  oplevel: 1,
  fn: function( bot, params, msg, msgServer ) {
    if(params[1]) {
      var resolvable = params[1];
      bot.joinServer(resolvable);

      //@TODO trycatch for error handling.
      bot.sendMessage( msg.channel, "Infiltrating the server. >:3");
    } else {
      bot.sendMessage( msg.channel, "Send me a blank command that needs parameters ONE MORE TIME AIGA I S2G.");
    }
  }
}

Commands[ "setAnn" ] = {
  oplevel: 1,
  fn: function( bot, params, msg, msgServer ) {
    if(params[1]) {
      ANN_CHANNEL = params[1];
      bot.sendMessage( msg.channel, "Gotcha! The announcement channel has been changed to **" + ANN_CHANNEL + "**!");
    } else {
      bot.sendMessage( msg.channel, "Send me a blank command that needs parameters ONE MORE TIME AIGA I S2G.");
    }
  }
}

Commands[ "ann" ] = {
  oplevel: 1,
  fn: function( bot, params, msg, msgServer ) {
    if(params[1]) {
      var twitch_channel = params[1];

      twitch.streamIsOnline(twitch_channel, function( data ) {
        if(data.stream) {
          bot.sendMessage( msg.channel, "Success! That stream is online Aiga! I'll announce it now. :blue_heart:");
          bot.sendMessage( getServerChannel(msgServer, ANN_CHANNEL), "HELLOOOO @everyone !\n\n**" + data.stream_channel + "** is live! Come watch!\n\n" + data.stream_link);
        } else {
          bot.sendMessage( msg.channel, "Welp! That stream is either invalid or offline! Ya messed up.");
        }
      });
    } else {
      bot.sendMessage( msg.channel, "Specify a valid Twitch channel...Or I'll beat the crap out of you Aiga.");
    }
  }
}

Commands[ "autoAnn" ] = {
  oplevel: 1,
  fn: function( bot, params, msg, msgServer ) {
    if(params[1]) {
      var twitch_channel = params[1];

      bot.sendMessage( msg.channel, "I've activated auto announcements for the following stream: **" + twitch_channel + "** !\nThis only works for valid Twitch channels. There will never be an alert if the channel is invalid.\nThe message will be announced once the channel goes live!");

      if(!stream_check_interval_ids[msgServer + twitch_channel]) {
        stream_check_interval_ids[msgServer + twitch_channel] = setInterval(function () {
          twitch.streamIsOnline(twitch_channel, function( data ) {
            if(data.stream) {
              bot.sendMessage( msg.channel, "Oh! **" + twitch_channel + "** went online Aiga! I\'ll announce it now! :) :blue_heart:");
              bot.sendMessage( getServerChannel(msgServer, ANN_CHANNEL), "HELLOOOO @everyone !\n\n**" + data.stream_channel + "** is live! Come watch!\n\n" + data.stream_link);
              clearInterval(stream_check_interval_ids[msgServer + twitch_channel]);
              stream_check_interval_ids[msgServer + twitch_channel] = null;
            } else {
              console.log("Stream checked. Offline...");
            }
          });
        }, 1000 * 5);
      }
    } else {
      bot.sendMessage( msg.channel, "Specify a valid Twitch channel...Or I'll beat the crap out of you Aiga.");
    }
  }
}

Commands[ "deAutoAnn" ] = {
  oplevel: 1,
  fn: function( bot, params, msg, msgServer ) {
    if(params[1]) {
      var twitch_channel = params[1];
      // @todo clear all if no argument
      // if with new message
      clearInterval(stream_check_interval_ids[msgServer + twitch_channel]);
      stream_check_interval_ids[msgServer + twitch_channel] = null;

      colette.sendMessage( msg.channel, "I've deactivated auto announcements for **" + twitch_channel + "**!");
    } else {
      for (var key in stream_check_interval_ids) {
        if (stream_check_interval_ids.hasOwnProperty(key)) {
          clearInterval(stream_check_interval_ids[key]);
          stream_check_interval_ids[key] = null;
        }
      }
      bot.sendMessage( msg.channel, "You didn't specify a channel...So I cleared all of the queued auto announcements. ;)");
    }
  }
}

Commands[ "loadEmotes" ] = {
  oplevel: 1,
  fn: function( bot, params, msg, msgServer ) {
    if(params[1]) {
      var twitch_channel = params[1];
      twitch.getEmotes(twitch_channel, function( data ) {
        for(var key in data) {
          if(data.hasOwnProperty(key)) {
            var obj = data[key];
            for(var prop in obj) {
              if(obj.hasOwnProperty(prop)) {
                var channel_dir = 'resources/emotes/' + twitch_channel;
                if (!fs.existsSync(channel_dir)){
                  fs.mkdirSync(channel_dir);
                }
                download("http://" + obj[prop].substring(2), "resources/emotes/" + twitch_channel + "/" + prop + ".png", function() {
                  console.log('Emote successfully loaded from channel.');
                });
              }
            }
          }
        }
      });

      colette.sendMessage( msg.channel, "Got emotes for **" + twitch_channel + "**! Check the console!");
    } else {
      twitch.getEmotes("global", function( data ) {
        for(var key in data) {
          if (data.hasOwnProperty(key)) {
            var obj = data[key];
            for(var prop in obj) {
              if(obj.hasOwnProperty(prop)) {
                var global_dir = 'resources/emotes/global';
                if (!fs.existsSync(global_dir)){
                  fs.mkdirSync(global_dir);
                }
                download("http://" + obj[prop].url.substring(2), "resources/emotes/global/" + prop + ".png", function() {
                  console.log('Global emotes successfully loaded from channel.');
                });
              }
            }
          }
        }
      });

      bot.sendMessage( msg.channel, "Loaded all of Twitch's global emotes. :)");
    }
  }
}

Commands[ "reloadEmotes" ] = {
  oplevel: 0,
  fn: function( bot, params, msg, msgServer ) {

    Emotes = reloadEmotes();
    bot.sendMessage(msg.channel, "Emotes reloaded!");

  }
}



// Array of all reactions.
Reactions = [];

Reactions[ "colette" ] = {
  oplevel: 1,
  fn: function( bot, msg ) {

    bot.sendMessage(msg.channel, "Hm? You called?");

  }
}

/**
 * === EVENT : Message Creation (Sent)  ===
 */
colette.on("message", function (msg) {
  // Log Messages for DEV purposes
  console.log(msg);

  if(!msg.isPrivate) {
    // Global Variable across message reactions to get the server the message was taken from.
    var msgServer = msg.author.server.name;
  }

  // Commands
  for (var key in Commands) {
    if (Commands.hasOwnProperty(key)) {
      var params = msg.content.split(" ");
      if(params[0] === CommandPrefix + key && msg.author.id !== colette.user.id) {
        // Check op level
        if(Commands[key].oplevel === 1) {
          if(isAdminMessage(msg)) {
            // Run the command's function.
            Commands[key].fn(colette, params, msg, msgServer);
          }
        } else {
          // Run the command's function.
          var params = msg.content.split(" ");
          Commands[key].fn(colette, params, msg, msgServer);
        }
      }
    }
  }

  // Reactions
  // Same as commands, but do not require a prefix (and tend to have cooldowns)
  for (var key in Reactions) {
    if (Reactions.hasOwnProperty(key)) {
      var keygex = new RegExp(key, "i");
      if( keygex.test(msg.content) && msg.author.id !== colette.user.id) {
        // Check op level
        if(Reactions[key].oplevel === 1) {
          if(isAdminMessage(msg)) {
            // Run the command's function.
            Reactions[key].fn(colette, msg);
          }
        }
        else {
          // Run the command's function.
          Reactions[key].fn(colette, msg);
        }
      }
    }
  }

  // Emotes
  for (var key in Emotes) {
    if(Emotes.hasOwnProperty(key)) {
      var keygex = new RegExp(key, "i");
      if( keygex.test(msg.content) && msg.author.id !== colette.user.id) {
        colette.sendFile(msg.channel, Emotes[key], key + ".png");
      }
    }
  }

}); // END REACTIONS TO "message" EVENT

/********************************************************************************************/

/**
 * === EVENT : Message Deletion  ===
 * @todo  Will soon have similar commands to the message events.
 * @todo  Will soon log deleted messages. (THIS IS POLICE AS FUCK.)
 */
colette.on("messageDelete", function (channel, msg) {

  console.log("MESSAGE WAS DELETED BY " + (msg ? msg.author.username : channel.name));

});

/********************************************************************************************/

/**
 * === EVENT : Message Update/Editing  ===
 * @todo  Will soon have similar commands to the message events.
 * @todo  Will soon log edited messages. (THIS IS POLICE AS FUCK.)
 */
colette.on("messageUpdate", function (msg, formerMsg) {

  console.log(msg.author.username, "changed", formerMsg.content, "to", msg.content);

});

/********************************************************************************************/

/**
 * === EVENT : User Addition to Server ===
 * @todo  Will soon send which server it happened on as well.
 */
colette.on("serverNewMember", function (user) {
  console.log("new user", user);

  // PM me about server removals adds.
  pmme("Looks like we have a newcomer in a _certain_ server: **" + user.username + "**");
});

/********************************************************************************************/

/**
 * === EVENT : User Removal from Server ===
 * @todo Will soon send which server it happened on as well.
 */
colette.on("serverRemoveMember", function (user) {
  console.log("left user", user);

  // PM me about server removals.
  pmme("Whoa yikes! The following user was removed from a server: **" + user.username + "**");
});

/********************************************************************************************/

/**
 * === EVENT : User Information Change ===
 */
colette.on("userUpdate", function (oldUser, newUser) {
  console.log(oldUser, "vs", newUser);

  // Send name change information to me in PMs
  if(oldUser.username !== newUser.username) {
    pmme("Name change logged. :) Here's the information:\nUser's ID: **" + oldUser.id + "**\n\nOld Name: **" + oldUser.username + "**\nNew Name: **" + newUser.username + "**\n-------------------------------");
  }

  // Log name change information in files.
  // @TODO
});

/********************************************************************************************/

/**
 * === EVENT : Channel Creation ===
 */
colette.on("channelCreate", function(chann){
  console.log(chann);
})

/********************************************************************************************/

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

// PM admin (aka me)
function pmme(message) {
  // Might be able to change this to a user for the channel resolvable.
  colette.sendMessage(colette.getChannel("id", PM_CHANNEL_ID), message);
}

// Function used to return channels for respective servers.
function getServerChannel(serverName, channelName) {
  return colette.getServer("name", serverName).getChannel("name", channelName);
}

// Utility Function - download
// Downloads file from url

function download(uri, filename, callback) {
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}

// Reload Emotes
function reloadEmotes() {
  var e = [];

  var efolders = fs.readdirSync("resources/emotes");

  for(var key in efolders) {
    var files = fs.readdirSync("resources/emotes/" + efolders[key]) ;
    for(var i in files) {
      e[files[i].slice(0, -4)] = "resources/emotes/" + efolders[key] + "/" + files[i];
    }
  }

  console.log("Emotes reloaded.");

  return e;
}
