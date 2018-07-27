# NodeJS Checker

This script checks the DMV California website every N minutes for short-term driving test appointments that are less than X days in the future (becoming available by other's cancellations). If there is a match, you'll be notified on Slack.

This automates the very tedious task of manually checking the DMV website for every single location again and again.

There are already some scripts available for that use case on GitHub. However, it looks like the DMV website has recently changed its request format and added an additional layer to prevent automatic data fetching, by providing a cookie via JavaScript which has to be included in every request. All these measures are included in this script so that it's fully compatible with the current DMV website (July 2018).

##### Setup

- list all offices in `offices.json` that you want to be checked. Currently, you'll have to lookup their IDs on the DMV form's HTML source
- fill out your form data (e.g. name, birthday, dl number, phone number) as well as the checking-interval and the latest appointment date to be notified in `config.js`. Also, provide your Slack webhook url for notifications
- get your cookie to enable automatic requests by opening the DMV form in a web browser and copying the cookie from the request with the browser developer tools and also paste it in `config.js`
- start script with `npm start`

##### Amount of requests

- in order to not send to many requests in short time to the DMV website, we only send one request every 2 seconds. That load should be similar to manually checking the website

##### Ideas for future improvements / PRs

- provide support for non-driving-test-appointments (simply call another API endpoint)
- automatically fill out office IDs or even find them with distance to you
- not only notify about free appointment but also book it

# Selenium Script
- this script is based on the following project: https://github.com/jappareti/ca-dmv-appointment-bot
- it is adjusted for driving test appointments instead of regular dmv appointments and checks several offices