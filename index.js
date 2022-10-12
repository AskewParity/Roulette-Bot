//Integrate Discord modules into file
const Discord = require('discord.js');
//Integrate fs
const fs = require('fs');
//Instance of ^^
const client = new Discord.Client();
const {MessageButton} = require('discord-buttons');
require('discord-buttons')(client);
//Prefix
const prefix = '['

//collection of commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js') && !file.startsWith('brawlhalla')); // brawlhalla key not entered yet


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

//Notification for the bot becoming online
client.once('ready', () => {
    console.log("| RouletteBot is ONLINE |")
})
client.once('disconnect', () => {
    console.log('| RouletteBot is OFFLINE |');
});

client.on('message', async message => {

    //Safety => that the bot is on
    if (message.author.bot) return;

    client.commands.get('reactions').execute(message);

    //checks if this bot was called
    if (!message.content.startsWith(prefix)) {
        client.commands.get('track').execute(message, null, Discord, false);
        return;
    }


    //splices commands by spaces
    const args = message.content.slice(prefix.length).split(/ +/);




    //shifts commands to lower case
    const command = args.shift().toLowerCase();


    if (command == 'help') client.commands.get('help').execute(message, args, Discord);

    //Commands
    if (command === 'test')
        client.commands.get('test').execute(message, args, Discord);
    else if (command === 'roulette' || command === 'amadmin')
        client.commands.get('textResponce').execute(message, args, Discord);
    else if (command === 'becomeperson')
        client.commands.get('roleManager').execute(message, args, Discord);
    else if (command === 'icon')
        client.commands.get('imageResponce').execute(message, args, Discord);
    else if (command === 'track' || command === 'amount')
        client.commands.get('track').execute(message, args, Discord, true);
    else if (command === 'join' || command === 'leave' || command === 'play'
        || command === 'skip' || command === 'queue' || command === 'remove' ||
        command === 'pause' || command === 'resume' || command === 'songinfo' ||
        command === 'skipto')
        client.commands.get('music').execute(message, args, Discord, client);
    else if(command === 'rank' || command === 'stats' || command === 'btest')
        console.log("not implemented yet");
        //client.commands.get('brawlhalla').execute(message, args, Discord, client);




})
//TOKEN
client.login('INPUT TOKEN HERE');