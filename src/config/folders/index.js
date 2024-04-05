const path = require("path")
const os = require("os")

const user = path.join(os.homedir()).split("\\").join("/");


let slack = `${user}/AppData/Roaming/Slack/Cache`;
let chrome = `${user}/AppData/Local/Google/Chrome/User Data/Default/Cache`;
let discord = `${user}/AppData/Roaming/discord/Cache`;
let discord_canary = `${user}/AppData/Roaming/discordcanary/Cache`;
let discord_ptb = `${user}/AppData/Roaming/discordptb/Cache`;
let notion = `${user}/AppData/Roaming/Notion/Cache`;
let microsoft_edge = `${user}/AppData/Local/Microsoft/Edge/User Data/Default/Cache`;
let xcode = `${user}/Library/Developer/Xcode/Archives/*/*`;


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
  xcode = `${user}/Library/Developer/Xcode/Archives/`;
}
const cachesDirs = [
  { name: "Slack", path: slack },
  { name: "Chrome", path: chrome },
  { name: "Discord", path: discord },
  { name: "Discord Canary", path: discord_canary },
  { name: "Discord PTB", path: discord_ptb },
  { name: "Notion", path: notion },
  { name: "Microsoft Edge", path: microsoft_edge },
  { name: "Xcode", path: xcode },
];

module.exports = {
  cachesDirs,
};
