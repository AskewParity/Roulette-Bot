# Roulette Bot
***
Roulette-Bot is a multipurpose Discord bot that does a variety of functions, specifically
> * Plays Music
> * Displays the rank and/or stats from the Brawlhalla API** 
> * Manages Roles (very limited as it was not developed to manage large servers)
> * React to messages using text, images, or reactions (emojis)
> * Has a minigame that is literally just rolling computer dice (RNG)

More information can be found in the help function (or section) of the bot

**The Brawlhalla API requires an API key that is not provided, nor does the code work when installed directly. Look to both the `index.js` and `commands/brawlhalla.js` files for instructions on how to activate the feature

## Setup
The discord bot requires a token to be used (to link it to your bot) 

This `TOKEN` may be found at the very bottom of `index.js`

### Brawlhalla API
1] Get your API Token and input it at the top of `commands/brawlhalla.js`

2] Remove `&& !file.startsWith('brawlhalla')` on line 14 of `index.js`

3] Uncomment line 75 in `index.js`

> The legends.json is outdated and the Brawlhalla API may have changed since the bot was implemented

***

> Many parts of the bot have been deprecated, some functions may not work as originally indended
