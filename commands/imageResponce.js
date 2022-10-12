module.exports = {
    name: 'imageResponce',
    description: 'Commands that may respond with Images, Attatchments, and/or Embeds',

    execute(message, args, Discord) {

        //retrives the first word (command) from the message
        const command = args.length === 0 ? message.content.substring(1) : message.content.substring(1, message.content.indexOf(" "));

        const icon = new Discord.MessageAttachment('././images/icon.jpg')

        switch (command) {
            case 'icon':
                message.channel.send(icon);
                break;
        }
    }
}
