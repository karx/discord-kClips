

// Load up the discord.js library
const Discord = require("discord.js");

// Loading up await request for some HTTP calls (lazy mode)
const request = require("./await-request");

const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    post_log_message('OnReady', `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`clips in ${client.guilds.size} servers`);    
});

client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    post_log_message("guildCreate", `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`clips in ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    post_log_message('guildDelete', `I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`clips in ${client.guilds.size} servers`);
});


client.on("message", async message => {
    // This event will run on every single message received, from any channel or DM.

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if (message.content.indexOf(config.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Let's go with a few common example commands! Feel free to delete or change those.

    if (command === "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! I can get you Clips in  ${m.createdTimestamp - message.createdTimestamp}ms. Mehh.... plus minus ${Math.round(client.ping)}ms`);
    }

    if (command === "help" || command == "cmds" || command == "?" || command === "cmd") {
        
        const embed = new Discord.RichEmbed()
            .setTitle("`kaaroClips`")
            // .setAuthor(topClipOfAll['broadcaster_name'])
            .setColor(0x6441A5)
            .setDescription(`
                Using the new Twitch APIs, we pick up from the most viewed games and broadcaster, to pick a new clip for you everytime!
                Just use __+clipsFix__ and get yourself fixed with a new Clip
                
                [Test - Link to add kaaroClips to your server](https://discordapp.com/api/oauth2/authorize?client_id=593919604993294337&permissions=0&scope=bot)
                    
            `)
            .addField('Usage', `
            Use any of the following command if kaaroClips is added to your server
            * +clipsFix
            * +fixClips
            `)
            .addField('Contact Support', `
            * Developer: @karx#1041 
            * Support Server: https://discord.gg/B2cERQ5
            `)

            // .setImage("" + topClipOfAll['thumbnail_url'])
            // .setThumbnail("" + topClipOfAll['thumbnail_url'])
        message.channel.send({ embed });

        // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
        // // To get the "message" itself we join the `args` back into a string with spaces: 
        // const sayMessage = args.join(" ");
        // // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
        // message.delete().catch(O_o=>{}); 
        // // And we get the bot to say the thing: 
        // message.channel.send(sayMessage);
    }

    if (command === "kick") {
        // This command must be limited to mods and admins. In this example we just hardcode the role names.
        // Please read on Array.some() to understand this bit: 
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
        // if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
        //   return message.reply("Sorry, you don't have permissions to use this!");

        // // Let's first check if we have a member and if we can kick them!
        // // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
        // // We can also support getting the member by ID, which would be args[0]
        // let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        // if(!member)
        //   return message.reply("Please mention a valid member of this server");
        // if(!member.kickable) 
        //   return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

        // // slice(1) removes the first part, which here should be the user mention or ID
        // // join(' ') takes all the various parts to make it a single string.
        // let reason = args.slice(1).join(' ');
        // if(!reason) reason = "No reason provided";

        // // Now, time for a swift kick in the nuts!
        // await member.kick(reason)
        //   .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        // message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

    }

    if (command === "ban") {
        // Most of this command is identical to kick, except that here we'll only let admins do it.
        // In the real world mods could ban too, but this is just an example, right? ;)
        // if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
        //   return message.reply("Sorry, you don't have permissions to use this!");

        // let member = message.mentions.members.first();
        // if(!member)
        //   return message.reply("Please mention a valid member of this server");
        // if(!member.bannable) 
        //   return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

        // let reason = args.slice(1).join(' ');
        // if(!reason) reason = "No reason provided";

        // await member.ban(reason)
        //   .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
        // message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    }

    if (command === "purge") {
        // This command removes all messages from all users in the channel, up to 100.

        // // get the delete count, as an actual number.
        // const deleteCount = parseInt(args[0], 10);

        // // Ooooh nice, combined conditions. <3
        // if(!deleteCount || deleteCount < 2 || deleteCount > 100)
        //   return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

        // // So we get our messages, and delete them. Simple enough, right?
        // const fetched = await message.channel.fetchMessages({limit: deleteCount});
        // message.channel.bulkDelete(fetched)
        //   .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }

    if (command === "clipsfix" || command === "clipfix" || command === "fixclip" || command === "fixclips") {
        const m = await message.channel.send("Looking into the depths of Twitch.tv....");        
        var embed_to_send;
        if (args.length === 0){
            embed_to_send = await getRandomClipFromTwitch();
        } else {
            var streamer_name = args[0];
            embed_to_send = await getSteamerClipFromTwitch(streamer_name);
        }
        post_log_message('clipFix command', embed_to_send);
        console.log(embed_to_send);
        m.edit(`Found this Clip of \`${embed_to_send.streamer}\` playing \`${embed_to_send.game}\` \n${embed_to_send.url}`);
        // message.channel.send(embed_to_send.url);
    }

    if (command === "jimbo") {
        var messageList = [
            "Does jimbo ever eat carbs?..",
            "Image jeemzz studing ...",
            "How is jeemzz always on a bike?..",
            "Jeemzz loves oreos i guess..."
        ];

        var msgToSend = messageList[getRandomInt(messageList.length)];

        const m = await message.channel.send(msgToSend);        
        var embed_to_send;
        var streamer_name = "jeemzz"
        embed_to_send = await getSteamerClipFromTwitch(streamer_name);
        post_log_message('jimbo command', embed_to_send);
        m.edit(`Found this Clip of \`${embed_to_send.streamer}\` playing \`${embed_to_send.game}\` \n${embed_to_send.url}`);
        
    }
    if (command === "ibigasm") {
        var messageList = [
            "ibi got liquid blood..",
            "ibi is very honest to be honest.",
            "ibi finds pubg od.",
            "ibi can hear your soul living behind walls."
        ];

        var msgToSend = messageList[getRandomInt(messageList.length)];

        const m = await message.channel.send(msgToSend);        
        var embed_to_send;
        var streamer_name = "ibiza"
        embed_to_send = await getSteamerClipFromTwitch(streamer_name);
        
        post_log_message('ibigasm command', embed_to_send);
        m.edit(`Found this Clip of \`${embed_to_send.streamer}\` playing \`${embed_to_send.game}\` \n${embed_to_send.url}`);
        
    }
});
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
async function getSteamerClipFromTwitch(broadcaster_name) {
    // https://api.twitch.tv/helix/users
    console.log(broadcaster_name);
    let headers = { 'Client-ID': config.twitch_clientID }
    var broadcaster_id;
    const broadcaster = await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/users',
        qs: { 'login': broadcaster_name },
        headers: headers,
        json: true
    });
    if (broadcaster['data'].length > 0) {
        broadcaster_id = broadcaster['data'][0].id;
    } else {
        return getRichEmbedWithText("Could not find any Twitch streamer with the name: `" + broadcaster_name + "`");
    }
    console.log(broadcaster);
    const topClips = await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/clips',
        qs: { "broadcaster_id": broadcaster_id, "first": 50 },
        headers: headers,
        json: true,
    });
    const countOfClips = topClips['data'].length;
    // console.log(topClips['data'].length)
    if (countOfClips < 1) {
        return getRichEmbedWithText("No clips have been created on " + broadcaster_name + "'s stream");
    }
    const topClipOfAll = topClips['data'][getRandomInt(countOfClips)]
    console.log(topClipOfAll['thumbnail_url'])
    console.log(topClipOfAll);
    const gameDetails = await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/games',
        qs: {"id": topClipOfAll['game_id']},
        headers: headers,
        json: true
    });
    console.log(gameDetails);
    var topGameName = gameDetails['data'][0]['name'];
    const toReturn = {
        game: topGameName,
        streamer: topClipOfAll['broadcaster_name'],
        creator: topClipOfAll['creator_name'],
        url: topClipOfAll['url']
    };
    return toReturn;

    const embed = new Discord.RichEmbed()
        // .setTitle(topClipOfAll['title'])
        // .setAuthor(topClipOfAll['broadcaster_name'])
        .setColor(0x6441A5)
        // .setImage("" + topClipOfAll['thumbnail_url'])
        .setThumbnail("" + topClipOfAll['thumbnail_url'])
        .setURL(topClipOfAll['url'])
        .addField('Broadcaster', topClipOfAll['broadcaster_name'])
        .addField('Creator',topClipOfAll['creator_name']);
    // return topClipOfAll['url'];
    return embed;
    // return "Test";
}

