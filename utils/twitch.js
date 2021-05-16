const request = require("../await-request");
let hasToken = false;
async function getAccessTokenFromTwitch() {
    if (!hasToken) {
        const oauthRequest = await request({
            method: 'post',
            url: 'https://id.twitch.tv/oauth2/token',
            qs: { 'client_id': process.env.twitch_clientID, 'client_secret': process.env.twitch_secret, 'grant_type': 'client_credentials', 'scope': '' },
            json: true
        });
        hasToken = oauthRequest.access_token
        return oauthRequest.access_token;
    } else return hasToken;

}
async function twitch_getGamefromID(game_id) {
    let twitch_access_code = await getAccessTokenFromTwitch();
    let headers = { 'Client-ID': process.env.twitch_clientID, 'Authorization': 'Bearer ' + twitch_access_code }
    return await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/games',
        qs: { "id": game_id },
        headers: headers,
        json: true
    });
}

async function twitch_getClipsfromGameID(game_id) {
    let twitch_access_code = await getAccessTokenFromTwitch();
    let headers = { 'Client-ID': process.env.twitch_clientID, 'Authorization': 'Bearer ' + twitch_access_code }
    return await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/clips',
        qs: { "game_id": game_id, "first": 50 },
        headers: headers,
        json: true,
    });
}

async function twitch_getClipsfromBroadcasterID(broadcaster_id) {
    let twitch_access_code = await getAccessTokenFromTwitch();
    let headers = { 'Client-ID': process.env.twitch_clientID, 'Authorization': 'Bearer ' + twitch_access_code }
    return await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/clips',
        qs: { "broadcaster_id": broadcaster_id, "first": 50 },
        headers: headers,
        json: true,
    });
}
async function twitch_getTopGames() {
    let twitch_access_code = await getAccessTokenFromTwitch();
    let headers = { 'Client-ID': process.env.twitch_clientID, 'Authorization': 'Bearer ' + twitch_access_code }
    return await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/games/top',
        params: { limit: 20 },
        headers: headers,
        json: true,
    });
}
async function twitch_getStreamerFromName(broadcaster_name) {
    let twitch_access_code = await getAccessTokenFromTwitch();
    let headers = { 'Client-ID': process.env.twitch_clientID, 'Authorization': 'Bearer ' + twitch_access_code }
    return await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/users',
        qs: { 'login': broadcaster_name },
        headers: headers,
        json: true
    });
}
async function twitch_getGameFromSearch(query) {
    let twitch_access_code = await getAccessTokenFromTwitch();
    let headers = { 'Client-ID': process.env.twitch_clientID, 'Authorization': 'Bearer ' + twitch_access_code }
    return await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/search/categories',
        qs: { 'query': query },
        headers: headers,
        json: true
    });
}

module.exports = {
    twitch_getGamefromID,
    twitch_getClipsfromGameID,
    twitch_getClipsfromBroadcasterID,
    twitch_getTopGames,
    twitch_getStreamerFromName,
    twitch_getGameFromSearch,
}