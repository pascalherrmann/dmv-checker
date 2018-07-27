const fs = require("fs");

const { expect } = require("chai");
const { getDMVOptions, extractDate } = require("../DMVClient");

describe("Should correctly comply to DMV API", function() {
  describe("Should find date in HTML", function() {
    it("find date", function(done) {
      fs.readFile(__dirname + "/mocks/mockDMVresponse.html", function(
        err,
        data
      ) {
        if (err) {
          throw err;
        }
        const dateString = extractDate(data.toString());
        expect(dateString).to.equal(
          "\n\t\t\t\t\t\t\t\t\tTuesday, September 25, 2018 10:20 AM \n\t\t\t\t\t\t\t\t"
        );
        done();
      });
    });
  });
});
