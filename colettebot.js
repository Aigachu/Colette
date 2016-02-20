/* === Requires === */

// discord.js module
var Discord = require("discord.js");

// filesystem
var fs = require('fs');

/********************************************************************************************/

/* === Configurations === */

/**
 * discord.js
 * Uses the discord.js module made by hydrabolt.
 * @DOCU: https://discordjs.readthedocs.org/en/latest/
 */

// This instantiates a Discord Client that the bot uses.
var dbot = new Discord.Client();

/********************************************************************************************/

/* === Configurations === */

// Login
dbot.login("aigabot2@gmail.com", "xu8h7gy@")
  .then(function (token) {
    console.log("Loading up...");
  }).catch(function (error) {
    console.log(error);
  });

dbot.on("ready", function () {
  console.log("Discord bot ready.");
})

// Admin account to restrict Bot commands!
// There are ways to get this ID ;)
var GOD = '80922902995673088'; // My account ID <3

/* == ADMINS == */
// Other user IDs that will be able to use your bot.
var ADMINS = [
  "83629904356208640", // example
  "77517077325287424", // example
  "80922902995673088", // example
];

/********************************************************************************************/

/* === The Juicy Stuff === */

/* === Variables === */

/* == Server Variables  == */
// Create your server ID variables here.

// Command/Reactions Cooldowns
var COOLDOWNS = [];

/* == The Good  Stuff == */

// Array of all commands.
var CommandPrefix = "!"; // The prefix for all commands!
var Commands = [];

