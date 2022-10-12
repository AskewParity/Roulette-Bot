module.exports = {
    name: 'textResponce',
    description: 'Only responds with text',

    execute(message, args, Discord) {
        //Returns if they win over some probability ([0, 1))
        function roulette(percent) {
            if(Math.random() > 1 - percent) 
                return "win with " + (percent * 100) + "% chance";
            return "lose with " + (percent * 100) + "% chance";
        }

        //retrives the first word (command) from the message
        const command = args.length === 0 ?  message.content.substring(1): message.content.substring(1, message.content.indexOf(" "));

            
        
        switch (command) {
            case 'roulette':
                message.channel.send(roulette(isNaN(args[0]) ? .5 : args[0]));
                break;
            case 'amadmin':
                if(message.member.permissions.has("ADMINISTRATOR")) message.channel.send(message.member.nickname + ' is an administrator');
                else message.channel.send(message.member.nickname + ' is NOT an administrator');
                break;
        }
    }
}
    