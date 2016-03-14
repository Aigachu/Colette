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


/**
 * discord.js
 * Uses the discord.js module made by hydrabolt.
 * @DOCU: https://discordjs.readthedocs.org/en/latest/
 */

// This instantiates a Discord Client that the bot uses.
var colette = new Discord.Client();

// Authentication JSON
var auth = JSON.parse(fs.readFileSync("./auth.json", "utf8"))

/**
 * Twitch API
 * Access to twitch module & functions found in twitch.js
 * Comment if you aren't using twitch functionality.
 * @todo : DOCUMENTATION
 */

/*
  Twitch Application Client ID
  Must be generated using a Twitch account.
  Go to your account settings and click on the "Connections" tab.
  At the very bottom, click on "Register an application".
 */
var twitch_id = auth.twitch_id;

// Instantiate Twitch Object
var twitch = new TwitchObject(twitch_id);


/********************************************************************************************/

/* === Configurations === */
// @todo

// Login
colette.login(auth.email, auth.pass)
  .then(function (token) {
    console.log("Initating cuteness...");
  }).catch(function (error) {
    console.log(error);
  });

colette.on("ready", function () {
  console.log("Jack in! Colette! Execute!");
})

// Admin account to restrict Bot commands!
// There are ways to get this ID ;)
var GOD_ID = '77517077325287424'; // My account ID <3

/* == ADMINS == */

var ADMINS = [
  "77577477425201152", // Dango
  "90171294200365056", // Zero Bot Samus
  "82938251760898048", // Mushbot
  "70634471967162368", // Zeke
];

/********************************************************************************************/

/* === The Juicy Stuff === */

/* === Variables === */

/* == Server Variables  == */
// AIGA'S HAVEN
var AIGA_HAVEN = '150507471155232768';

// COLETTE NAME CHANGE CHANNEL
var AIGA_NC = '150507852182585344';

// COLETTE MENTIONS CHANNEL
var AIGA_MENTIONS = '150507889310564352';

// COLETTE NEWCOMERS CHANNEL
var AIGA_NEWCOMERS = '150507947816910848';

// COLETTE REMOVALS CHANNEL
var AIGA_REMOVALS = '150507988468105216';

// ANOTHER WORLD
// COLETTE TEST CHANNEL
var AWORLD_COLETTE = '103228407290003456';

// NAIFUS
var NAIFU_SERVER = '82343511336157184';
// BOTBURGHAL CHANNEL
var NAIFU_BOT_BURGHAL = '83017907335860224';
// LOVELOUNGE CHANNEL
var NAIFU_LOVE_LOUNGE = '137044760941559809';

// ONETTBOYZ
// BOTFACILITY CHANNEL
var ONETT_BOT_FACILITY = '83224528322297856';


// Define Interval Array Variable
var stream_check_interval_ids = [];

// Default Announcement Channel
var ANN_CHANNEL = 'announcements';

// Default General Channel
var GENERAL_CHANNEL = 'general';

// Command/Reactions Cooldowns
var COOLDOWNS = [];

// Chat Timeouts
var timeouts = {};
var timeoutCounts = {};
var msg_c = []; // user message cache
var msg_cc = []; // message cache clear variable. holds timeout
var spam_c = []; // spam message cache
var spam_cc = []; // spam cache clear variable. holds timeout
var qspam_c = []; // quickspam message cache
var qspam_cc = []; // quickspam cache clear variable. holds timeout

// Emotes Initiation
var Emotes = reloadEmotes(); // Initiates emotes array with all emotes folders currently present.
var EmotesOn = false; // Will be used to manage toggling the emotes feature. Disabled by default.
var EmotesAllowedServers = []; // @todo Will be used to manage which servers have access to this feature.

/* == Features == */

// Notifications Enabling
var notify_mentions = true;

// Auto Timeouts Enabling
var auto_time = true; // Enabled by default


/* ***************************************|||||||||||||||||||||*************************************************** */
/* *************************************** COMMANDS, REACTIONS *************************************************** */
/* ***************************************|||||||||||||||||||||*************************************************** */

/**
 * COMMANDS ARRAY
 * Holds COMMANDS objects.
 * Defines actions taken when certain commands are called in chat.
 * @type {Array}
 */
var Commands = [];

var CommandPrefix = "!"; // The prefix for all commands!

/**
 * Commands Description
 * -- oplevel: The restriction of who can use the command.
 *  - 0 -> Anyone can use the command.
 *  - 1 -> Only ADMINS can use the command. (All user IDs in the ADMINS array above)
 *  - 2 -> Only the GOD can use the command. (The GOD ID in the variable above)
 *
 * -- allowed_channels: Channels in which the command works.
 *  - 'all' -> Will work in all channels.
 *  - [CHANNEL_ID_1, CHANNEL_ID_2, ...] -> Array of all channel IDs where the command will work.
 *
 * -- allowed_servers: Servers in which the command works.
 *  - 'all' -> Will work in all servers.
 *  - [SERVER_ID_1, SERVER_ID_2, ...] -> Array of all server IDs where the command will work.
 *
 * -- cooldown: Cooldown time of the command (in seconds)
 *  - 20 -> 20 seconds.
 *  - 40 -> 40 seconds.
 *    - Any number here works.
 *
 * -- fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
 *      // Your code for the command goes here.
 *    }
 *  - bot -> Bot object to use for bot actions.
 *  - params -> Command parameter array.
 *    - If the command is  "!test 5 peach 8" ...
 *    - params[1] = 5,
 *    - params[2] = peach,
 *    - params[3] = 8.
 *   - msg -> Message object of the invoked message that triggered the command.
 *   - msgServer -> Server that the message arrived from.
 *   - serverRoles -> All roles of the server that the command was invoked from in an array.
 *   - authorRoles -> All roles of the author that invoked the command.
 */

Commands[ "ping" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    pmme("New, CLEAN pong. That's right, we're fancy now Aiga.");

  }
}

Commands[ "pong" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    bot.sendMessage(msg.channel, "New, CLEAN ping. That's right, we're fancy now Aiga.");

  }
}