/**
 * Commands
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


Commands[ "bitch" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    pmme("If you are seeing this it's too late");

  }
}

Commands[ "pong" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    bot.sendMessage(msg.channel, "u ugly af dont talk to me");

  }
}

Commands[ "make4noticeme" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    bot.sendMessage(msg.channel, "Fuck you");

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

Commands[ "gsid" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    bot.deleteMessage(msg);
    bot.sendMessage(bot.users.get("id", msg.author.id), "Psst! Here's the id of the server: **" + msg.channel.server.id + "**");
  }
}

Commands[ "setName" ] = {
  oplevel: 2,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    if(params[1]) {
      var newName = msg.content.substring(params[0].length, msg.content.length);
      bot.setUsername(newName).catch(function(err){
        console.log(err);
      });
      bot.sendMessage( msg.channel, "Changing my name!");
    } else {
      bot.sendMessage( msg.channel, "Change it to what?...I can't change it to blank you binche. -_-");
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
      bot.sendMessage( msg.channel, "Send me a blank command that needs parameters ONE MORE TIME MAI I S2G.");
    }
  }
}


Commands[ "Aiga" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var imgz = reloadImageCommand('pic'); 
    var folder = "resources/imagecommands/pic/"; 
    var rand = Math.floor(Math.random() * imgz.length);

    bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);
  }
}

Commands[ "rnh" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var imgz = reloadImageCommand('rnh');
    var folder = "resources/imagecommands/rnh/";
    var rand = Math.floor(Math.random() * imgz.length)

    bot.sendFile(msg.channel, folder + imgz[rand],imgz[rand]);


    bot.sendMessage(msg.channel, "ITS REAL NIGGA HOURS BOIIIIIIIIIIIIIIII IF YOU AINT A FAKE NIGGA GET THE FUCK UP AND SMASH THAT LIKE BUTTON");

  }
}

Commands[ "ah" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var imgz = reloadImageCommand('ah');
    var folder = "resources/imagecommands/ah/";
    var rand = Math.floor(Math.random() * imgz.length)

    bot.sendFile(msg.channel, folder + imgz[rand],imgz[rand]);


    bot.sendMessage(msg.channel, "Does it feel good?");

  }
}


Commands[ "booty" ] = {
  oplevel: 0,
  allowed_channels: '134854230879109120',
  allowed_servers: 'all',
  cooldown: '5',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var imgz = reloadImageCommand('booty'); 
    var folder = "resources/imagecommands/booty/"; 
    var rand = Math.floor(Math.random() * imgz.length);

    bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);
  }
}

Commands[ "dab" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var imgz = reloadImageCommand('dab'); 
    var folder = "resources/imagecommands/dab/"; 
    var rand = Math.floor(Math.random() * imgz.length);

    bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);
  }
}



Commands[ "pic" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var imgz = reloadImageCommand('pic'); // Loads all images from the said folder found in "/resources/imagecommands"
    var folder = "resources/imagecommands/pic/"; // Folder to get pictures from. Must be the same name as the command.
    var rand = Math.floor(Math.random() * imgz.length);

    bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);
  }
}

Commands[ "rolldice" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 10,
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var roll = Math.floor(Math.random() * 6) + 1;

    bot.sendMessage(msg.channel, "<@" + msg.author.id + "> rolled a **" + roll + "** !");
    bot.stopTyping(msg.channel);
  }
}

Commands[ "Conchshell" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 10,
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var flip = Math.floor(Math.random() * 2) + 1;

    flip = ((flip == 1) ? 'Yes' : 'No');

    bot.sendMessage(msg.channel, "<@" + msg.author.id + ">  **" + flip + "** .");
    bot.stopTyping(msg.channel);
  }
}

Commands[ "Is" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 10,
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var flip = Math.floor(Math.random() * 2) + 1;

    flip = ((flip == 1) ? 'Yes' : 'No');

    bot.sendMessage(msg.channel, "<@" + msg.author.id + ">  **" + flip + "** .");
    bot.stopTyping(msg.channel);
  }
}

Commands[ "NappaSucks" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    bot.sendMessage(msg.channel, "<@" + 83629904356208640 + "> gonna get 9-1'd again?");


  }
}

Commands[ "RoastWat" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {

    bot.sendMessage(msg.channel, "<@" + "84100810870358016" + "> ur so bad you make monkey's look godlike.");


  }
}

Commands[ "Kitty" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var answers = [];
    var imgz = reloadImageCommand('Kitty');
    var folder = "resources/imagecommands/Kitty/";
    var rand = Math.floor(Math.random() * imgz.length)
        
      bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);
      var answer = "Here's kitty...."

    bot.sendMessage(msg.channel, "<@" + msg.author.id + "> *" + answer +"*");

  }
}

Commands[ "Waifu" ] = {
  oplevel: 7,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var imgz = reloadImageCommand('Waifu'); 
    var folder = "resources/imagecommands/Waifu/";
    var rand = Math.floor(Math.random() * imgz.length);
    var answer 
    answer = 'Your waifu is....'

    bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);

    bot.sendMessage(msg.channel, "<@" + msg.author.id + "> **" + answer + "**");

  }
}

Commands[ "Funny" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var imgz = reloadImageCommand('Funny'); 
    var folder = "resources/imagecommands/Funny/";
    var rand = Math.floor(Math.random() * imgz.length);

    bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);
  }
}

Commands[ "Joke" ] = {
  oplevel:0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var answers = [];
    answers.push({
      message: "What whould happen if the pilgrims had killed cats instead of turkeys?\nWe'd eat pussy every thanksgiving"
    })
    answers.push({
      message: "Q. What doesn't belong in this list : Meat, Eggs, Wife, Blowjob? A. Blowjob: You can beat your meat, eggs or wife, but you can't beat a blowjob."
    })
   
    answers.push({
      message: "Q. What do you call a dog with no legs?\n you can call it anything it wont come."
    })
    answers.push({
      message: "What does a dum call a dumpster.\n Bed and Breakfast"
    })
    answers.push({
      message: "Q: What did the doughnut say to the loaf of bread? A: If I had that much dough, I wouldn't be hanging around this hole."
    })
    answers.push({
      message: "Q: What do you call cheese that isnt yours?\n A: Nacho cheese"
    })
    answers.push({
      message: "I asked my grandma if she had ever tried 69.\n She said, No, but I have done 53 -- that's all the sailors I could screw in one night."
    }) 
    answers.push({
      message: "Why don't witches wear undies?\n To get a better grip on their brooms."
    })
    answers.push({
      message: "You're so stupid that you had to call 411 to get the number for 911."
    })
    answers.push({
      message: "A man cheats on his girlfriend Lorraine with a woman named Clearly.\nLorraine dies suddenly.\nAt the funeral, the man stands up and sings, I can see Clearly now, Lorraine is gone."
    })
    answers.push({
      message: "Q: Why did the forgetful chicken cross the road?\nA: To get to the other side -- er, no -- to go shopping -- no, not that either -- damn it."
    })
    answers.push({
      message: "Q: Why did the calf cross the road?\nA: To get to the udder side."
    })
    answers.push({
      message: "Q: Why did the one-handed man cross the road?\nA: To get to the second hand shop."
    })
    answers.push({
      message: "Q: Why did the monkey cross the road?\nA: So he could get spanked."
    })
    answers.push({
      message: "What's pink, 6 inches long, and makes my girlfriend cry when I put it in her mouth? Her miscarriage."
    })
     answers.push({
      message: "What's the difference between a Taliban outpost and a Pakistani elementary school?\nI don't know, I just fly the drone!"
    })
   
    var rand = Math.floor(Math.random() * answers.length)

    bot.sendMessage(msg.channel, "*" + answers[rand].message + "*")
  }
}


Commands[ "Kappa" ] = {
   oplevel: 0,
   allowed_channels: 'all',
   allowed_servers: 'all',
  cooldown: '1',
   fn: function( bot, msg, msgServer) {
    var answers = [];
    var imgz = reloadImageCommand('Kappa'); // Loads all images from the said folder found in "/resources/imagecommands"
    var folder = "resources/imagecommands/Kappa/"; // Folder to get pictures from. Must be the same name as the command.
    var rand = Math.floor(Math.random() * imgz.length);

    bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);
  }
}


Commands[ "Help" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    
    bot.sendMessage(msg.channel, "`Here's a list of all of the current commands!\nBitch, oplevel:2.\nPong, oplevel:2.\nMake4NoticeMe, oplevel:0.\ngcid oplevel:2.\nguid, oplevel:2.\ngsid, oplevel:2.\nsetName, oplevel:2.\nAiga, oplevel:0.\nrnh oplevel:0.\nah, oplevel:0.\nbooty, oplevel:0 (Restricted to #Booty).\ndab, oplevel:0.\nrolldice, oplevel:0.\nConchshell, oplevel:0.\nIs, oplevel:0.\nNappasucks, oplevel:0.\nRoastWat, oplevel:0.\nKitty, oplevel:0.\nWaifu, oplevel:0.\nFunny, oplevel:0.\nJoke, oplevel:0.(WARNING, The joke command conatins nsfw dirty and dark humor jokes. If you are faint-hearted or easily offended do not use this command)\nWhat does oplevel mean, OpLevel is simply who is able to and who isnt able to use certain commands, 0 = Anyone , 1 = Admins , 2 = Only Mai can use it. If any command is restricted to a channel or server it will be stated`");
  }
}


 
// Array of all reactions.
var Reactions = [];

/**
 * Reactions
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



Reactions[ "Do you love me?" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, msg, msgServer ) {

      var answers = [];
      answers.push({
        message: "HELL NO!"
      });
      answers.push({
        message: "I mean, you're nice and all."
      });
      answers.push({
        message: "M-maybe"
      });
      answers.push({
        message: "..."
      });
      answers.push({
        message: "WHAT YOU ARE DOING IN MY ROOM? GET OUT YOU PERVERT!"
      });

     var answer = answers[Math.floor(Math.random() * answers.length)];
      bot.sendMessage(msg.channel, answer.message);
      }
    }


Reactions[ "Fuck you" ] = {
  oplevel: 0,
  allowed_channels: 'all',
  allowed_servers: 'all',
  cooldown: 'none',
  fn: function( bot, msg, msgServer ) {

      var answers = [];
      answers.push({
        message: "What did you say to me :hocho:"
      });
      answers.push({
        message: "Ha, fuck me? Thats what your mom told me last night!"
      });
      answers.push({
        message: "W-wow, what did I do to you?;~;"
      });
      answers.push({
        message: "Hmph...."
      });
      answers.push({
        message: "Oh shut up already"
      });

      var answer = answers[Math.floor(Math.random() * answers.length)];
      bot.sendMessage(msg.channel, answer.message);
      


  }
}


Reactions[ "Kappa" ] = {
   oplevel: 0,
   allowed_channels: 'all',
   allowed_servers: 'all',
  cooldown: '1',
   fn: function( bot, msg, msgServer) {
    var answers = [];
    var imgz = reloadImageCommand('Kappa'); // Loads all images from the said folder found in "/resources/imagecommands"
    var folder = "resources/imagecommands/Kappa/"; // Folder to get pictures from. Must be the same name as the command.
    var rand = Math.floor(Math.random() * imgz.length);

    bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);
  }
}

Reactions[ "Keepo" ] = {
   oplevel: 0,
   allowed_channels: 'all',
   allowed_servers: 'all',
  cooldown: '1',
   fn: function( bot, msg, msgServer) {
    var answers = [];
    var imgz = reloadImageCommand('Keepo'); // Loads all images from the said folder found in "/resources/imagecommands"
    var folder = "resources/imagecommands/Keepo/"; // Folder to get pictures from. Must be the same name as the command.
    var rand = Math.floor(Math.random() * imgz.length);

    bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);
  }
}

Reactions[ "Kreygasm" ] = {
   oplevel: 0,
   allowed_channels: 'all',
   allowed_servers: 'all',
  cooldown: '1',
   fn: function( bot, msg, msgServer) {
    var answers = [];
    var imgz = reloadImageCommand('Kreygasm'); // Loads all images from the said folder found in "/resources/imagecommands"
    var folder = "resources/imagecommands/Kreygasm/"; // Folder to get pictures from. Must be the same name as the command.
    var rand = Math.floor(Math.random() * imgz.length);

    bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);
  }
}

Reactions[ "KappaPride" ] = {
   oplevel: 0,
   allowed_channels: 'all',
   allowed_servers: 'all',
  cooldown: '1',
   fn: function( bot, msg, msgServer) {
    var answers = [];
    var imgz = reloadImageCommand('KappaPride'); // Loads all images from the said folder found in "/resources/imagecommands"
    var folder = "resources/imagecommands/KappaPride/"; // Folder to get pictures from. Must be the same name as the command.
    var rand = Math.floor(Math.random() * imgz.length);

    bot.sendFile(msg.channel, folder + imgz[rand], imgz[rand]);
  }
}


//Clev



/**
 * === EVENT : Message Creation (Sent)  ===
 * *******************************************************************
 * DO NOT CHANGE ANYTHING IN HERE UNLESS YOU KNOW WHAT YOU'RE DOING!!!
 * *******************************************************************
 */
