module.exports = {
    name: 'roleManager',
    description: 'Deals with granting or removing rolls',

    execute(message, args, Discord) {
        //retrives the first word (command) from the message
        const command = args.length === 0 ?  message.content.substring(1): message.content.substring(1, message.content.indexOf(" "));

        let personRole = message.guild.roles.cache.find(r => r.name === "person");

        switch (command) {
            case 'becomeperson':
                if(message.member.roles.cache.some(r => r.name === "person")) {
                    message.channel.send(message.member.nickname + ' is already a person');
                } else {
                    message.channel.send(message.member.nickname + ' is now a person');
                    message.member.roles.add(personRole);
                }
                break;
        }
    }
}
    