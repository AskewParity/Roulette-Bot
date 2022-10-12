const fs = require('fs');
const read = require('./tracked.json');

const map = new Map(Object.entries(read));

const numToMonth = new Map([
    [1, 'January'],
    [2, 'February'],
    [3, 'March'],
    [4, 'April'],
    [5, 'May'],
    [6, 'June'],
    [7, 'July'],
    [8, 'August'],
    [9, 'September'],
    [10, 'October'],
    [11, 'November'],
    [12, 'December']
]);

module.exports = {
    name: 'track',
    description: 'Tracks anything the user requests',

    execute(message, args, Discord, cmd) {

        if (cmd) {
            //retrives the first word (command) from the message
            const command = args.length === 0 ? message.content.substring(1) : message.content.substring(1, message.content.indexOf(" "));

            const str = args.join(' ');

            switch (command) {
                case 'track':
                    if (args != '') {
                        if(map.get(str)) 
                            return message.channel.send(`Already tracking "${str}"!`);
                        
                        const today = new Date;
                        const time = {
                            year: today.getFullYear(),
                            month: today.getMonth() + 1,
                            day: today.getDate(),
                            hour: today.getHours(),
                            minute: today.getMinutes(),
                            second: today.getSeconds()
                        };
                        map.set(str, { date: time, count: 0 });

                        message.channel.send(`Now tracking "${str}"!`);
                    } else {
                        message.channel.send('No phrase to track!');
                    }
                    break;
                case 'amount':
                    let info = map.get(str);

                    if (info) {

                        let mDate = info.date;

                        let date = numToMonth.get(mDate.month) + ' ' + mDate.day + ', ' +
                            mDate.year + ' ' + mDate.hour + ':' + mDate.minute + ':' + mDate.second;

                        let dateStr = `Count: ${info.count}\nSince: ${date}`;

                        const embed = new Discord.MessageEmbed()
                            .setColor('#0066ff')
                            .setTitle(`<:rbear:871068737984417792> Tracked Phrase`)
                            .addFields(
                                { name: str, value: dateStr},
                            )
                            .setFooter('*only when RouletteBot is online\n*not including commands from RouletteBot\nThis is very much a Work in Progress - Christopher Lee');

                        message.channel.send(embed);
                    } else {
                        message.channel.send(`"${key}" not tracked`)
                    }
                    break;
            }
        } else {
            let arr = message.content.split(/ +/);
            for (let arg of arr) {
                if (map.get(arg)) {
                    map.get(arg).count++;
                }
            }
        }



        fs.writeFile('./commands/tracked.json', JSON.stringify(Object.fromEntries(map)), err => {
            if (err) {
                console.log('Error writing file', err)
            }
        })
    }
}
