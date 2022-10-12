const fs = require('fs');
const read = require('./help.json');

const commandMap = new Map();

for (let val of read) {
    commandMap.set(val.cmd, val.info);
}

module.exports = {
    name: 'help',
    description: 'In-Channel Documentation of the bot',

    execute(message, args, Discord) {
        //retrives the first word (command) from the message
        const command = args.length === 0 ? message.content.substring(1) : message.content.substring(1, message.content.indexOf(" "));



        if (args[0] == null) {
            message.channel.send(new Discord.MessageEmbed()
                .setColor('#0066ff')
                .setTitle('<:rbear:871068737984417792> RouetteBot Command Information')
                .setDescription("Use `.help <command>` for more info on a command.")
                .addField('Test', 'A test to see if the bot is online or to display information through the console')
                .addField('Text Responce', 'Only responds with text\n`roulette <probability>` `amadmin`')
                .addField('Image Responce', 'Commands that may respond with Images, Attatchments, and/or Embeds\n`title`')
                .addField('Music', 'Audio Commands\n`join` `leave` `play <song>` `skip` `queue` `remove <int>` `pause` `resume` `songinfo`\n`skipto`')
                .addField('Reactions', 'Reacts to messages without Commands\n')
                .addField('Role Manager', 'Commands that may change the roles a user posseses\n`becomeperson`')
                .setFooter('This is very much a Work in Progress - Christopher Lee'));
        } else {
            if (commandMap.get(args[0])) {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('#0066ff')
                    .setTitle('RouetteBot Command Information')
                    .addField(args[0], commandMap.get(args[0]))
                    .setFooter('This is very much a Work in Progress - Christopher Lee'));
            } else {
                message.reply(`no command found named \`${args[0]}\``);
            }
        }
    }
}
