#!/usr/bin/env node
const chalk = require("chalk")
const figlet = require("figlet")
const clear = require("clear")
const readline = require("readline")
const { helper } = require("../lib/klean")
const { getTotalSizeAsync, deleteCacheAsync } = require("../src/utils/index")

clear();
console.log(chalk.magenta(figlet.textSync("klean", { horizontalLayout: "full" })));
console.log();
helper();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const run = async () => {
  const size = await getTotalSizeAsync();

  if (size != "OB") {
    console.log("Found", chalk.green(size), "of cached media");
    console.log(chalk.yellowBright("Starting cleanup process...\n"));

    rl.question(chalk.yellowBright("Do you want to proceed with the cleanup? (Y/N): "), (answer) => {
      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        deleteCacheAsync();
      } else {
        console.log(chalk.yellowBright("Cleanup process canceled."));
        process.exit(0);
      }
      rl.close();
    });
  } else {
    console.log(chalk.green("No cached media found"));
    process.exit(0);
  }
}

run()
