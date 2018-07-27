var req = require("request");

function sendSlackMessage(webhook, message) {
  req.post(
    {
      url: webhook,
      json: {
        text: message
      },
      headers: {
        "Content-type": "application/json"
      }
    },
    function(err, httpResponse, body) {
      if (err) {
        console.log(err);
      }
    }
  );
}

module.exports.sendSlackMessage = sendSlackMessage;
