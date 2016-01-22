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
// @todo store authentication in json file
// var Auth = require("./auth.json"); // @TODO JSON STORAGE

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
var twitch_id = 'tn2tqa6lnu7gj3pl5h680dc40sbv5r2';

// Instantiate Twitch Object
var twitch = new TwitchObject(twitch_id);


/********************************************************************************************/

/* === Configurations === */
// @todo

// Login
colette.login("aigabot.sama@gmail.com", "xu8h7gy@")
  .then(function (token) {
    console.log("Initating cuteness...");
  }).catch(function (error) {
    console.log(error);
  });

colette.on("ready", function () {
  console.log("Jack in! Colette! Execute!");
})

/********************************************************************************************/

/* === The Juicy Stuff === */

/* === Variables === */

/* == Server Variables  == */
// ANOTHER WORLD
// COLETTE TEST CHANNEL
var AWORLD_COLETTE = '103228407290003456';

// NAIFUS
var NAIFU_SERVER = '82343511336157184';
// BOTBURGHAL CHANNEL
var NAIFU_BOT_BURGHAL = '83017907335860224';
// LOVELOUNGE_CHANNEL
var NAIFU_LOVE_LOUNGE = '137044760941559809';

// ONETTBOYZ
// BOTFACILITY CHANNEL
var ONETT_BOT_FACILITY = '83224528322297856';


// Define Interval Array Variable
var stream_check_interval_ids = [];

// Admin account to restrict Bot commands!
// There are ways to get this ID ;)
var ADMIN_ID = '77517077325287424'; // My account ID <3
var PM_CHANNEL_ID = '83297162842079232'; // My pm channel ID so colette can PM me <3

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

/* == GODS == */

var GODS = [
  "77577477425201152", // Dango
  "90171294200365056", // Zero Bot Samus
  "82938251760898048", // Mushbot
];

/* == Features == */

// Notifications Enabling
var notify_mentions = true;

// Auto Timeouts Enabling
var auto_time = true; // Enabled by default


// Array of all commands.
var CommandPrefix = "!";
var Commands = [];

Commands[ "ping" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    pmme("New, CLEAN pong. That's right, we're fancy now Aiga.");

  }
}

Commands[ "pong" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    bot.sendMessage(msg.channel, "New, CLEAN ping. That's right, we're fancy now Aiga.");

  }
}

Commands[ "gcid" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    // @TODO - Accept one parameter, which is the channel link with #.
    // No rush for this tbh.
    bot.deleteMessage(msg);
    bot.sendMessage(bot.users.get("id", msg.author.id), "Psst! Here's the id of the **" + msg.channel + "** channel:\n\n**" + msg.channel.id + "**");
  }
}

Commands[ "guid" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
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
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
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
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
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
  cooldown: 10,
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
  cooldown: 10,
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
  cooldown: 15,
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    if(params[1]) {
      var thing = msg.content.slice(6);
      bot.sendMessage( msg.channel, "There is __**" + Math.floor(Math.random() * 100) + "%**__ love between <@" + msg.author.id + "> and **" + thing + "**!" );
    } else {
      bot.sendMessage( msg.channel, "You have 100% for ZeRo & M2K's AS5 if you don't specify an object or person!\n\n_Make sure you put an argument! `!love cheese`_");
    }
  }
}

