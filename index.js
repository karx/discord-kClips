require('dotenv').config();

// Load up the discord.js library
const Discord = require("discord.js");

// Loading up await request for some HTTP calls (lazy mode)
const request = require("./await-request");

const client = new Discord.Client();

const { getSteamerClipFromTwitch, getRandomClipFromTwitch, getSearchClipFromTwitch } = require("./twitch-clips");

client.on("ready", () => {
    // console.log({ client })
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    post_log_message('OnReady', `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`clips in ${client.guilds.cache.size} servers`);
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
    if (message.content.indexOf(process.env.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Let's go with a few common example commands! Feel free to delete or change those.

    if (command === "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! I can get you Clips in  ${m.createdTimestamp - message.createdTimestamp}ms. Mehh.... plus minus ${Math.round(client.ws.ping)}ms`);
    }

    if (command === "help" || command == "cmds" || command == "?" || command === "cmd") {

        const embed = new Discord.MessageEmbed()
            .setTitle("`kaaroClips`")
            // .setAuthor(topClipOfAll['broadcaster_name'])
            .setColor(0x6441A5)
            .setDescription(`
                Using the new Twitch APIs, we pick up from the most viewed games and broadcaster, to pick a new clip for you everytime!
                Just use __+clipsFix__ and get yourself fixed with a new Clip
                
                [Link to add kaaroClips to your own server](https://discordapp.com/api/oauth2/authorize?client_id=593919604993294337&permissions=0&scope=bot)
                    
            `)
            .addField('Usage', `
            Use any of the following command if kaaroClips is added to your server
            * +clipsFix
            * +fixClips
            * +fixClips <streamerName>
            * +searchClip <query>
            `)
            .addField('Contact Support', `
            * Developer: @karx#1041 
            * Support Server: https://discord.gg/B2cERQ5
            `)

        message.channel.send({ embed });

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
        if (args.length === 0) {
            embed_to_send = await getRandomClipFromTwitch();
        } else {
            var streamer_name = args[0];
            embed_to_send = await getSteamerClipFromTwitch(streamer_name);
        }
        post_log_message('clipFix command', embed_to_send);
        console.log(embed_to_send);
        if (!!embed_to_send.url) {
            m.edit(`Found this Clip of \`${embed_to_send.streamer}\` playing \`${embed_to_send.game}\` \n${embed_to_send.url}`);
        } else {
            m.edit(embed_to_send);
        }

        // message.channel.send(embed_to_send.url);
    }
    if (command === "searchclip" || command === "clipsearch" || command === "clipit" || command === "pjclip") {
        const m = await message.channel.send("Looking into the depths of Twitch.tv....");
        var embed_to_send;
        if (args.length === 0) {
            embed_to_send = await getRandomClipFromTwitch();
        } else {
            var query = args[0];
            embed_to_send = await getSearchClipFromTwitch(query);
        }
        post_log_message('searchclip command', embed_to_send);
        console.log(embed_to_send);
        if (!!embed_to_send.url) {
            m.edit(`Found this Clip of \`${embed_to_send.streamer}\` playing \`${embed_to_send.game}\` \n${embed_to_send.url}`);
        } else {
            m.edit(embed_to_send);
        }

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
        if (!!embed_to_send.url) {
            m.edit(`Found this Clip of \`${embed_to_send.streamer}\` playing \`${embed_to_send.game}\` \n${embed_to_send.url}`);
        } else {
            m.edit(embed_to_send);
        }


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
        if (!!embed_to_send.url) {
            m.edit(`Found this Clip of \`${embed_to_send.streamer}\` playing \`${embed_to_send.game}\` \n${embed_to_send.url}`);
        } else {
            m.edit(embed_to_send);
        }

    }
});
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


client.login(process.env.token);

async function post_log_message(title, desc, url = "https://akriya.co.in") {
    let headers = { 'Content-Type': 'application/json' };
    console.log('------------------');
    var msg = await request({
        method: 'post',
        url: process.env.discord_webhook,
        body: JSON.stringify({
            "content": "discord-kClips",
            "embeds": [{
                "title": title,
                "description": JSON.stringify(desc),
                "url": url
            }]
        }),
        headers: headers
        // json: true
    });
    console.log(msg);
    console.log('------------------');
}

