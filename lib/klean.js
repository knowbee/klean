const { Command } = require("commander");
const klean = new Command();

module.exports = {
  helper: () => {
    klean
      .name("klean")
      .description(
        `
        **klean** A simple cache remover
        `
      )
      .version("1.0.5")
      .parse(process.argv);
    klean.on("--help", () => {
      console.log("How to use klean:");
      console.log("  $ klean --help");
      console.log("  $ klean");
    });
  }
}