Commands[ "gcid" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    // @TODO - Accept one parameter, which is the channel link with #.
    // No rush for this tbh.
    bot.deleteMessage(msg);
    bot.sendMessage(bot.users.get("id", msg.author.id), "Psst! Here's the id of the **" + msg.channel + "** channel:\n\n**" + msg.channel.id + "**");
  }
}

Commands[ "gsid" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    bot.deleteMessage(msg);
    bot.sendMessage(bot.users.get("id", msg.author.id), "Psst! Here's the id of the server: **" + msg.channel.server.id + "**");
  }
}

Commands[ "guid" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    if(params[1]) {
      var userID = params[1].slice(2, -1);
      var user = bot.users.get("id", userID);
      bot.deleteMessage(msg);
      bot.sendMessage(bot.users.get("id", msg.author.id), "Psst! Here's the id of the following user: **" + user.username + "**\n\n**" + userID + "**");
    } else {
      bot.sendMessage(bot.users.get("id", msg.author.id), "Heyyy...Ya done messed up mang. Add a parameter to the command. >.>");
    }
  }
}

Commands[ "setName" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    if(params[1]) {
      var newName = msg.content.substring(params[0].length, msg.content.length);
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
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    if(params[1]) {
      GENERAL_CHANNEL = params[1];
      bot.sendMessage( msg.channel, "Gotcha! The general channel has been changed to **" + GENERAL_CHANNEL + "**!");
    } else {
      bot.sendMessage( msg.channel, "Aigaaa...Don't mess with me. That's blank. -_-");
    }
  }
}

Commands[ "joinServer" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
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
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
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
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
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
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
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
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
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

Commands[ "loadEmo" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
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

Commands[ "initEmo" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    Emotes = reloadEmotes();
    bot.sendMessage(msg.channel, "Emotes reloaded!");

  }
}

Commands[ "enEmo" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    EmotesOn = true;
    bot.sendMessage(msg.channel, "Activated twitch emotes! ");

  }
}

Commands[ "deEmo" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    EmotesOn = false;
    bot.sendMessage(msg.channel, "Deactivated twitch emotes.");

  }
}

Commands[ "timeout" ] = {
  oplevel: 1,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    if(params[3]) {
      bot.sendMessage( bot.users.get("id", msg.author.id), "Psst...You might have messed up somewhere with the command...\n\nThe **!timeout** command only accepts 2 arguments. Tag the user you want to time out, and then the number of seconds!\n\nExample: `!timeout @Colette 10`");
    } else {
      colette.deleteMessage(msg);
      var culprit = params[1].slice(2, -1);
      var duration = params[2];

      bot.addMemberToRole(bot.users.get("id", culprit), serverRoles['Timeout'], function(error){
        bot.sendMessage(msg.channel, "Timed out <@" + culprit + "> ! RIP.");
      });

      // If cache exists clear last messages
      if(msg_c[culprit] != null) {
        var d = msg_c[culprit].slice(Math.max(msg_c[culprit].length - 10, 1));

        // delete spam
        for(var key in d) {
          colette.deleteMessage(d[key]);
        }
      }

      setTimeout(function(){
        bot.removeMemberFromRole(bot.users.get("id", culprit), serverRoles['Timeout']);
      }, 1000 * duration);
    }
  }
}

// Must finish this command by adding a more persistent cache.
// Messages are not getting deleted.
// ONLY PURGES CACHE MESSAGES
Commands[ "purge" ] = {
  oplevel: 1,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    if(params[3]) {
      bot.sendMessage( colette.users.get("id", msg.author.id), "Psst...You might have messed up somewhere with the command...\n\nThe **!purge** command only accepts 2 arguments. Tag the user you want to time out, and then the number of messages!\n\nExample: `!timeout @Colette 10`");
    } else {
      colette.deleteMessage(msg);
      var culprit = params[1];
      var n = params[2];

      // If cache exists clear last messages
      if(msg_c[culprit] != null) {
        var d = msg_c[culprit].slice(Math.max(msg_c[culprit].length - n, 1));

        // delete spam
        for(var key in d) {
          colette.deleteMessage(d[key]);
        }
      }
    }
  }
}

Commands[ "enTo" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    auto_time = true;
    bot.sendMessage(msg.channel, "Turning on automatic timeouts...Time to purge! :fist:");

  }
}

Commands[ "deTo" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    auto_time = false;
    bot.sendMessage(msg.channel, "Turning off automatic timeouts...:(");

  }
}

Commands[ "rolldice" ] = {
  oplevel: 0,
  allowed_channels: [NAIFU_LOVE_LOUNGE],
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 8,
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var roll = Math.floor(Math.random() * 6) + 1;

    var roll_types = [];
    roll_types.push({
      message: "_rolls the die normally_",
      timeout: 1
    });
    roll_types.push({
      message: "_rolls the die violently_\n_the die falls on the ground_",
      timeout: 2
    });
    roll_types.push({
      message: "_accidentally drops the die on the ground while getting ready_\nOops! Still counts right...?",
      timeout: 2
    });
    roll_types.push({
      message: "_spins the die_\nWait for it...",
      timeout: 5
    });

    var rand = roll_types[Math.floor(Math.random() * roll_types.length)];

    bot.sendMessage(msg.channel, rand.message);
    bot.startTyping(msg.channel);

    setTimeout(function(){
      bot.sendMessage(msg.channel, "<@" + msg.author.id + "> rolled a **" + roll + "** !");
      bot.stopTyping(msg.channel);
    }, 1000 * rand.timeout);
  }
}

Commands[ "coinflip" ] = {
  oplevel: 0,
  allowed_channels: [NAIFU_LOVE_LOUNGE],
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 5,
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var flip = Math.floor(Math.random() * 2) + 1;

    flip = ((flip == 1) ? 'Heads' : 'Tails');

    var flip_types = [];
    flip_types.push({
      message: "_accidentally drops the coin on the ground_\n\nOops! ;~; Still counts right?",
      timeout: 2
    });
    flip_types.push({
      message: "_flips the coin normally_",
      timeout: 1
    });
    flip_types.push({
      message: "_spins the coin_\nWait for it...",
      timeout: 5
    });

    var rand = flip_types[Math.floor(Math.random() * flip_types.length)];

    bot.sendMessage(msg.channel, rand.message);
    bot.startTyping(msg.channel);

    setTimeout(function(){
      bot.sendMessage(msg.channel, "<@" + msg.author.id + "> got **" + flip + "** !");
      bot.stopTyping(msg.channel);
    }, 1000 * rand.timeout);
  }
}

