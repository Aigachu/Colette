// Requires the use of Needle.
needle = require('needle');

// @TODO - DOCUMENTATION

module.exports = function(client_id) {
  this.streamIsOnline = function(channel, callback) {
    if (!client_id) {
      return;
    }
    var options = {
      headers: {
        'Client-ID': client_id, // twitch api client id
        'Accept': 'application/vnd.twitchtv.v3+json'
      }
    };
    needle.get('https://api.twitch.tv/kraken/streams/' + channel, options, function(err, res) {
      if (err) {
        throw err;
      }
      var data = {
        stream: res.body.stream,
        stream_channel: channel, 
        stream_link: 'http://twitch.tv/' + channel
      };
      if (callback) {
        callback(data);
      }
    });
  }
  //@TODO-MORE FUNCTIONS
};

