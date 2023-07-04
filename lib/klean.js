const  {Command}  = require("commander");
const klean = new Command();

module.exports = {
  helper : () => {
    klean
      .name("klean")
      .description(
        `
        **klean** sensitive data can lead to your downfall, do the right thing and delete them
        `
      )
      .version("1.0.2")
      .parse(process.argv);
    klean.on("--help", () => {
      console.log("How to use klean:");
      console.log("  $ klean --help");
      console.log("  $ klean");
    });
  }
}