Commands[ "love" ] = {
  oplevel: 0,
  allowed_channels: [NAIFU_LOVE_LOUNGE],
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 8,
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    if(params[1]) {
      var thing = msg.content.slice(6);
      bot.sendMessage( msg.channel, "There is __**" + Math.floor(Math.random() * 100) + "%**__ love between <@" + msg.author.id + "> and **" + thing + "**!" );
    } else {
      bot.sendMessage( msg.channel, "You have 100% for ZeRo & M2K's AS5 if you don't specify an object or person!\n\n_Make sure you put an argument! `!love cheese`_");
    }
  }
}

Commands[ "8ball" ] = {
  oplevel: 0,
  allowed_channels: [NAIFU_LOVE_LOUNGE],
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 8,
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    if(params[1]) {
      var answers = [];

      answers.push({
        message: "8ball says: \"_It is certain._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_It is decidedly so._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Without a doubt._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_Yes, definitely._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_You may rely on it._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_As I see it, yes._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_Most likely._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Outlook good._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Yes._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Signs point to yes._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Reply hazy try again._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Ask again later._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Better not tell you now._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_Cannot predict now._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Concentrate and ask again._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Don't count on it._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_My reply is no._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_My sources say no._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Very doubtful._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Outlook not so good._\"",
        timeout: 2
      });

      var rand = answers[Math.floor(Math.random() * answers.length)];

      bot.startTyping(msg.channel);

      setTimeout(function(){
        bot.sendMessage(msg.channel, "<@" + msg.author.id + "> " + rand.message);
        bot.stopTyping(msg.channel);
      }, 1000 * rand.timeout);
    } else {
      bot.sendMessage( msg.channel, "8ball says: \"_Now now, ask me something. Don't be shy._\"");
    }
  }
}

Commands[ "seppuku" ] = {
  oplevel: 0,
  allowed_channels: [NAIFU_LOVE_LOUNGE],
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 5,
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    bot.addMemberToRole(bot.users.get("id", msg.author.id), serverRoles['Timeout'], function(error){
      bot.sendMessage(msg.channel, "_<@" + msg.author.id + "> commited sudoku! Byebye. :P_");
    });

    // delete messages and KILL THE
    if(msg_c[msg.author.id] != null) {
      var d = msg_c[msg.author.id].slice(Math.max(msg_c[msg.author.id].length - 10, 1));

      // delete spam
      for(var key in d) {
        colette.deleteMessage(d[key]);
      }
    }

    setTimeout(function(){
      bot.removeMemberFromRole(bot.users.get("id", msg.author.id), serverRoles['Timeout']);
    }, 5000);
  }
}

Commands[ "roulette" ] = {
  oplevel: 0,
  allowed_channels: [NAIFU_LOVE_LOUNGE],
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 8,
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    bot.sendMessage(msg.channel, '_Colette grabs a random gun..._\nReady?');
    bot.startTyping(msg.channel);
    setTimeout(function(){
      bot.sendMessage(msg.channel, '_Colette spins the cylinder..._');

      var survival = false;

      setTimeout(function(){
        if(Math.random() < 0.40) { // 40% Chance of this happening!
          if(Math.random() < 0.50) {
            survival = true;
          }

          bot.sendMessage(msg.channel, '_Colette points the gun at <@' + msg.author.id + '>\'s head..._\n');
          setTimeout(function(){
            bot.sendMessage(msg.channel, '_Colette pulls the trigger!_');
            setTimeout(function(){
              if(survival) {
                bot.sendMessage(msg.channel, "_click_...Yay! You **SURVIVED** <@" + msg.author.id + ">! :D_");
              } else {
                bot.addMemberToRole(bot.users.get("id", msg.author.id), serverRoles['Timeout'], function(error){
                  bot.sendMessage(msg.channel, "_BANG!_\n\n_Oh no. How unfortunate, you **DIED** <@" + msg.author.id + ">. You will be remembered. ;~;_");
                });
                setTimeout(function(){
                  bot.removeMemberFromRole(bot.users.get("id", msg.author.id), serverRoles['Timeout']);
                }, 10000);
              }
            }, 1000);
          }, 2000);
        }
        else if(Math.random() < 0.70) { // 30% Chance of this happening!
          if(Math.random() < 0.50) {
            survival = true;
          }

          bot.sendMessage(msg.channel, '_Colette pulls the trigger without a second thought..._\n');
          setTimeout(function(){
            if(survival) {
              bot.sendMessage(msg.channel, "POW!...Just kidding! You **SURVIVED** <@" + msg.author.id + ">! :D_");
            } else {
              bot.addMemberToRole(bot.users.get("id", msg.author.id), serverRoles['Timeout'], function(error){
                bot.sendMessage(msg.channel, "_BANG!_\n\n_That was actually the gun. You're **DEAD**, <@" + msg.author.id + ">. Rest in pepperoni~_");
              });
              setTimeout(function(){
                  bot.removeMemberFromRole(bot.users.get("id", msg.author.id), serverRoles['Timeout']);
              }, 10000);
            }
          }, 1000);
        }
        else if(Math.random() < 0.90) { // 20% Chance of this happening!
          if(Math.random() < 0.50) {
            survival = true;
          }

          bot.sendMessage(msg.channel, '_Colette trips and falls on the ground._');
          setTimeout(function(){
            bot.sendMessage(msg.channel, '_The gun magically comes to life and it pulls its own trigger, aiming directly at you!_');
            setTimeout(function(){
              if(survival) {
                bot.sendMessage(msg.channel, "_Phew! You swiftly dodged the bullet and **SURVIVED** <@" + msg.author.id + ">! The gun glares at you and disappears._");
              } else {
                bot.addMemberToRole(bot.users.get("id", msg.author.id), serverRoles['Timeout'], function(error){
                  bot.sendMessage(msg.channel, "Ow...O-oh no! **YOU GOT DUNKED ON** <@" + msg.author.id + "> !\n\n_The gun laughs and disappears into the darkness._");
                });
                setTimeout(function(){
                  bot.removeMemberFromRole(bot.users.get("id", msg.author.id), serverRoles['Timeout']);
                }, 10000);
              }
            }, 2000);
          }, 1000);
        }
        else { // 10% Chance of this happening!
          if(Math.random() < 0.50) {
            survival = true;
          }

          bot.sendMessage(msg.channel, '_Colette puts down the gun and casts Judgement._');
          setTimeout(function(){
            bot.sendMessage(msg.channel, '_Rays of light descend all over the server!_');
            bot.sendFile(msg.channel, 'resources/images/holy_judgement.png', 'holy_judgement.png');
            setTimeout(function(){
              if(survival) {
                bot.sendMessage(msg.channel, "Oh phew..., good job dodging that! You **SURVIVED** <@" + msg.author.id + "> ! I never land that move anyways :blush: ");
              } else {
                bot.addMemberToRole(bot.users.get("id", msg.author.id), serverRoles['Timeout'], function(error){
                  bot.sendMessage(msg.channel, "O-oops...I messed up...**YOUR BODY IS GONE** ;~;, <@" + msg.author.id + "> ! Rest in pieces :cry:");
                });

                setTimeout(function(){
                  bot.removeMemberFromRole(bot.users.get("id", msg.author.id), serverRoles['Timeout']);
                }, 10000);
              }
            }, 2000);
          }, 1000);
        }
        bot.stopTyping(msg.channel);
      }, 2000);
    }, 1000);
  }
}

