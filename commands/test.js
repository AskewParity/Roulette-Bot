module.exports = {
    name: 'test',
    description: 'A test to see if the bot is online or to display information through the console',

    execute(message, args, Discord) {


        message.channel.send('success');
    }
}