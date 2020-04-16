#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const spinner = require("ora")();
const chalk = require("chalk");
const figlet = require("figlet");
const clear = require("clear");
const user = os.homedir();
clear();

console.log(
  chalk.magenta(figlet.textSync("klean", { horizontalLayout: "full" }))
);
console.log();

let slack = `${user}\\AppData\\Roaming\\Slack\\Cache`;
let chrome = `${user}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache`;
let discord = `${user}/AppData/Roaming/discord/Cache`;
let discord_canary = `${user}/AppData/Roaming/discordcanary/Cache`;
let discord_ptb = `${user}/AppData/Roaming/discordptb/Cache`;

if (os.platform() === "linux") {
  chrome = `${user}/.cache/google-chrome/Default/Cache/`;
  slack = `${user}/.config/Slack/Cache`;
  discord = `${user}/.config/discord/Cache`;
  discord_canary = `${user}/.config/discordcanary/Cache`;
  discord_ptb = `${user}/.config/discordptb/Cache`;
}
if (os.platform() === "darwin") {
  chrome = `${user}/Library/Application\ Support/Google/Chrome/Default/Application\ Cache/Cache`;
  slack = `${user}/Library/Application Support/Slack/Cache`;
  discord = `${user}/Library/Application Support/discord/Cache`;
  discord_canary = `${user}/Library/Application Support/discordcanary/Cache`;
  discord_ptb = `${user}/Library/Application Support/discordptb/Cache`;
}
const cachesDirs = [
  { name: "slack", path: slack },
  { name: "chrome", path: chrome },
  { name: "discord", path: discord },
  { name: "discord_canary", path: discord_canary },
  { name: "discord_ptb", path: discord_ptb },
];
// get cached media size
const cacheChecker = (dir) => {
  const files = fs.readdirSync(dir);
  const sum = files.reduce((sum, file) => {
    sum += fs.statSync(dir + "\\" + file).size;
    return sum;
  }, 0);
  return sum;
};

const getTotalSize = () => {
  let total = 0;
  cachesDirs.forEach((cacheDir) => {
    if (fs.existsSync(cacheDir.path)) {
      total += cacheChecker(cacheDir.path);
    }
  });
  if (total.toString().length > 6)
    return Math.floor(total / (1024 * 1024)).toString() + " Mbs";
  if (total.toString().length <= 6)
    return Math.floor(total / 1024).toString() + " Kbs";
};
// delete cached media from the system
const deleteCache = () => {
  try {
    cachesDirs.forEach((cacheDir) => {
      if (fs.existsSync(cacheDir.path)) {
        const files = fs.readdirSync(cacheDir.path);
        files.forEach((file) => {
          fs.unlinkSync(cacheDir.path + "\\" + file);
        });
      }
    });
    spinner.succeed("Done");
  } catch (error) {
    console.log(`You should close open applications to clean everything `);
    process.exit(0);
  }
};
console.log("Found", chalk.green(getTotalSize()), "of cached media");
console.log(chalk.yellowBright("starting clean up process.." + "\n"));
deleteCache();