/* === SPECIAL: COLOR COMMANDS! === */
// Commands[ "setColor" ] = {
//   oplevel: 0,
//   allowed_channels: [NAIFU_BOT_BURGHAL, NAIFU_LOVE_LOUNGE, AWORLD_COLETTE],
//   allowed_servers: 'all',
//   excluded_channels: 'none',
//   excluded_servers: 'none',
//   cooldown: 'none',
//   fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
//     if(params[2]) {
//       bot.sendMessage( msg.channel, "This command only accepts one argument!\n\nYou need to specify **one** color! The available options are:\n  -- **red**\n  -- **lightpink**\n  -- **hotpink**\n  -- **crimson**\n  -- **mistyrose**  \n  -- **lavender**\n  -- **skyblue**\n  -- **violet**(for the fancy peeps)\n\nExample: `!setColor mistyrose`");
//     } else {
//       if(params[1]) {
//         var userHasXMAS = false;

//         for (var key in authorRoles) {
//           if(authorRoles.hasOwnProperty(key)) {
//             if(authorRoles[key]['name'].substring(0, 4) === 'VAL:'){
//               userHasXMAS = true;
//             }
//           }
//         }

//         var assignXMASRole = function(){
//           var color = params[1];

//           switch(color) {
//             case 'red':
//               bot.addMemberToRole(msg.author, serverRoles['VAL:RED'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to red! :blue_heart:");
//               });
//               break;
//             case 'lightpink':
//               bot.addMemberToRole(msg.author, serverRoles['VAL:LIGHTPINK'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to light pink! :blue_heart:");
//               });
//               break;
//             case 'hotpink':
//               bot.addMemberToRole(msg.author, serverRoles['VAL:HOTPINK'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to hot pink! *hawt* :blue_heart:");
//               })
//               break;
//             case 'crimson':
//               bot.addMemberToRole(msg.author, serverRoles['VAL:CRIMSON'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to crimson! :blue_heart:");
//               })
//               break;
//             case 'mistyrose':
//               bot.addMemberToRole(msg.author, serverRoles['VAL:MISTYROSE'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to misty rose (fancy :o)! ^-^ :blue_heart:");
//               })
//               break;
//             case 'lavender':
//               bot.addMemberToRole(msg.author, serverRoles['VAL:LAVENDER'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to lavender! ^-^ :blue_heart:");
//               })
//               break;
//             case 'skyblue':
//               bot.addMemberToRole(msg.author, serverRoles['VAL:SKYBLUE'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to sky blue! ^-^ :blue_heart:");
//               })
//               break;
//             case 'violet':
//               bot.addMemberToRole(msg.author, serverRoles['VAL:VIOLET'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to violet! ^-^ :blue_heart:");
//               })
//               break;
//             default:
//               bot.sendMessage(msg.channel, "Sorry ;_; That color isn't available.\nThe available options are:\n  -- **red**\n  -- **lightpink**\n  -- **hotpink**\n  -- **crimson**\n  -- **mistyrose**  \n  -- **lavender**\n  -- **skyblue**\n  -- **violet**");
//               break;
//           }
//         }

//         if(userHasXMAS){
//           bot.sendMessage(msg.channel, "Use !unset to clear your current color first!");
//         } else {
//           assignXMASRole();
//         }
//       } else {
//         bot.sendMessage( msg.channel, "You need to specify **one** color! The available options are:\n  -- **red**\n  -- **lightpink**\n  -- **hotpink**\n  -- **crimson**\n  -- **mistyrose**  \n  -- **lavender**\n  -- **skyblue**\n  -- **violet**");
//       }
//     }
//   }
// }

// Commands[ "loadColors" ] = {
//   oplevel: 2,
//   allowed_channels: [NAIFU_BOT_BURGHAL, AWORLD_COLETTE, NAIFU_LOVE_LOUNGE],
//   allowed_servers: 'all',
//   excluded_channels: 'none',
//   excluded_servers: 'none',
//   cooldown: 'none',
//   fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
//     if(params[1]) {
//       bot.sendMessage( msg.channel, "No parameters needed~");
//     } else {

//       var red = 0xB22222;
//       var lightpink = 0xFFB6C1;
//       var hotpink = 0xFF69B4;
//       var crimson = 0xDC143C;
//       var mistyrose = 0xFFCCCC;
//       var lavender = 0xbbbbdd;
//       var skyblue = 0x9DEBE9;
//       var violet = 0x800080;

