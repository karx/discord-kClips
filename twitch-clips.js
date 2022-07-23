
const Discord = require("discord.js");
const {
    twitch_getGamefromID,
    twitch_getClipsfromGameID,
    twitch_getClipsfromBroadcasterID,
    twitch_getTopGames,
    twitch_getStreamerFromName,
    twitch_getGameFromSearch } = require("./utils/twitch");

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getMessageEmbedWithText(text) {
    const embed = new Discord.MessageEmbed()
        .setTitle("kaaroClips - get your Twitch clips")
        .setDescription(text);

    return embed;
}

async function getSteamerClipFromTwitch(broadcaster_name) {
    console.log(broadcaster_name);
    var broadcaster_id;
    const broadcaster = await twitch_getStreamerFromName(broadcaster_name);

    if (broadcaster['data'].length > 0) {
        broadcaster_id = broadcaster['data'][0].id;
    } else {
        return getMessageEmbedWithText("Could not find any Twitch streamer with the name: `" + broadcaster_name + "`");
    }
    const topClips = await twitch_getClipsfromBroadcasterID(broadcaster_id);
    const countOfClips = topClips['data'].length;

    if (countOfClips < 1) {
        return getMessageEmbedWithText("No clips have been created on " + broadcaster_name + "'s stream");
    }
    const topClipOfAll = topClips['data'][getRandomInt(countOfClips)]
    const gameDetails = await twitch_getGamefromID(topClipOfAll['game_id']);
    var topGameName = gameDetails['data'][0]['name'];
    const toReturn = {
        game: topGameName,
        streamer: topClipOfAll['broadcaster_name'],
        creator: topClipOfAll['creator_name'],
        url: topClipOfAll['url']
    };
    return toReturn;
}

async function getRandomClipFromTwitch() {

    const topGames = await twitch_getTopGames();
    const countOfGames = topGames['data'].length;
    var topGame = topGames['data'][getRandomInt(countOfGames)];
    var topGameId = topGame['id'];
    var topGameName = topGame['name'];
    const topClips = await twitch_getClipsfromGameID(topGameId);
    const countOfClips = topClips['data'].length;
    const topClipOfAll = topClips['data'][getRandomInt(countOfClips)]
    console.log({ topClips, topClipOfAll });
    const toReturn = {
        game: topGameName,
        streamer: topClipOfAll['broadcaster_name'],
        creator: topClipOfAll['creator_name'],
        url: topClipOfAll['url']
    };
    return toReturn;

}

async function getSearchClipFromTwitch(query) {
    // https://api.twitch.tv/helix/users
    console.log(query);
    var game_id;
    const searchresults = await twitch_getGameFromSearch(query);
    console.log(searchresults);
    if (searchresults['data'].length > 0) {
        game_id = searchresults['data'][0].id;
    } else {
        return getMessageEmbedWithText("Could not find any Twitch Clips for : `" + query + "`");
    }
    const topClips = await twitch_getClipsfromGameID(game_id);

    const countOfClips = topClips['data'].length;
    if (countOfClips < 1) {
        return getMessageEmbedWithText("Could not find any Twitch Clips for : `" + query + "`");
    }
    const topClipOfAll = topClips['data'][getRandomInt(countOfClips)]

    const gameDetails = await twitch_getGamefromID(topClipOfAll['game_id']);

    var topGameName = gameDetails['data'][0]['name'];
    const toReturn = {
        game: topGameName,
        streamer: topClipOfAll['broadcaster_name'],
        creator: topClipOfAll['creator_name'],
        url: topClipOfAll['url']
    };
    return toReturn;
}


module.exports = {
    getSteamerClipFromTwitch,
    getRandomClipFromTwitch,
    getSearchClipFromTwitch
};
