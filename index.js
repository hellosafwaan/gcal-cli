"use strict";
const { program } = require("commander");
const { addEvent } = require("./add");

program.version("1.0.0").description("Google Calendar CLI");

program
  .command("add <eventStart> <eventEnd> <title> <desc>")
  .alias("a")
  .description("Adds a new event to the calendar")
  .action((eventStart, eventEnd, title, desc) => {
    addEvent(eventStart, eventEnd, title, desc);
  });
program.parse(process.argv);