dbot.on("message", function (msg) {
  // Log Messages for DEV purposes
  // console.log(msg);

  if(!msg.channel.recipient) {
    // Global Variable across message reactions to get the server the message was taken from.
    var msgServer   = msg.channel.server.name;
    var serverRoles = getServerRoles(msg);
    var authorRoles = msg.channel.server.rolesOfUser(msg.author);
  }

  // Commands
  // DO NOT TOUCH UNLESS YOU KNOW WHAT YOU'RE DOING.
  for (var key in Commands) {
    if (Commands.hasOwnProperty(key)) {
      var params = msg.content.split(" "); // Divide text into distinct parameters.
      var command = params[0].toUpperCase();
      if(command === (CommandPrefix + key).toUpperCase() && msg.author.id !== dbot.user.id) {

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
            dbot.sendMessage(msg.channel, "Sorry! The `!" + key + "` command seems to be on cooldown.\nThe cooldown time is **" + Commands[key].cooldown + "** seconds.");
            COOLDOWNS['announce_cd_' + key] = true;
            removeCooldown('announce_cd_' + key);
          }
          dbot.deleteMessage(msg);
         } else {
          COOLDOWNS[key] = true;
          removeCooldown(key);
         }
        }

        // Run Command if it passed approval.
        if(!DENIAL_FLAG) {
          Commands[key].fn(dbot, params, msg, msgServer, serverRoles, authorRoles);
        }
      }
    }
  }



  // Reactions
  // Same as commands, but do not require a prefix (and tend to have cooldowns)
  // DO NOT TOUCH UNLESS YOU KNOW WHAT YOU'RE DOING.
  for (var key in Reactions) {
    if (Reactions.hasOwnProperty(key)) {
      var keygex = new RegExp(key, "i");
      if( keygex.test(msg.content) && msg.author.id !== dbot.user.id) {

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
          Reactions[key].fn(dbot, msg, msgServer);
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
dbot.on("messageDelete", function (channel, msg) {

  console.log("MESSAGE WAS DELETED BY " + (msg ? msg.author.username : channel.name));

});

/********************************************************************************************/

/**
 * === EVENT : Message Update/Editing  ===
 * @todo  Will soon have similar commands to the message events.
 * @todo  Will soon log edited messages. (THIS IS POLICE AS FUCK.)
 */
dbot.on("messageUpdate", function (msg, formerMsg) {

  console.log(msg.author.username, "changed", formerMsg.content, "to", msg.content);

});

/********************************************************************************************/

/**
 * === EVENT : User Addition to Server ===
 * @todo  Will soon send which server it happened on as well.
 */
dbot.on("serverNewMember", function (server, user) {
  console.log("new user", user);
});

/********************************************************************************************/

/**
 * === EVENT : User Removal from Server ===
 * @todo Will soon send which server it happened on as well.
 */
dbot.on("serverMemberRemoved", function (server, user) {
  console.log("left user", user);
});

/********************************************************************************************/

/**
 * === EVENT : User Information Change ===
 */
dbot.on("userUpdate", function (oldUser, newUser) {
  console.log(oldUser, "vs", newUser);
});

/********************************************************************************************/

/**
 * === EVENT : Channel Creation ===
 */
dbot.on("channelCreate", function(chann){
  console.log(chann);
})

/********************************************************************************************/

/* === Useful Functions === */
/* ******************************************************************* */
/* === ONLY TOUCH IF YOU KNOW WHAT YOU'RE DOING!!! === */
/* ******************************************************************* */

// Check invoker. If it's you, roll the command.
// @TODO - ROLE HANDLING INSTEAD OF ACCOUNT ID
function isGodMessage(message) {
  var author_id = message.author.id;
  if(author_id == GOD) {
    return true;
  } else {
    return false;
  }
}

// Check invoker. If it's a god, roll the command.
function isAdminMessage(message) {
  var author_id = message.author.id;
  if(ADMINS.indexOf(author_id) > -1 || author_id == GOD) {
    return true;
  } else {
    return false;
  }
}


// PM admin (aka me)
function pmme(message) {
  // Might be able to change this to a user for the channel resolvable.
  dbot.sendMessage(dbot.users.get("id", GOD), message);
}

// Reload Emotes
function reloadImageCommand(folder) {
  var f = [];

  var ifolder = "resources/imagecommands/" + folder;
  var files = fs.readdirSync(ifolder) ;

  for(var i in files) {
    f.push(files[i]);
  }

  console.log("Images reloaded for " + folder + " command.");

  return f;
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