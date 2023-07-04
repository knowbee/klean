#!/usr/bin/env node
const fs  = require( "fs")
const os  = require( "os")
const ora  = require( "ora")
const chalk  = require( "chalk")
const figlet  = require( "figlet")
const clear  = require( "clear")
const path  = require( "path")
const readline  = require( "readline")
const { helper }  = require( "./lib/klean")

const user = path.join(os.homedir()).split("\\").join("/");

clear();
console.log(chalk.magenta(figlet.textSync("klean", { horizontalLayout: "full" })));
console.log();
helper();

let slack = `${user}/AppData/Roaming/Slack/Cache`;
let chrome = `${user}/AppData/Local/Google/Chrome/User Data/Default/Cache`;
let discord = `${user}/AppData/Roaming/discord/Cache`;
let discord_canary = `${user}/AppData/Roaming/discordcanary/Cache`;
let discord_ptb = `${user}/AppData/Roaming/discordptb/Cache`;
let notion = `${user}/AppData/Roaming/Notion/Cache`;
let microsoft_edge = `${user}/AppData/Local/Microsoft/Edge/User Data/Default/Cache`;

if (os.platform() === "linux") {
  chrome = `${user}/.cache/google-chrome/Default/Cache/`;
  slack = `${user}/.config/Slack/Cache`;
  discord = `${user}/.config/discord/Cache`;
  discord_canary = `${user}/.config/discordcanary/Cache`;
  discord_ptb = `${user}/.config/discordptb/Cache`;
  notion = `${user}/.config/Notion/Cache`;
  microsoft_edge = `${user}/.cache/microsoft-edge-dev/Default/Cache`;
}
if (os.platform() === "darwin") {
  chrome = `${user}/Library/Application\\ Support/Google/Chrome/Default/Application\\ Cache/Cache`;
  slack = `${user}/Library/Application Support/Slack/Cache`;
  discord = `${user}/Library/Application Support/discord/Cache`;
  discord_canary = `${user}/Library/Application Support/discordcanary/Cache`;
  discord_ptb = `${user}/Library/Application Support/discordptb/Cache`;
  notion = `${user}/Library/Application Support/Notion/Cache`;
  microsoft_edge = `${user}/Library/Caches/Microsoft\\ Edge/Default/Cache`;
}
const cachesDirs = [
  { name: "Slack", path: slack },
  { name: "Chrome", path: chrome },
  { name: "Discord", path: discord },
  { name: "Discord Canary", path: discord_canary },
  { name: "Discord PTB", path: discord_ptb },
  { name: "Notion", path: notion },
  { name: "Microsoft Edge", path: microsoft_edge },
];

// Get cached media size
const cacheChecker = (dir) => {
  const files = fs.readdirSync(dir);
  const sum = files.reduce((sum, file) => {
    sum += fs.statSync(path.join(dir, file)).size;
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
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (total === 0) {
    console.log(chalk.green("No cached media found. You are safe!"));
    process.exit(0);
  }
  const i = parseInt(Math.floor(Math.log(total) / Math.log(1024)));
  if (i === 0) return `${total} ${sizes[i]}`;
  return `${(total / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

// Delete cached media from the system
const deleteCache = () => {
  try {
    cachesDirs.forEach((cacheDir) => {
      if (fs.existsSync(cacheDir.path)) {
        const files = fs.readdirSync(cacheDir.path);
        const spinner = ora(`Cleaning ${cacheDir.name} cache...`).start();
        files.forEach((file) => {
          const filePath = path.join(cacheDir.path, file);
          if (fs.lstatSync(filePath).isDirectory()) {
            // Delete hidden folders inside cached dirs
            fs.rmdirSync(filePath, { recursive: true });
          } else {
            fs.unlinkSync(filePath);
          }
        });
        spinner.succeed(`Finished cleaning ${cacheDir.name} cache`);
      }
    });
    ora().succeed("Cleanup completed");
  } catch (error) {
    console.log(chalk.red("An error occurred while cleaning the cache:"));
    console.error(error);
    console.log(chalk.yellowBright("Please close any open applications to delete everything."));
    process.exit(1);
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Found", chalk.green(getTotalSize()), "of cached media");
console.log(chalk.yellowBright("Starting cleanup process...\n"));

rl.question(chalk.yellowBright("Do you want to proceed with the cleanup? (Y/N): "), (answer) => {
  if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
    deleteCache();
  } else {
    console.log(chalk.yellowBright("Cleanup process canceled."));
    process.exit(0);
  }
  rl.close();
});
