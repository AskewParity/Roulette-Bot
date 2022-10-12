const bh = require('brawlhalla-api')('INPUT YOUR API KEY HERE');
const fs = require('fs');
const read = require('./legends.json');

const { MessageButton } = require('discord-buttons');
numForm = new Intl.NumberFormat('en-US')
function form(num) {
    return numForm.format(num);
}

function addZero(num) {
    if (num < 10)
        return '0' + num;
    return num;
}

function toHours(sec) {
    return `${Math.floor(sec / 3600)}h ${addZero(Math.floor((sec % 3600) / 60))}m ${addZero(sec % 60)}s`
}

const weapons = new Map();

for (let l of read) {
    weapons.set(l.legend_id, [l.weapon_one, l.weapon_two]);
}


module.exports = {
    name: 'brawlhalla',
    description: 'Brawlhalla related commands',

    execute(message, args, Discord, client) {

        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        if (!args[0])
            return message.channel.send("No player to search for!");


        //retrives the first word (command) from the message
        const command = args.length === 0 ? message.content.substring(1) : message.content.substring(1, message.content.indexOf(" "));


        switch (command) {
            case 'rank':
                bh.getBhidByName(args.join(' ')).then(function (users) {

                    let pages = [];
                    bhid = users;

                    function operation() {

                        if (pages.length === bhid.length) {
                            function compare(a, b) {
                                if (a.rank > b.rank) return 1;
                                if (a.rank < b.rank) return -1;
                                return 0;
                            }

                            pages.sort(compare);

                            let index = 0;
                            let b1 = new MessageButton()
                                .setStyle('green')
                                .setID('1')
                                .setLabel('◀');
                            let b2 = new MessageButton()
                                .setStyle('green')
                                .setID('2')
                                .setLabel('▶');

                            let buttonarr = [b1, b2];

                            message.channel.send({ embed: pages[0].e, buttons: buttonarr }).then(msg => {
                                const collector = msg.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 60e3 });
                                collector.on('collect', b => {
                                    b.reply.defer();
                                    if (b.id == '1' && index > 0) {
                                        msg.edit({ embed: pages[--index].e, buttons: buttonarr });
                                    } else if (b.id == '2' && index < pages.length - 1) {
                                        msg.edit({ embed: pages[++index].e, buttons: buttonarr });
                                    }

                                });
                            });
                        }
                    }

                    for (let i = 0; i < bhid.length; i++) {
                        bh.getPlayerRanked(bhid[i].brawlhalla_id.toString()).then(function (playerRanked) {

                            let twos = playerRanked['2v2'][0];

                            let color = '#0066ff';
                            if (playerRanked.rating > 2000)
                                color = '#3c2395'
                            else if (playerRanked.rating > 1679)
                                color = '#0e5bc8'
                            else if (playerRanked.rating > 1389)
                                color = '#8a0b20'
                            else if (playerRanked.rating > 1129)
                                color = '#676869'
                            else if (playerRanked.rating > 909)
                                color = '#664a28'
                            else
                                color = '#345435'

                            let highestLegend = playerRanked.legends[0];

                            for (let lg of playerRanked.legends) {
                                if (lg.rating > highestLegend.rating)
                                    highestLegend = lg;
                            }

                            const embed = new Discord.MessageEmbed()
                                .setColor(color)
                                .setTitle(`<:rbear:871068737984417792> ${playerRanked.name}`)
                                .addFields(
                                    {
                                        name: 'Ranked 1v1',
                                        value: `**${playerRanked.tier}** (${playerRanked.rating}/${playerRanked.peak_rating})
                                    ${playerRanked.wins} Wins / ${playerRanked.games - playerRanked.wins} Losses (${playerRanked.games} Games / ${(100 * playerRanked.wins / playerRanked.games).toFixed(1)}% Winrate)
                                    **Server: ${playerRanked.region}**
                                    **Global Rank:** ${playerRanked.global_rank}
                                    **Region Rank:** ${playerRanked.region_rank}`,
                                        inline: true
                                    },
                                    {
                                        name: `Other`,
                                        value: `**ID**: [${playerRanked.brawlhalla_id}](http://corehalla.com/stats/player/${playerRanked.brawlhalla_id})
                                        **Season Reset Elo:** ${playerRanked.rating > 1400 ? (1400 + (playerRanked.rating - 1400) / (3 - (3000 - playerRanked.rating) / 800)).toFixed(0) : playerRanked.rating}
                                    **Highest Legend Rating:**
                                     - **${highestLegend.legend_name_key.capitalize()}**
                                     - ${highestLegend.tier} (${highestLegend.rating} / ${highestLegend.peak_rating})
                                     - ${highestLegend.wins} Wins / ${highestLegend.games - highestLegend.wins} Losses (${highestLegend.games} Games / ${(100 * highestLegend.wins / highestLegend.games).toFixed(1)}% Winrate)`,
                                        inline: true
                                    },
                                )
                                .setFooter('This is very much a Work in Progress - Christopher Lee');

                            if (twos) {
                                embed.addFields({
                                    name: 'Ranked 2v2',
                                    value: `__**${twos.teamname.split('+').join(' & ')}**__
                                    **${twos.tier}** (${twos.rating}/${twos.peak_rating})
                                    ${twos.wins} Wins / ${twos.games - twos.wins} Losses (${twos.games} Games / ${(100 * twos.wins / twos.games).toFixed(1)}% Winrate)`,
                                    inline: false
                                })
                            }


                            pages.push({ rank: bhid[i].rank, e: embed });
                            operation();
                        }).catch(function (error) {
                            message.channel.send('Too many requests');
                            console.log('00 ' + error);
                        });
                    }
                });
                break;
            case 'stats':
                bh.getBhidByName(args.join(' ')).then(function (users) {
                    function compare(a, b) {
                        if (a.xp > b.xp) return 1;
                        if (a.xp < b.xp) return -1;
                        return 0;
                    }


                    let pages = [];
                    bhid = users;
                    function operation() {
                        if (pages.length == bhid.length) {


                            pages.sort(compare);
                            pages.reverse();

                            let index = 0;
                            let page = 0;
                            let ob = new MessageButton()
                                .setStyle('green')
                                .setID('o')
                                .setLabel('Overview');
                            let lib = new MessageButton()
                                .setStyle('green')
                                .setID('li')
                                .setLabel('Legend Info');
                            let wpn = new MessageButton()
                                .setStyle('green')
                                .setID('w')
                                .setLabel('Weapon Info');
                            let b1 = new MessageButton()
                                .setStyle('green')
                                .setID('1')
                                .setLabel('◀');
                            let b2 = new MessageButton()
                                .setStyle('green')
                                .setID('2')
                                .setLabel('▶');

                            let buttonarr = [ob, lib, wpn, b1, b2];

                            message.channel.send({ embed: pages[0].e[0], buttons: buttonarr }).then(msg => {
                                const collector = msg.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 60e3 });
                                collector.on('collect', b => {
                                    b.reply.defer();
                                    switch (b.id) {
                                        case '1':
                                            if (index > 0)
                                                msg.edit({ embed: pages[--index].e[page], buttons: buttonarr });
                                            break;
                                        case '2':
                                            if (index < pages.length - 1)
                                                msg.edit({ embed: pages[++index].e[page], buttons: buttonarr });
                                            break;
                                        case 'o':
                                            msg.edit({ embed: pages[index].e[0], buttons: buttonarr });
                                            break;
                                        case 'li':
                                            msg.edit({ embed: pages[index].e[1], buttons: buttonarr });
                                            break;
                                        case 'w':
                                            msg.edit({ embed: pages[index].e[2], buttons: buttonarr });
                                            break;
                                    }

                                });
                            });
                        }
                    }

                    for (let i = 0; i < bhid.length; i++) {
                        bh.getPlayerStats(bhid[i].brawlhalla_id.toString()).then(function (playerStats) {


                            let wMostPlayed = 'Hammer';
                            let legends = [];
                            let totalMatchTime = 0;
                            let agg = new Map();
                            agg.set('kos', 0);
                            agg.set('falls', 0);
                            agg.set('sd', 0);
                            agg.set('tko', 0);
                            agg.set('ddone', 0);
                            agg.set('dtake', 0);
                            agg.set('timeunarmed', 0);
                            agg.set('dunarmed', 0);
                            agg.set('kosunarmed', 0);

                            let wStats = new Map();
                            wStats.set('Hammer', { dmg: 0, time: 0 });
                            wStats.set('Sword', { dmg: 0, time: 0 });
                            wStats.set('Pistol', { dmg: 0, time: 0 });
                            wStats.set('RocketLance', { dmg: 0, time: 0 });
                            wStats.set('Spear', { dmg: 0, time: 0 });
                            wStats.set('Katar', { dmg: 0, time: 0 });
                            wStats.set('Axe', { dmg: 0, time: 0 });
                            wStats.set('Bow', { dmg: 0, time: 0 });
                            wStats.set('Fists', { dmg: 0, time: 0 });
                            wStats.set('Scythe', { dmg: 0, time: 0 });
                            wStats.set('Cannon', { dmg: 0, time: 0 });
                            wStats.set('Orb', { dmg: 0, time: 0 });
                            wStats.set('Greatsword', { dmg: 0, time: 0 });

                            for (let lg of playerStats.legends) {
                                legends.push(lg);
                                totalMatchTime += lg.matchtime;

                                wStats.get(weapons.get(lg.legend_id)[0]).dmg += parseInt(lg.damageweaponone);
                                wStats.get(weapons.get(lg.legend_id)[1]).dmg += parseInt(lg.damageweapontwo);
                                wStats.get(weapons.get(lg.legend_id)[0]).time += lg.timeheldweaponone;
                                wStats.get(weapons.get(lg.legend_id)[1]).time += lg.timeheldweapontwo;

                                if (wStats.get(weapons.get(lg.legend_id)[0]).time > wStats.get(wMostPlayed).time)
                                    wMostPlayed = weapons.get(lg.legend_id)[0];
                                else if (wStats.get(weapons.get(lg.legend_id)[1]).time > wStats.get(wMostPlayed).time)
                                    wMostPlayed = weapons.get(lg.legend_id)[1];

                                agg.set('kos', +agg.get('kos') + lg.kos);
                                agg.set('falls', +agg.get('falls') + lg.falls);
                                agg.set('sd', +agg.get('sd') + lg.suicides);
                                agg.set('tko', +agg.get('tko') + lg.teamkos);
                                agg.set('ddone', parseInt(agg.get('ddone')) + parseInt(lg.damagedealt));
                                agg.set('dtake', parseInt(agg.get('dtake')) + parseInt(lg.damagetaken));
                                agg.set('timeunarmed', +agg.get('timeunarmed') + lg.matchtime - lg.timeheldweaponone - lg.timeheldweapontwo);
                                agg.set('dunarmed', +agg.get('dunarmed') + parseInt(lg.damageunarmed));
                                agg.set('kosunarmed', +agg.get('kosunarmed') + lg.kounarmed);
                            }

                            legends.sort(compare);
                            legends.reverse();

                            //cleanerish look
                            let totalDamage = (parseInt(agg.get('ddone')) + parseInt(agg.get('dtake')));
                            let agl = (totalMatchTime / playerStats.games).toFixed(1);
                            let attk = (totalMatchTime / agg.get('kos')).toFixed(1);
                            let attf = (totalMatchTime / agg.get('falls')).toFixed(1);
                            let akg = (agg.get('kos') / playerStats.games).toFixed(1);
                            let afg = (agg.get('falls') / playerStats.games).toFixed(1);
                            let adps = (parseInt(agg.get('ddone')) / totalMatchTime).toFixed(1);
                            let adko = (parseInt(agg.get('ddone')) / agg.get('kos')).toFixed(1);
                            let adf = (parseInt(agg.get('dtake')) / agg.get('falls')).toFixed(1);


                            const overview = new Discord.MessageEmbed()
                                .setColor('#3FE8A7')
                                .setTitle(`<:rbear:871068737984417792> ${playerStats.name}`)
                                .addFields(
                                    {
                                        name: '__Overview__',
                                        value: `**ID**: [${playerStats.brawlhalla_id}](http://corehalla.com/stats/player/${playerStats.brawlhalla_id})
                                        **Time Spent in Gane**: ${toHours(totalMatchTime)}
                                                **Total XP**: ${form(playerStats.xp)} (LVL ${playerStats.level})

                                    **Total Games**: ${form(playerStats.games)}
                                    **${form(playerStats.wins)} Wins** (${(100 * playerStats.wins / playerStats.games).toFixed(1)}%)
                                    **${form(playerStats.games - playerStats.wins)} Losses** (${(100 * (playerStats.games - playerStats.wins) / playerStats.games).toFixed(1)}%)\n
                                    **Most PLayed Legend**: ${legends[0].legend_name_key.capitalize()}
                                    - In Game Time: ${toHours(legends[0].matchtime)} 
                                    **Most Played Weapon**: ${wMostPlayed} (Brawlhalla has stupid names)
                                    - Time Held: ${toHours(wStats.get(wMostPlayed).time)} `,
                                        inline: true
                                    },
                                    {
                                        name: `__Other__`,
                                        value: `**Avg. Game Length**: ${agl}s
                                        **Avg. Time to Kill**: ${attk}s
                                        **Avg. Time to Fall**: ${attf}s\n
                                        **Avg. KOs/game**: ${akg}
                                        **Avg. Falls/game**: ${afg}
                                        **Avg. Damage/second**: ${adps}
                                        **Avg. Damage/KO**: ${adko}
                                        **Avg. Damage/fall**: ${adf}\n
                                        **Time spent Unarmed**: ${toHours(agg.get('timeunarmed'))}
                                        - KOs: ${agg.get('kosunarmed')}
                                        - Damage Dealt: ${form(agg.get('dunarmed'))}`,
                                        inline: true
                                    },
                                    {
                                        name: `__Damage__`,
                                        value: `**KOs**: ${agg.get('kos')}
                                        **Falls**: ${agg.get('falls')}
                                        - Self Destructs: ${agg.get('sd')}
                                        - Teamkills: ${agg.get('tko')}\n
                                        **Total Damage Dealt**: ${form(agg.get('ddone'))} (${(100 * agg.get('ddone') / totalDamage).toFixed(1)}%)
                                        **Total Damage Taken**: ${form(agg.get('dtake'))} (${(100 * agg.get('dtake') / totalDamage).toFixed(1)}%)`,
                                        inline: false
                                    },
                                )
                                .setFooter('This is very much a Work in Progress - Christopher Lee');

                            if (playerStats.clan)
                                overview.setDescription(`**Clan**: < [${playerStats.clan.clan_name}](http://corehalla.com/stats/clan/${playerStats.clan.clan_id}) >`)

                            //LegendInfo
                            const legendInfo = new Discord.MessageEmbed()
                                .setColor('#3FE8A7')
                                .setTitle(`<:rbear:871068737984417792> ${playerStats.name}`)
                                .setDescription(`**ID**: [${playerStats.brawlhalla_id}](http://corehalla.com/stats/player/${playerStats.brawlhalla_id})`);

                            for (let i = 0; i < 6; i++) {
                                lg = legends[i];
                                if (lg) {
                                    legendInfo.addFields(
                                        {
                                            name: `**Legend**: ${lg.legend_name_key.capitalize()}`,
                                            value: `Level: ${lg.level}
                                        In Game Time: ${toHours(legends[0].matchtime)}\n
                                        **Games**: ${lg.games}
                                        **${lg.wins} Wins** (${(100 * lg.wins / lg.games).toFixed(1)}%)
                                        **${lg.games - lg.wins} Losses** (${(100 * (lg.games - lg.wins) / lg.games).toFixed(1)}%)
                                        **KOs**: ${lg.kos}
                                        **Falls**: ${lg.falls}
                                        **Suicides** ${lg.suicides}\n
                                        Damage Delt: ${form(lg.damagedealt)}
                                        Damage Taken: ${form(lg.damagetaken)}`,
                                            inline: true
                                        });
                                }
                            }

                            const weaponInfo = new Discord.MessageEmbed()
                                .setColor('#3FE8A7')
                                .setTitle(`<:rbear:871068737984417792> ${playerStats.name}`)
                                .setDescription(`**ID**: [${playerStats.brawlhalla_id}](http://corehalla.com/stats/player/${playerStats.brawlhalla_id})`);



                            wStats.forEach((values, keys) => {
                                weaponInfo.addFields(
                                    {
                                        name: `**Weapon**: ${keys}`,
                                        value: `-Total Time Held: ${toHours(values.time)}
                                        -Total Damage: ${form(values.dmg)}`,
                                        inline: true
                                    });
                            });

                            weaponInfo.addFields(
                                {
                                    name: `**Weapon**: Unarmed`,
                                    value: `-Total Time Held: ${toHours(agg.get('timeunarmed'))}
                                    -Total Damage: ${form(agg.get('dunarmed'))}`,
                                    inline: true
                                });



                            pages.push({ xp: playerStats.xp, e: [overview, legendInfo, weaponInfo] });
                            operation();
                        });
                    }
                }).catch(function (error) {
                    message.channel.send('Too many requests');
                    return console.log('01 ' + error);
                });
                break;
            case 'btest':
                bh.getLegendInfo(3).then(function (legendInfo) {
                    console.log(legendInfo);
                }).catch(function (error) {

                });
                break;
        }
    }
}
