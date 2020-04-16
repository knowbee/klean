#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const spinner = require("ora")();
const chalk = require("chalk");
const figlet = require("figlet");
const clear = require("clear");
clear();

console.log(
  chalk.magenta(figlet.textSync("figlet", { horizontalLayout: "full" }))
);

const slack = os.homedir() + "\\AppData\\Roaming\\Slack\\Cache";
const chrome =
  os.homedir() + "\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache";

const cachesDirs = [
  { name: "slack", path: slack },
  { name: "chrome", path: chrome },
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
    total += cacheChecker(cacheDir.path);
  });
  if (total.toString().length > 6)
    return Math.floor(total / (1024 * 1024)).toString() + " Mbs";
  if (total.toString().length <= 6)
    return Math.floor(total / 1024).toString() + " Kbs";
};
// delete cached media from the system
const deleteCache = () => {
  spinner.start("starting clean up process.." + "\n");

  try {
    cachesDirs.forEach((cacheDir) => {
      const files = fs.readdirSync(cacheDir.path);
      files.forEach((file) => {
        fs.unlinkSync(cacheDir.path + "\\" + file);
      });
      console.log("cleaning ", cacheDir.name);
    });
    spinner.succeed("Done");
  } catch (error) {
    console.log(`You should close open applications to clean everything `);
    process.exit(0);
  }
};
console.log("Found", getTotalSize(), "of cached media");
deleteCache();
