const req = require("request");

const config = require("./config.json");
const offices = require("./offices.json");

const { sendSlackMessage } = require("./SlackClient");
const { getDMVOptions, extractDate } = require("./DMVClient");
const { formatDate } = require("./Helpers");

// we wait 2 seconds between every request (similiar load to manual checking)
const msPerRequest = 2000;
var alreadyNotified = {};
var counter = 0;

startLoop();

function startLoop() {
  console.log(
    `\nSearching for DMV appointments in the next ${
      config.checkingConfig.maxDaysInFuture
    } days.\nChecking every ${
      config.checkingConfig.checkIntervalMinutes
    } Minute(s) at ${offices.length} office locations.`
  );

  checkAllOffices();
  var interval = config.checkingConfig.checkIntervalMinutes * 60 * 1000;
  setInterval(function() {
    checkAllOffices();
  }, interval);
}

function checkAllOffices() {
  counter++;
  console.log(`\n\nCheck #${counter}`);
  for (let i = 0; i < offices.length; i++) {
    setTimeout(function() {
      checkOffice(offices[i]);
    }, msPerRequest * i);
  }
}

function checkOffice(office) {
  const options = getDMVOptions(office);
  req.post(options, function(e, r, body) {
    if (e) {
      console.log(e);
      return;
    } else if (
      body.includes(
        "Sorry, no appointment is available for the date and/or time entered. Please make another selection."
      )
    ) {
      console.log("All future appointments are already taken.");
      return;
    }

    const dateString = extractDate(body);
    const date = new Date(Date.parse(dateString));
    const dateFormatted = formatDate(date);
    const timeDiff = date - new Date();
    const daysUntil = Math.floor(timeDiff / 1000 / 60 / 60 / 24);
    const match = daysUntil <= config.checkingConfig.maxDaysInFuture;
    const hashString = `${office.name}/${daysUntil}`;
    const notify = !(hashString in alreadyNotified);

    const infoMessage = `DMV ${
      office.name
    }: ${dateFormatted} (${daysUntil} days) ${match ? "✅" : ""} ${
      match && notify ? "📩" : ""
    }`;
    console.log(infoMessage);

    if (match && notify) {
      // don't send notifications for the same day!
      alreadyNotified[hashString] = true;
      sendSlackMessage(
        config.checkingConfig.slackWebHook,
        `:white_check_mark: New DMV-match for ${
          office.name
        }: ${dateFormatted} (in ${daysUntil} days!)`
      );
    }
  });
}