//       for (var key in serverRoles) {
//         if(serverRoles.hasOwnProperty(key)) {
//           switch(serverRoles[key]['name']) {
//             case 'VAL:RED':
//               bot.updateRole(serverRoles[key], {color: red});
//               break;
//             case 'VAL:LIGHTPINK':
//               bot.updateRole(serverRoles[key], {color: lightpink});
//               break;
//             case 'VAL:HOTPINK':
//               bot.updateRole(serverRoles[key], {color: hotpink});
//               break;
//             case 'VAL:CRIMSON':
//               bot.updateRole(serverRoles[key], {color: crimson});
//               break;
//             case 'VAL:MISTYROSE':
//               bot.updateRole(serverRoles[key], {color: mistyrose});
//               break;
//             case 'VAL:LAVENDER':
//               bot.updateRole(serverRoles[key], {color: lavender});
//               break;
//             case 'VAL:SKYBLUE':
//               bot.updateRole(serverRoles[key], {color: skyblue});
//               break;
//             case 'VAL:VIOLET':
//               bot.updateRole(serverRoles[key], {color: violet});
//               break;
//           }
//         }
//       }
//       bot.sendMessage( msg.channel, "Colors of LURRRVE loaded! All set and ready to go. :D :heart:");
//     }
//   }
// }

// Commands[ "unset" ] = {
//   oplevel: 0,
//   allowed_channels: [NAIFU_BOT_BURGHAL, AWORLD_COLETTE, NAIFU_LOVE_LOUNGE],
//   allowed_servers: 'all',
//   excluded_channels: 'none',
//   excluded_servers: 'none',
//   cooldown: 'none',
//   fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
//     if(params[1]) {
//       bot.sendMessage( msg.channel, "Just type in `!unset`. No color needed!");
//     } else {
//       var userHasXMAS = false;

//       for (var key in authorRoles) {
//         if(authorRoles.hasOwnProperty(key)) {
//           if(authorRoles[key]['name'].substring(0, 4) === 'VAL:'){
//             userHasXMAS = true;
//             bot.removeMemberFromRole(msg.author, authorRoles[key]);
//           }
//         }
//       }

//       if(userHasXMAS){
//         bot.sendMessage(msg.channel, "Color's cleared. :) You can set your color now with the !setColor command!");
//       } else {
//         bot.sendMessage(msg.channel, "You didn't seem to have a color! Set one with the !setColor command. :D\n\nThe !setColor command only accepts one argument!\n\nYou need to specify **one** color! The available options are:\n  -- **red**\n  -- **lightpink**\n  -- **hotpink**\n  -- **crimson**\n  -- **mistyrose**  \n  -- **lavender**\n  -- **skyblue**\n  -- **violet**\n\nExample: `!setColor hotpink`");
//       }
//     }
//   }
// }

// Commands[ "colorhelp" ] = {
//   oplevel: 0,
//   allowed_channels: [NAIFU_BOT_BURGHAL, AWORLD_COLETTE],
//   allowed_servers: 'all',
//   excluded_channels: 'none',
//   excluded_servers: 'none',
//   cooldown: 'none',
//   fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
//     bot.sendMessage(msg.channel, "To set your color, you can use the `!setColor` command!\n\nThe !setColor command only accepts one argument!\n\nYou need to specify **one** color! The available options are:\n  -- **red**\n  -- **lightpink**\n  -- **hotpink**\n  -- **crimson**\n  -- **mistyrose**  \n  -- **lavender**\n  -- **skyblue**\n  -- **violet**\n\nExample: `!setColor mistyrose`\n\nIf you already have a color set, make sure you use the `!unset` command to clear your current color first!\n\nThat's it. :) Have a fun Valentine's Week. ;)");
//   }
// }

/** END COLOR INTEGRATION **/

/**
 * ***********************************************
 * END COMMANDS
 * ***********************************************
 */


/**
 * REACTIONS ARRAY
 * Holds REACTION objects.
 * Defines actions taken when certain words are found in messages.
 * @type {Array}
 */
var Reactions = [];

/**
 * Reactions Description
 * -- oplevel: The restriction of who can use the command.
 *  - 0 -> Anyone can use the command.
 *  - 1 -> Only ADMINS can use the command. (All user IDs in the ADMINS array above)
 *  - 2 -> Only the GOD can use the command. (The GOD ID in the variable above)
 *
 * -- allowed_channels: Channels in which the command works.
 *  - 'all' -> Will work in all channels.
 *  - [CHANNEL_ID_1, CHANNEL_ID_2, ...] -> Array of all channel IDs where the command will work.
 *
 * -- allowed_servers: Servers in which the command works.
 *  - 'all' -> Will work in all servers.
 *  - [SERVER_ID_1, SERVER_ID_2, ...] -> Array of all server IDs where the command will work.
 *
 * -- cooldown: Cooldown time of the command (in seconds)
 *  - 20 -> 20 seconds.
 *  - 40 -> 40 seconds.
 *    - Any number here works.
 *
 * -- fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
 *      // Your code for the command goes here.
 *    }
 *  - bot -> Bot object to use for bot actions.
 *  - params -> Command parameter array.
 *    - If the command is  "!test 5 peach 8" ...
 *    - params[1] = 5,
 *    - params[2] = peach,
 *    - params[3] = 8.
 *   - msg -> Message object of the invoked message that triggered the command.
 *   - msgServer -> Server that the message arrived from.
 *   - serverRoles -> All roles of the server that the command was invoked from in an array.
 *   - authorRoles -> All roles of the author that invoked the command.
 */

Reactions[ "colette" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  fn: function( bot, msg, msgServer ) {

    if(Math.random() < 0.10) {
      var answers = [];
      answers.push({
        message: ">_>*"
      });
      answers.push({
        message: "_trips and falls on the floor_"
      });
      answers.push({
        message: ":blue_heart:"
      });
      answers.push({
        message: "Mushbot's pretty cute~"
      });
      answers.push({
        message: "Fuck you too...I-I mean I'm sorry."
      });

      var answer = answers[Math.floor(Math.random() * answers.length)];
      bot.sendMessage(msg.channel, answer.message);
    }
  }
}

