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
colette.login("aigabot2@gmail.com", "xu8h7gy@")
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
var NAIFU_SERVER_ID = '82343511336157184';
// BOTBURGHAL CHANNEL
var NAIFU_BOT_BURGHAL = '83017907335860224';

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
var cooldowns = {};

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


// Array of all commands.
var CommandPrefix = "!";
var Commands = [];

Commands[ "ping" ] = {
  oplevel: 1,
  allowed_channels: 'all',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    pmme("New, CLEAN pong. That's right, we're fancy now Aiga.");

  }
}

Commands[ "pong" ] = {
  oplevel: 1,
  allowed_channels: 'all',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    bot.sendMessage(msg.channel, "New, CLEAN ping. That's right, we're fancy now Aiga.");

  }
}

Commands[ "gcid" ] = {
  oplevel: 1,
  allowed_channels: 'all',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    bot.deleteMessage(msg);
    bot.sendMessage(bot.users.get("id", msg.author.id), "Psst! Here's the id of the **" + msg.channel + "** channel:\n\n**" + msg.channel.id + "**");
  }
}

Commands[ "setName" ] = {
  oplevel: 1,
  allowed_channels: 'all',
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
  oplevel: 1,
  allowed_channels: 'all',
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
  oplevel: 1,
  allowed_channels: 'all',
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
  oplevel: 1,
  allowed_channels: 'all',
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
  oplevel: 1,
  allowed_channels: 'all',
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
  oplevel: 1,
  allowed_channels: 'all',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    Emotes = reloadEmotes();
    bot.sendMessage(msg.channel, "Emotes reloaded!");

  }
}

Commands[ "enEmo" ] = {
  oplevel: 1,
  allowed_channels: 'all',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    EmotesOn = true;
    bot.sendMessage(msg.channel, "Activated twitch emotes! ");

  }
}

Commands[ "deEmo" ] = {
  oplevel: 1,
  allowed_channels: 'all',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    EmotesOn = false;
    bot.sendMessage(msg.channel, "Deactivated twitch emotes.");

  }
}

Commands[ "timeout" ] = {
  oplevel: 1,
  allowed_channels: 'all',
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
  oplevel: 1,
  allowed_channels: 'all',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    auto_time = true;
    bot.sendMessage(msg.channel, "Turning on automatic timeouts...Time to purge! :fist:");

  }
}

Commands[ "deTo" ] = {
  oplevel: 1,
  allowed_channels: 'all',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    auto_time = false;
    bot.sendMessage(msg.channel, "Turning off automatic timeouts...:(");

  }
}

Commands[ "rolldice" ] = {
  oplevel: 0,
  allowed_channels: 'all',
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
  allowed_channels: 'all',
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

/* === SPECIAL: CHRISTMAS COLOR COMMANDS! === */
// Commands[ "setColor" ] = {
//   oplevel: 0,
//   allowed_channels: [NAIFU_BOT_BURGHAL, AWORLD_COLETTE],
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
//   fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
//     bot.sendMessage(msg.channel, "To set your color, you can use the `!setColor` command!\n\nThe !setColor command only accepts one argument!\n\nYou need to specify **one** color! The available options are:\n  -- **red**\n  -- **green**\n  -- **blue**\n  -- **gold**\n  -- **darkred**\n\nExample: `!setColor red`\n\nIf you already have a color set, make sure you use the `!unset` command to clear your current color first!\n\nThat's it. :) Merry Christmas btw. ;)");
//   }
// }

/** END COLOR INTEGRATION **/


// Array of all reactions.
var Reactions = [];

Reactions[ "colette" ] = {
  oplevel: 1,
  allowed_channels: [AWORLD_COLETTE, NAIFU_BOT_BURGHAL],
  fn: function( bot, msg, msgServer ) {

    bot.sendMessage(msg.channel, "Hm? You called?");

  }
}

Reactions[ "Aiga" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  fn: function( bot, msg, msgServer ) {
    // @todo include time of mention in EST
    pmme("Looks like you got mentioned! Here's the info...\n\nServer : **"+ msgServer +"**\nChannel : **"+ msg.channel.name +"**\nMessage : _\""+ msg.content +"\"_");

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
        // }, 400);

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

      // Check if last 5 items had the same content

    }
  }



  // Commands
  for (var key in Commands) {
    if (Commands.hasOwnProperty(key)) {
      var params = msg.content.split(" ");
      if(params[0].toUpperCase() === (CommandPrefix + key).toUpperCase() && msg.author.id !== colette.user.id) {
        // Check allowed channels
        if(Commands[key].allowed_channels === 'all') {
          // Check op level
          if(Commands[key].oplevel === 1) {
            if(isAdminMessage(msg)) {
              // Run the command's function.
              Commands[key].fn(colette, params, msg, msgServer, serverRoles, authorRoles);
            }
          } else {
            // Run the command's function.
            var params = msg.content.split(" ");
            Commands[key].fn(colette, params, msg, msgServer, serverRoles, authorRoles);
          }
        } else {
          if(Commands[key].allowed_channels.indexOf(msg.channel.id) > -1) {
            // Check op level
            if(Commands[key].oplevel === 1) {
              if(isAdminMessage(msg)) {
                // Run the command's function.
                Commands[key].fn(colette, params, msg, msgServer, serverRoles, authorRoles);
              }
            } else {
              // Run the command's function.
              var params = msg.content.split(" ");
              Commands[key].fn(colette, params, msg, msgServer, serverRoles, authorRoles);
            }
          }
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
        if(Reactions[key].allowed_channels === 'all') {
          // Check op level
          if(Reactions[key].oplevel === 1) {
            if(isAdminMessage(msg)) {
              // Run the command's function.
              Reactions[key].fn(colette, msg, msgServer);
            }
          }
          else {
            // Run the command's function.
            Reactions[key].fn(colette, msg, msgServer);
          }
        } else {
          if(Reactions[key].allowed_channels.indexOf(msg.channel.id) > -1) {
            // Check op level
            if(Reactions[key].oplevel === 1) {
              if(isAdminMessage(msg)) {
                // Run the command's function.
                Reactions[key].fn(colette, msg, msgServer);
              }
            }
            else {
              // Run the command's function.
              Reactions[key].fn(colette, msg, msgServer);
            }
          }
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