async function getRandomClipFromTwitch() {
    let headers = { 'Client-ID': config.twitch_clientID }

        const topGames = await request({
            method: 'get',
            url: 'https://api.twitch.tv/helix/games/top',
            params: { limit: 20 },
            headers: headers,
            json: true,
        });
        console.log(topGames);
        const countOfGames = topGames['data'].length;
        var topGame = topGames['data'][getRandomInt(countOfGames)];
        console.log(topGame);
        
        var topGameId = topGame['game']['_id'];
        var topGameName = topGame['game']['name'];
        console.log(topGameId);
        const topClips = await request({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            qs: { "game_id": topGameId },
            headers: headers,
            json: true,
        });
        const countOfClips = topClips['data'].length;
        console.log(topClips['data'].length)
        const topClipOfAll = topClips['data'][getRandomInt(countOfClips)]
        console.log(topClipOfAll['thumbnail_url'])
        
        const toReturn = {
            game: topGameName,
            streamer: topClipOfAll['broadcaster_name'],
            creator: topClipOfAll['creator_name'],
            url: topClipOfAll['url']
        };
        return toReturn;

        const embed = new Discord.RichEmbed()
            // .setTitle(topClipOfAll['title'])
            // .setAuthor(topClipOfAll['broadcaster_name'])
            .setColor(0x6441A5)
            // .setImage("" + topClipOfAll['thumbnail_url'])
            .setThumbnail("" + topClipOfAll['thumbnail_url'])
            .setURL(topClipOfAll['url'])
            .addField('Broadcaster', topClipOfAll['broadcaster_name'])
            .addField('Creator',topClipOfAll['creator_name']);
        return embed;
        // return topClipOfAll['url'];
}

function getRichEmbedWithText(text) {
    return new Discord.RichEmbed()
            .setTitle("kaaroClips - get your Twitch clips")
            .setDescription(text);
}

client.login(config.token);

async function post_log_message(title, desc) {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    console.log('------------------');
    var msg = await request({
        method: 'post',
        url: config.discord_webhook,
        form : JSON.stringify({ 
            "content" : "discord-kClips", 
            "embeds" : [{
                "title" : title,
                "description" : JSON.stringify(desc)
            }]
        }),
        headers: headers
        // json: true
    });
    console.log(msg);
    console.log('------------------');
}