Reactions[ "jace" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: [NAIFU_SERVER],
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 60,
  fn: function( bot, msg, msgServer ) {

    if(Math.random() < 0.01) {
      var answers = [];
      answers.push({
        message: "Jace?...You mean **Tear**, right? :O"
      });

      var answer = answers[Math.floor(Math.random() * answers.length)];
      //bot.sendMessage(msg.channel, answer.message);
      if(answer.filename) {
        //bot.sendFile(msg.channel, 'resources/images/' + answer.filename, answer.filename);
      }
    }
  }
}

Reactions[ "aero" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 60,
  fn: function( bot, msg, msgServer ) {

    if(Math.random() < 0.05) {
      var answers = [];
      answers.push({
        message: "Aeruuuuuuuuuuu :blue_heart:"
      });
      answers.push({
        message: "Dole me back!"
      });
      answers.push({
        message: "Aero is the #1 most cute person in the Naifus. :blue_heart:"
      });
      answers.push({
        message: "AEWO?! RUH ROH!"
      });

      var answer = answers[Math.floor(Math.random() * answers.length)];
      bot.sendMessage(msg.channel, answer.message);
    }
  }
}

Reactions[ "pere" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 60,
  fn: function( bot, msg, msgServer ) {

    if(Math.random() < 0.05) {
      var answers = [];
      answers.push({
        message: ":fish: :lemon: :eyes: :blue_heart:"
      });
      answers.push({
        message: "PERE?! ASFKWTVSAKLW"
      });
      answers.push({
        message: "Gotta love momma peweden :blue_heart:"
      });
      answers.push({
        message: "hOI!! pEreTEM!!!"
      });

      var answer = answers[Math.floor(Math.random() * answers.length)];
      //bot.sendMessage(msg.channel, answer.message);
    }
  }
}

Reactions[ "aiga" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: [NAIFU_SERVER],
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 60,
  fn: function( bot, msg, msgServer ) {
    // @todo include time of mention in EST
    bot.sendMessage(AIGA_MENTIONS, "Looks like you got mentioned! Here's the info...\n\nServer : **"+ msgServer +"**\nChannel : **"+ msg.channel.name + "**\nUser : **" + msg.author.username + "**\nUserID : **" + msg.author.id + "**\nMessage : _\""+ msg.content +"\"_");

    if(Math.random() < 0.02) {
      var answers = [];
      answers.push({
        message: "who's aiga?"
      });
      answers.push({
        message: "Aiga's never here smh..."
      });
      answers.push({
        message: ":eyes:gachu"
      });
      answers.push({
        message: "eat shit aiga"
      });
      answers.push({
        message: "Aiga says he's going to replace me with a better bot. ;_;"
      });

      var answer = answers[Math.floor(Math.random() * answers.length)];
      bot.sendMessage(msg.channel, answer.message);
    }
  }
}
/**
 * ***********************************************
 * END REACTIONS
 * ***********************************************
 */

/**
 * PRECISE REACTIONS ARRAY
 * Holds REACTION objects.
 * Defines actions taken when certain words are found in messages.
 * @type {Array}
 */
// var PReactions = [];

// Reactions[ "ai" ] = {
//   oplevel: 0,
//   allowed_channels: 'all',
//   allowed_servers: 'all',
//   excluded_channels: 'none',
//   excluded_servers: 'none',
//   cooldown: 'none',
//   fn: function( bot, msg, msgServer ) {
//     var answers = [];
//     answers.push({
//       message: "Got em~"
//     });

//     var answer = answers[Math.floor(Math.random() * answers.length)];
//     bot.sendMessage(msg.channel, answer.message);
//   }
// }

/**
 * ***********************************************
 * END PRECISE REACTIONS
 * ***********************************************
 */

/* ***************************************|||||||||||||||||||||||*************************************************** */
/* *************************************** MESSAGE EVENT ACTIONS *************************************************** */
/* ***************************************|||||||||||||||||||||||*************************************************** */

/**
 * === EVENT : Message Creation (Sent)  ===
 */