Commands[ "seppuku" ] = {
  oplevel: 0,
  allowed_channels: [NAIFU_LOVE_LOUNGE],
  allowed_servers: 'all',
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
  cooldown: 15,
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
            bot.sendMessage(msg.channel, '_The gun magically comes to life and it pulls it\'s own trigger, aiming directly at you!_');
            setTimeout(function(){
              if(survival) {
                bot.sendMessage(msg.channel, "_Phew! You swiftly dodged the bullet and **SURVIVED** <@" + msg.author.id + ">! The gun glares at you and dissapears._");
              } else {
                bot.addMemberToRole(bot.users.get("id", msg.author.id), serverRoles['Timeout'], function(error){
                  bot.sendMessage(msg.channel, "Ow...O-oh no! **YOU GOT DUNKED ON** <@" + msg.author.id + "> !\n\n_The gun laughs and dissapears into the darkness._");
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

/* === SPECIAL: CHRISTMAS COLOR COMMANDS! === */
// Commands[ "setColor" ] = {
//   oplevel: 0,
//   allowed_channels: [NAIFU_BOT_BURGHAL, AWORLD_COLETTE],
//   allowed_servers: 'all',
//   cooldown: 'none',
//   fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
//     if(params[2]) {
//       bot.sendMessage( msg.channel, "This command only accepts one argument!\n\nYou need to specify **one** color! The available options are:\n  -- **red**\n  -- **green**\n  -- **blue**\n  -- **gold**\n  -- **darkred**\n\nExample: `!setColor red`");
//     } else {
//       if(params[1]) {
//         var userHasXMAS = false;

//         for (var key in authorRoles) {
//           if(authorRoles.hasOwnProperty(key)) {
//             if(authorRoles[key]['name'].substring(0, 5) === 'XMAS:'){
//               userHasXMAS = true;
//             }
//           }
//         }

//         var assignXMASRole = function(){
//           var color = params[1];

//           switch(color) {
//             case 'red':
//               bot.addMemberToRole(msg.author, serverRoles['XMAS:RED'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to red! Merry Christmas! ^-^ :blue_heart:");
//               });
//               break;
//             case 'green':
//               bot.addMemberToRole(msg.author, serverRoles['XMAS:GREEN'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to green! Merry Christmas! ^-^ :blue_heart:");
//               });
//               break;
//             case 'blue':
//               bot.addMemberToRole(msg.author, serverRoles['XMAS:BLUE'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to blue! Merry Christmas! ^-^ :blue_heart:");
//               })
//               break;
//             case 'gold':
//               bot.addMemberToRole(msg.author, serverRoles['XMAS:GOLD'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to gold! Merry Christmas! ^-^ :blue_heart:");
//               })
//               break;
//             case 'darkred':
//               bot.addMemberToRole(msg.author, serverRoles['XMAS:DARKRED'], function(error){
//                 bot.sendMessage(msg.channel, "Successfully set your color to dark red! Merry Christmas! ^-^ :blue_heart:");
//               })
//               break;
//             default:
//               bot.sendMessage(msg.channel, "Sorry ;_; That color isn't Christmasy enough.\nThe available options are:\n  -- **red**\n  -- **green**\n  -- **blue**\n  -- **gold**\n  -- **darkred**");
//               break;
//           }
//         }

//         if(userHasXMAS){
//           bot.sendMessage(msg.channel, "Use !unset to clear your current color first!");
//         } else {
//           assignXMASRole();
//         }
//       } else {
//         bot.sendMessage( msg.channel, "You need to specify **one** color! The available options are:\n  -- **red**\n  -- **green**\n  -- **blue**\n  -- **gold**\n  -- **darkred**");
//       }
//     }
//   }
// }

// Commands[ "unset" ] = {
//   oplevel: 0,
//   allowed_channels: [NAIFU_BOT_BURGHAL, AWORLD_COLETTE],
//   allowed_servers: 'all',
//   cooldown: 'none',
//   fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
//     if(params[1]) {
//       bot.sendMessage( msg.channel, "Just type in `!unset`. No color needed!");
//     } else {
//       var userHasXMAS = false;

//       for (var key in authorRoles) {
//         if(authorRoles.hasOwnProperty(key)) {
//           if(authorRoles[key]['name'].substring(0, 5) === 'XMAS:'){
//             userHasXMAS = true;
//             bot.removeMemberFromRole(msg.author, authorRoles[key]);
//           }
//         }
//       }

//       if(userHasXMAS){
//         bot.sendMessage(msg.channel, "Color's cleared. :) You can set your color now with the !setColor command!");
//       } else {
//         bot.sendMessage(msg.channel, "You didn't seem to have a color! Set one with the !setColor command. :D\n\nThe !setColor command only accepts one argument!\n\nYou need to specify **one** color! The available options are:\n  -- **red**\n  -- **green**\n  -- **blue**\n  -- **gold**\n  -- **darkred**\n\nExample: `!setColor red`");
//       }
//     }
//   }
// }

// Commands[ "colorhelp" ] = {
//   oplevel: 0,
//   allowed_channels: [NAIFU_BOT_BURGHAL, AWORLD_COLETTE],
//   allowed_servers: 'all',
//   cooldown: 'none',
//   fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
//     bot.sendMessage(msg.channel, "To set your color, you can use the `!setColor` command!\n\nThe !setColor command only accepts one argument!\n\nYou need to specify **one** color! The available options are:\n  -- **red**\n  -- **green**\n  -- **blue**\n  -- **gold**\n  -- **darkred**\n\nExample: `!setColor red`\n\nIf you already have a color set, make sure you use the `!unset` command to clear your current color first!\n\nThat's it. :) Merry Christmas btw. ;)");
//   }
// }

/** END COLOR INTEGRATION **/


// Array of all reactions.
var Reactions = [];

Reactions[ "colette" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, msg, msgServer ) {

    if(Math.random() < 0.10) {
      var answers = [];
      answers.push({
        message: "aiga stfu :blue_heart:*"
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

      var answer = answers[Math.floor(Math.random() * answers.length)];
      bot.sendMessage(msg.channel, answer.message);
    }
  }
}

Reactions[ "jace" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: [NAIFU_SERVER],
  cooldown: 60,
  fn: function( bot, msg, msgServer ) {

    if(Math.random() < 0.05) {
      var answers = [];
      answers.push({
        message: "Jace?...You mean **Tear**, right? :O"
      });
      answers.push({
        message: "Jaceroni! :blue_heart:"
      });
      answers.push({
        message: "Juiace!"
      });
      answers.push({
        message: "Joce! xD"
      });
      answers.push({
        message: "A pic of me and Jace~",
        filename: 'Colette_Tear_Summer.jpg',
      });

      var answer = answers[Math.floor(Math.random() * answers.length)];
      bot.sendMessage(msg.channel, answer.message);
      if(answer.filename) {
        bot.sendFile(msg.channel, 'resources/images/' + answer.filename, answer.filename);
      }
    }
  }
}

Reactions[ "aero" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
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
        message: "AERO?! RUH ROH!"
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
  allowed_servers: 'all',
  cooldown: 60,
  fn: function( bot, msg, msgServer ) {
    // @todo include time of mention in EST
    pmme("Looks like you got mentioned! Here's the info...\n\nServer : **"+ msgServer +"**\nChannel : **"+ msg.channel.name + "**\nUser : **" + msg.author.username + "**\nUserID : **" + msg.author.id + "**\nMessage : _\""+ msg.content +"\"_");

    if(Math.random() < 0.10) {
      var answers = [];
      answers.push({
        message: "*summoning Aigachu...*"
      });
      answers.push({
        message: "Aiga's never here smh..."
      });
      answers.push({
        message: ":eyes:gachu sees all"
      });
      answers.push({
        message: "Watch Aiga show up right now..."
      });
      answers.push({
        message: "Aiga makes me wish I was never saved by Lloyd and instead became a vessel for Martel and lost my soul tbh."
      });

      var answer = answers[Math.floor(Math.random() * answers.length)];
      bot.sendMessage(msg.channel, answer.message);
    }
  }
}

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

  // Automatic Timeouts
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
        var lastMsg = msg_c[msg.author.id][msg_c[msg.author.id].length - 2];

        if(msg.content === lastMsg.content) {
          if(spam_c[msg.author.id] == null) {
            spam_c[msg.author.id] = [];
            // push the first message into this array if it must get deleted
            //spam_c[msg.author.id].push(lastMsg);
          }

          clearTimeout(spam_cc[msg.author.id]);
          spam_cc[msg.author.id] = null;
          spam_cc[msg.author.id] = setTimeout(function(){
            spam_c[msg.author.id] = null;
          }, 1000 * 10);
          spam_c[msg.author.id].push(msg);

          if(spam_c[msg.author.id].length >= 4) {
            // Assign 'Timeout' role.
            colette.addMemberToRole(msg.author, serverRoles['Timeout']);
            colette.sendMessage(msg.channel, "Oops! My hands slipped and I _**accidentally**_ timed out <@" + msg.author.id + "> :P (NO SPAM!) !");
            colette.sendFile(msg.channel, 'resources/images/judgement.png', 'judgement.png');

            // delete spam
            for(var key in spam_c[msg.author.id]) {
              colette.deleteMessage(spam_c[msg.author.id][key]);
            }
            spam_c[msg.author.id] = null;
            msg_c[msg.author.id] = null;
            setTimeout(function(){
              colette.removeMemberFromRole(msg.author, serverRoles['Timeout']);
            }, 1000 * 10);
            clearTimeout(spam_cc[msg.author.id]);
          }
        }
      }

    }
  }



  // Commands
  for (var key in Commands) {
    if (Commands.hasOwnProperty(key)) {
      var params = msg.content.split(" "); // Divide text into distinct parameters.
      if(params[0].toUpperCase() === (CommandPrefix + key).toUpperCase() && msg.author.id !== colette.user.id) {

        var DENIAL_FLAG = false; // handles approval if needed

        // Check OP Level
        if(Commands[key].oplevel === 2) {
          if(!isAdminMessage(msg)) {
            DENIAL_FLAG = true;
          }
        } else if(Commands[key].oplevel === 1) {
          if(!isGodMessage(msg)) {
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



  // Reactions
  // Same as commands, but do not require a prefix (and tend to have cooldowns)
  for (var key in Reactions) {
    if (Reactions.hasOwnProperty(key)) {
      var keygex = new RegExp(key, "i");
      if( keygex.test(msg.content) && msg.author.id !== colette.user.id) {

        var DENIAL_FLAG = false; // handles validation if needed

        // Check OP Level
        if(Reactions[key].oplevel === 2) {
          if(!isAdminMessage(msg)) {
            DENIAL_FLAG = true;
          }
        } else if(Reactions[key].oplevel === 1) {
          if(!isGodMessage(msg)) {
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
colette.on("serverNewMember", function (server, user) {
  console.log("new user", user);

  // PM me about server removals adds.
  pmme("Looks like we have a newcomer in the **"+ server.name +"** server: **" + user.username + "**");
});

/********************************************************************************************/

/**
 * === EVENT : User Removal from Server ===
 * @todo Will soon send which server it happened on as well.
 */
colette.on("serverMemberRemoved", function (server, user) {
  console.log("left user", user);

  // PM me about server removals.
  pmme("Whoa yikes! The following user was removed from the **" + server.name + "** server: **" + user.username + "**");
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

// Check invoker. If it's a god, roll the command.
function isGodMessage(message) {
  var author_id = message.author.id;
  if(GODS.indexOf(author_id) > -1 || author_id == ADMIN_ID) {
    return true;
  } else {
    return false;
  }
}


// PM admin (aka me)
function pmme(message) {
  // Might be able to change this to a user for the channel resolvable.
  colette.sendMessage(colette.users.get("id", ADMIN_ID), message);
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
