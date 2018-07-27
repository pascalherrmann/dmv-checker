const cheerio = require("cheerio");

const config = require("./config.json");

module.exports.extractDate = function(response) {
  const $ = cheerio.load(response);

  const dateRaw = $("p")
    .filter(function() {
      return (
        $(this)
          .text()
          .indexOf("The first available appointment for this office is on") > -1
      );
    })
    .next()
    .text();

  const dateString = dateRaw.replace(" at ", " ");

  return dateString;
};

module.exports.getDMVOptions = function(office) {
  const options = {
    url: "https://www.dmv.ca.gov/wasapp/foa/findDriveTest.do",
    form: {
      numberItems: "1",
      mode: "DriveTest",
      officeId: office.id,
      requestedTask: "DT",
      safetyCourseCompletedSelection: "FALSE",
      firstName: config.appointmentInfo.firstName,
      lastName: config.appointmentInfo.lastName,
      dlNumber: config.appointmentInfo.dlNumber,
      birthMonth: config.appointmentInfo.birthMonth,
      birthDay: config.appointmentInfo.birthDay,
      birthYear: config.appointmentInfo.birthYear,
      telArea: config.appointmentInfo.telArea,
      telPrefix: config.appointmentInfo.telPrefix,
      telSuffix: config.appointmentInfo.telSuffix,
      resetCheckFields: "true"
    },
    headers: {
      Connection: "keep-alive",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Referer: "https://www.dmv.ca.gov/wasapp/foa/startDriveTest.do",
      "Cache-Control": "max-age=0",
      Origin: "https://www.dmv.ca.gov",
      "Upgrade-Insecure-Requests": "1",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
      Cookie: config.cookie
    },
    method: "POST",
    gzip: true
  };

  return options;
};