colette.on("message", function (msg) {
  // Log Messages for DEV purposes
  // console.log(msg);

  if(!msg.channel.recipient) {
    // Global Variable across message reactions to get the server the message was taken from.
    var msgServer   = msg.channel.server.name;
    var serverRoles = getServerRoles(msg);
    var authorRoles = msg.channel.server.rolesOfUser(msg.author);
  }

  /**
   * *******************************************************
   * AUTOMATIC TIMEOUTS STARTS
   * *******************************************************
   */
  if(auto_time) {
    if(msg.author.id != colette.user.id) {
      // User Message Cache
      if(msg_c[msg.author.id] == null) { // If user's message cache is cleared/empty
        msg_c[msg.author.id] = []; // Initiate message cache.
        msg_cc[msg.author.id] = setTimeout(function(){
          // After a delay, clear the cache.
          msg_c[msg.author.id] = null;
        }, 1000 * 30);
      }

      // Add message to the user's message cache.
      msg_c[msg.author.id].push(msg);

      // If the message cache is bigger than just 1 message.
      if(msg_c[msg.author.id].length > 1) {

        // QuickSpam Functionality
        // if(qspam_c[msg.author.id] == null) {
        //   qspam_c[msg.author.id] = [];
        // }

        // qspam_c[msg.author.id].push(msg);

        // qspam_cc = setTimeout(function(){
        //   qspam_c[msg.author.id] = null;
        // }, 900);

        // if(qspam_c[msg.author.id].length >= 3) {
        //   // Assign 'Timeout' role.
        //   colette.addMemberToRole(msg.author, serverRoles['Timeout']);
        //   colette.sendMessage(msg.channel, "BAN HAMMER TO SMASH THE SPAMMER <@" + msg.author.id + "> ! >:O !!!");
        //   colette.sendFile(msg.channel, 'resources/images/ban_hammer.png', 'judgement.png');

        //   // delete spam
        //   for(var key in qspam_c[msg.author.id]) {
        //     colette.deleteMessage(qspam_c[msg.author.id][key]);
        //   }

        //   spam_c[msg.author.id] = null;
        //   qspam_c[msg.author.id] = null;
        //   setTimeout(function(){
        //     colette.removeMemberFromRole(msg.author, serverRoles['Timeout']);
        //   }, 1000 * 5);
        //   clearTimeout(spam_cc[msg.author.id]);
        //   clearTimeout(qspam_cc[msg.author.id]);
        // }

        // Normal Spam Functionality.
        // Push to spam array if it's same message as last
        // var lastMsg = msg_c[msg.author.id][msg_c[msg.author.id].length - 2];

        // if(msg.content === lastMsg.content) {
        //   if(spam_c[msg.author.id] == null) {
        //     spam_c[msg.author.id] = [];
        //     // push the first message into this array if it must get deleted
        //     //spam_c[msg.author.id].push(lastMsg);
        //   }

        //   clearTimeout(spam_cc[msg.author.id]);
        //   spam_cc[msg.author.id] = null;
        //   spam_cc[msg.author.id] = setTimeout(function(){
        //     spam_c[msg.author.id] = null;
        //   }, 1000 * 10);
        //   spam_c[msg.author.id].push(msg);

        //   if(spam_c[msg.author.id].length >= 4) {
        //     // Assign 'Timeout' role.
        //     colette.addMemberToRole(msg.author, serverRoles['Timeout']);
        //     colette.sendMessage(msg.channel, "Oops! My hands slipped and I _**accidentally**_ timed out <@" + msg.author.id + "> :P (NO SPAM!) !");
        //     colette.sendFile(msg.channel, 'resources/images/judgement.png', 'judgement.png');

        //     // delete spam
        //     for(var key in spam_c[msg.author.id]) {
        //       colette.deleteMessage(spam_c[msg.author.id][key]);
        //     }
        //     spam_c[msg.author.id] = null;
        //     msg_c[msg.author.id] = null;
        //     setTimeout(function(){
        //       colette.removeMemberFromRole(msg.author, serverRoles['Timeout']);
        //     }, 1000 * 10);
        //     clearTimeout(spam_cc[msg.author.id]);
        //   }
        // }
      }

    }
  }

  /**
   * *******************************************************
   * AUTOMATIC TIMEOUTS END
   * *******************************************************
   */

  /**
   * *******************************************************
   * COMMANDS HANDLING START
   * *******************************************************
   */
  for (var key in Commands) {
    if (Commands.hasOwnProperty(key)) {
      var params = msg.content.split(" "); // Divide text into distinct parameters.
      var command = params[0].toUpperCase();
      if(command === (CommandPrefix + key).toUpperCase() && msg.author.id !== colette.user.id) {

        var DENIAL_FLAG = false; // handles approval if needed

        // Check OP Level
        if(Commands[key].oplevel === 2) {
          if(!isGodMessage(msg)) {
            DENIAL_FLAG = true;
          }
        } else if(Commands[key].oplevel === 1) {
          if(!isAdminMessage(msg)) {
            DENIAL_FLAG = true;
          }
        }

        // Check Allowed Servers
        if(Commands[key].allowed_servers !== 'all') {
          if(Commands[key].allowed_servers.indexOf(msg.channel.server.id) <= -1) {
            DENIAL_FLAG = true;
          }
        }

        // Check Allowed Channels
        if(Commands[key].allowed_channels !== 'all') {
          if(Commands[key].allowed_channels.indexOf(msg.channel.id) <= -1) {
            DENIAL_FLAG = true;
          }
        }

        // Check Cooldown (if any)
        if(Commands[key].cooldown !== 'none') {
         if(COOLDOWNS[key]) {
          DENIAL_FLAG = true;
          if(!COOLDOWNS['announce_cd_' + key]) {
            colette.sendMessage(msg.channel, "Sorry! The `!" + key + "` command seems to be on cooldown.\nThe cooldown time is **" + Commands[key].cooldown + "** seconds. Please be patient and don't spam!");
            COOLDOWNS['announce_cd_' + key] = true;
            removeCooldown('announce_cd_' + key);
          }
          colette.deleteMessage(msg);
         } else {
          COOLDOWNS[key] = true;
          removeCooldown(key);
         }
        }

        // Run Command if it passed approval.
        if(!DENIAL_FLAG) {
          Commands[key].fn(colette, params, msg, msgServer, serverRoles, authorRoles);
        }
      }
    }
  }
  /**
   * *******************************************************
   * COMMANDS HANDLING END
   * *******************************************************
   */



  /**
   * *******************************************************
   * REACTIONS HANDLING START
   * Same as commands, but do not require a prefix (and tend to have cooldowns)
   * *******************************************************
   */
  for (var key in Reactions) {
    if (Reactions.hasOwnProperty(key)) {
      var keygex = new RegExp(key, "i");
      if( keygex.test(msg.content) && msg.author.id !== colette.user.id) {

        var DENIAL_FLAG = false; // handles validation if needed

        // Check OP Level
        if(Reactions[key].oplevel === 2) {
          if(!isGodMessage(msg)) {
            DENIAL_FLAG = true;
          }
        } else if(Reactions[key].oplevel === 1) {
          if(!isAdminMessage(msg)) {
            DENIAL_FLAG = true;
          }
        }

        // Check Allowed Servers
        if(Reactions[key].allowed_servers !== 'all') {
          if(Reactions[key].allowed_servers.indexOf(msg.channel.server.id) <= -1) {
            DENIAL_FLAG = true;
          }
        }

        // Check Allowed Channels
        if(Reactions[key].allowed_channels !== 'all') {
          if(Reactions[key].allowed_channels.indexOf(msg.channel.id) <= -1) {
            DENIAL_FLAG = true;
          }
        }

        // Check Cooldown (if any)
        if(Reactions[key].cooldown !== 'none') {
         if(COOLDOWNS[key]) {
          DENIAL_FLAG = true;
         } else {
          COOLDOWNS[key] = true;
          removeCooldown(key);
         }
        }

        // Run Command if it passed approval.
        if(!DENIAL_FLAG) {
          Reactions[key].fn(colette, msg, msgServer);
        }
      }
    }
  }
  /**
   * *******************************************************
   * REACTIONS HANDLING END
   * Same as commands, but do not require a prefix (and tend to have cooldowns)
   * *******************************************************
   */

  /**
   * *******************************************************
   * PRECISE REACTIONS HANDLING START
   * Same as commands, but do not require a prefix (and tend to have cooldowns)
   * *******************************************************
   */

  // for (var key in PReactions) {
  //   if (PReactions.hasOwnProperty(key)) {
  //     if( msg.content.indexOf(key) > -1 && ( msg.content[msg.content.indexOf(key) - 1] === " " || msg.content[msg.content.indexOf(key) - 1] === null) && msg.author.id !== colette.user.id) {

  //       var DENIAL_FLAG = false; // handles validation if needed

  //       // Check OP Level
  //       if(PReactions[key].oplevel === 2) {
  //         if(!isGodMessage(msg)) {
  //           DENIAL_FLAG = true;
  //         }
  //       } else if(PReactions[key].oplevel === 1) {
  //         if(!isAdminMessage(msg)) {
  //           DENIAL_FLAG = true;
  //         }
  //       }

  //       // Check Allowed Servers
  //       if(PReactions[key].allowed_servers !== 'all') {
  //         if(PReactions[key].allowed_servers.indexOf(msg.channel.server.id) <= -1) {
  //           DENIAL_FLAG = true;
  //         }
  //       }

  //       // Check Allowed Channels
  //       if(PReactions[key].allowed_channels !== 'all') {
  //         if(PReactions[key].allowed_channels.indexOf(msg.channel.id) <= -1) {
  //           DENIAL_FLAG = true;
  //         }
  //       }

  //       // Check Cooldown (if any)
  //       if(PReactions[key].cooldown !== 'none') {
  //        if(COOLDOWNS[key]) {
  //         DENIAL_FLAG = true;
  //        } else {
  //         COOLDOWNS[key] = true;
  //         removeCooldown(key);
  //        }
  //       }

  //       // Run Command if it passed approval.
  //       if(!DENIAL_FLAG) {
  //         PReactions[key].fn(colette, msg, msgServer);
  //       }
  //     }
  //   }
  // }
  /**
   * *******************************************************
   * PREACTIONS HANDLING END
   * Same as commands, but do not require a prefix (and tend to have cooldowns)
   * *******************************************************
   */

  // Emotes
  if(EmotesOn) {
    for (var key in Emotes) {
      if(Emotes.hasOwnProperty(key)) {
        var keygex = new RegExp(key, "i");
        if( keygex.test(msg.content) && msg.author.id !== colette.user.id) {
          colette.sendFile(msg.channel, Emotes[key], key + ".png");
        }
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

  //console.log("MESSAGE WAS DELETED BY " + (msg ? msg.author.username : channel.name));

});

/********************************************************************************************/

/**
 * === EVENT : Message Update/Editing  ===
 * @todo  Will soon have similar commands to the message events.
 * @todo  Will soon log edited messages. (THIS IS POLICE AS FUCK.)
 */
colette.on("messageUpdate", function (msg, formerMsg) {

  //console.log(msg.author.username, "changed", formerMsg.content, "to", msg.content);

});

/********************************************************************************************/

/**
 * === EVENT : User Addition to Server ===
 * @todo  Will soon send which server it happened on as well.
 */
colette.on("serverNewMember", function (server, user) {
  //console.log("new user", user);

  if(server.id != AIGA_HAVEN) {
    // PM me about server removals adds.
    colette.sendMessage(AIGA_NEWCOMERS, "Looks like we have a newcomer in the **"+ server.name +"** server: **" + user.username + "**");
  }
});

/********************************************************************************************/

/**
 * === EVENT : User Removal from Server ===
 * @todo Will soon send which server it happened on as well.
 */
colette.on("serverMemberRemoved", function (server, user) {
  //console.log("left user", user);

  if(server.id != AIGA_HAVEN) {
    // PM me about server removals.
    colette.sendMessage(AIGA_REMOVALS, "Whoa yikes! The following user was removed from the **" + server.name + "** server: **" + user.username + "**");
  }
});

/********************************************************************************************/

/**
 * === EVENT : User Information Change ===
 */
colette.on("userUpdate", function (oldUser, newUser) {
  //console.log(oldUser, "vs", newUser);

  // Send name change information to me in PMs
  if(oldUser.username !== newUser.username) {
    colette.sendMessage(AIGA_NC, "Name change logged. :) Here's the information:\nUser's ID: **" + oldUser.id + "**\n\nOld Name: **" + oldUser.username + "**\nNew Name: **" + newUser.username + "**\n-------------------------------");
  }

  // Log name change information in files.
  // @TODO
});

/********************************************************************************************/

/**
 * === EVENT : Channel Creation ===
 */
colette.on("channelCreate", function(chann){
  //console.log(chann);
})

/********************************************************************************************/

/* === Useful Functions === */

// Check invoker. If it's you, roll the command.
// @TODO - ROLE HANDLING INSTEAD OF ACCOUNT ID
function isGodMessage(message) {
  var author_id = message.author.id;
  if(author_id == GOD_ID) {
    return true;
  } else {
    return false;
  }
}

// Check invoker. If it's a god, roll the command.
function isAdminMessage(message) {
  var author_id = message.author.id;
  if(ADMINS.indexOf(author_id) > -1 || author_id == GOD_ID) {
    return true;
  } else {
    return false;
  }
}


// PM admin (aka me)
function pmme(message) {
  // Might be able to change this to a user for the channel resolvable.
  colette.sendMessage(colette.users.get("id", GOD_ID), message);
}

// Function used to return channels for respective servers.
function getServerChannel(serverName, channelName) {
  return colette.servers.get("name", serverName).channels.get("name", channelName);
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

// Remove cooldown after delay.
function removeCooldown(key) {
  if(typeof Commands[key] !== 'undefined') {
    setTimeout(function(){ COOLDOWNS[key] = false; console.log("Removed cooldown for " + key); }, 1000 * Commands[key].cooldown);
  } else {
    setTimeout(function(){ COOLDOWNS[key] = false; console.log("Removed cooldown for " + key); }, 1000 * 15);
  }

}

// Get Server Roles
function getServerRoles(msg) {
  var rolesObject = msg.channel.server.roles;
  var roles = [];

  for (var key in rolesObject) {
    if (rolesObject.hasOwnProperty(key)) {
      roles[rolesObject[key]['name']] = rolesObject[key];
    }
  }

  return roles;
}
