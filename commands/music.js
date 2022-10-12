const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { StreamDispatcher } = require('discord.js');
let queue = new Array();
let audio;



module.exports = {
    name: 'music',
    description: 'Audio commands',

    async execute(message, args, Discord, client) {
        //retrives the first word (command) from the message
        const command = args.length === 0 ? message.content.substring(1) : message.content.substring(1, message.content.indexOf(" "));

        const userVC = message.member.voice.channel;

        let clinetVC = client.voice.connections.first();

        function secondsToDisplay(seconds) {
            return Math.floor(seconds / 60) + ':' + (seconds % 60 < 10 ? '0' + seconds % 60 : seconds % 60);
        }


        async function play(video, connection) {
            if (video === null) return;

            const stream = await ytdl(video.url, { filter: 'audioonly' });

            await message.channel.send(`<:onionsalute:684224884582121512> Now Playing \`${video.title}\``);

            audio = connection.play(stream, { seek: 0, volume: 2 })
                .on('finish', () => {
                    queue.shift();
                    if (queue.length == 0) {
                        queue[0] = null;
                        userVC.leave();
                    }
                    else play(queue[0], connection);
                });
        }

        async function skip() {
            if (queue[0])
                message.channel.send(`Removed \`${queue[0].title}\``);
            else
                return message.channel.send('There is no song to skip!');

            queue.shift();
            if (queue.length != 0)
                play(queue[0], clinetVC);
            else
                clinetVC.disconnect();
        }


        switch (command) {
            case 'join':
                if (!userVC)
                    return message.channel.send("You need to be in a voice channel to play music!");
                userVC.join().then(() => {
                    message.channel.send("Successfully connected.");
                }).catch(e => {
                    console.error(e);
                });

                break;
            case 'leave':
                if (!userVC)
                    return message.channel.send("You need to be in a voice channel for me to leave");

                userVC.leave();
                queue.length = 0;
                playing = false;
                message.channel.send("Successfully disconnected.");

                break;
            case 'play':
                if (!clinetVC) {
                    if (userVC)
                        clinetVC = await userVC.join();
                    else
                        return message.channel.send("I need to be in a voice channel to play music!");
                }

                if (!args)
                    return message.channel.send("Please specfy what song to play")


                //function
                const videoFinder = async (query) => {
                    message.channel.send(`Searching YT for \`${query}\``);

                    const videoResult = await ytSearch(query);

                    return videoResult.videos.length ? videoResult.videos[0] : null;
                }

                const video = await videoFinder(args.join(' '));

                if (video) {


                    if (!queue[0]) {

                        queue.push(video);

                        playing = true;

                        return play(queue[0], clinetVC);


                    } else {
                        queue.push(video);
                        return message.channel.send(`<:onionsalute:684224884582121512>  Added \`${video.title}\` to the queue`);
                    }
                } else {
                    return message.reply('no video found');
                }
            case 'skip':
                return skip();
            case 'skipto':
                if (!args)
                    message.channel.send('No number to skip to');
                else if (isNaN(args[0]))
                    message.channel.send('Must be an integer');
                else if (args[0] < 1 || args[0] > queue.length)
                    message.channel.send(`Number must be between (1-${queue.length})`);

                for (i = 1; i < args[0]; i++)
                    queue.shift();

                play(queue[0], clinetVC);
                message.channel.send(`Skipped to \`${queue[0].title}\``)
                break;
            case 'pause':
                if (queue[0]) {
                    message.channel.send(`Paused \`${queue[0].title}\``)
                    audio.pause()
                } else message.channel.send('No Song to Pause!')
                break;
            case 'resume':
                if (queue[0]) {
                    message.channel.send(`Resumed \`${queue[0].title}\``)
                    audio.resume();
                }
                break;
            case 'queue':
                if (!queue[0])
                    return message.channel.send('No Songs in Queue!');
                {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#0066ff')
                        .setTitle('<:rbear:871068737984417792> Music Queue')
                        .setFooter('This is very much a Work in Progress - Christopher Lee');

                    for (let i = 0; i < queue.length; i++)
                        embed.addField(`${i + 1}: ${queue[i].title}`, queue[i].url);


                    return message.channel.send(embed);
                }
            case 'songinfo':
                if (!queue[0])
                    return message.channel.send('No Songs in Queue!');

                const song = queue[0];
                {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#0066ff')
                        .setTitle('<:rbear:871068737984417792> Current Song')
                        .addFields(
                            { name: '\u200B', value: `[${song.title}](${song.url})` },
                            { name: `\`${secondsToDisplay(Math.floor(audio.streamTime / 1000))} / ${song.timestamp}\``, value: '\u200B' }
                        )
                        .setThumbnail(song.thumbnail)
                        .setFooter('This is very much a Work in Progress - Christopher Lee');


                    message.channel.send(embed);
                }
                break;
            case 'remove':
                if (!args[0] || isNaN(args[0]) || args[0] < 1 || args[0] > queue.length)
                    return message.reply(`Please enter 1 number from range (1 - ${queue.length})`);
                if (args[0] == 1) return skip();
                else {
                    message.reply(`Removed ${queue[args[0] - 1].title}`);
                    queue.splice(args[0] - 1, 1);
                }
        }
    }
}
