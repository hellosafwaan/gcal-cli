const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const { DateTime } = require("luxon");
require('dotenv').config()
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const oAuth2Client = new OAuth2(clientId, clientSecret);
oAuth2Client.setCredentials({
  refresh_token:
    process.env.REFRESH_TOKEN,
});

const calendar = google.calendar({
  version: "v3",
  auth: oAuth2Client,
});

const insertCallback = function (err, event) {
  if (err) {
    console.log("There was error", err);
    return;
  }
  console.log("event created");
};
const parseDateTime = function (eventDateTime) {
  const date = eventDateTime.split("/");
  const time = date.pop().split(":");
  return [date, time];
};
const setDateTime = function (currDateTime, eventDateTime) {
  const [date, time] = parseDateTime(eventDateTime);
  const DateTime = currDateTime.set({
    year: date[2] || currDateTime.year,
    month: date[1] || currDateTime.month,
    day: date[0] || currDateTime.day,
    hour: time[0],
    minute: time[1] || 0,
    second: 0,
    millisecond: 0,
  });
  console.log(DateTime.toString());
  return DateTime;
};
const createEvent = function (eventStart, eventEnd, summary, description) {
  const currDateTime = DateTime.now();
  return {
    summary: summary,
    description: description,
    start: {
      dateTime: setDateTime(currDateTime, eventStart),
    },
    end: {
      dateTime: setDateTime(currDateTime, eventEnd),
    },
    colorId: 1,
  };
};

const addEvent = function (eventStart, eventEnd, title, desc) {
  calendar.events.insert(
    {
      auth: oAuth2Client,
      calendarId: "primary",
      resource: createEvent(eventStart, eventEnd, title, desc),
    },
    insertCallback
  );
};

module.exports = {
  addEvent,
};
