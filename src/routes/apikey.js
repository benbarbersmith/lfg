import { goto } from '@sapper/app';
const fetch = require('node-fetch');

export async function post(req, res, next) {
    let { mySteamId, apiKey, forceRefresh } = req.body;

    if (typeof mySteamId === 'undefined') {
        res.setHeader('Content-Type', 'application/json');
        res.status = 400;
        res.end(JSON.stringify({ error: "Steam ID not provided." }));
        return;
    } else if (typeof apiKey === 'undefined') {
        res.setHeader('Content-Type', 'application/json');
        res.status = 400;
        res.end(JSON.stringify({ error: "API key not provided." }));
        return;
    }

    if (typeof req.session.user === 'undefined') {
        req.session.user = {};
    }

    if (typeof req.session.user.mySteamId === 'undefined' || req.session.user.mySteamId != mySteamId) {
        console.log("Updating session Steam ID, will refresh friends and games");
        req.session.user.mySteamId = mySteamId;
        forceRefresh = true;
    }
    if (typeof req.session.user.apiKey === 'undefined' || req.session.user.apiKey != apiKey) {
        console.log("Updating session API key, will refresh friends and games");
        req.session.user.apiKey = apiKey;
        forceRefresh = true;
    }

    if (forceRefresh || typeof req.session.user.gamesBySteamId === 'undefined' || typeof req.session.user.friendsBySteamId === 'undefined') {
        console.log("Setting Steam ID and API key");

        const { mySteamId, apiKey } = req.body;
        req.session.mySteamId = mySteamId;
        req.session.apiKey = apiKey;

        console.log("Finished setting Steam ID and API key");

        console.log("Getting friendsBySteamID");

        const friends = await getFriends(apiKey, mySteamId);
        const friendSteamIds = friends.map((x) => x["steamid"]);

        req.session.user.friendsBySteamId = await getPlayerSummariesForSteamIds(
            apiKey,
            friendSteamIds
        );

        console.log("Finished getting friendsBySteamID");

        console.log("Getting gamesBySteamID");

        req.session.user.gamesBySteamId = await getGamesForSteamIds(
            apiKey,
            friendSteamIds.concat([mySteamId])
        );

        console.log("Finished getting gamesBySteamID");

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: "Successfully retreived friends and games lists." }));
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "API key and Steam ID were both unchanged." }));
    }

}

async function getFriends(apiKey, steamId) {
    console.log("Getting friends for " + steamId);
    const url =
        "https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=" +
        apiKey +
        "&steamid=" +
        steamId +
        "&relationship=friend";
    let friends = await fetch(url)
        .then((x) => x.json())
        .then((x) => x["friendslist"]["friends"]);
    console.log("Found " + friends.length + " friends");
    return friends;
}

async function getPlayerSummariesForSteamIds(apiKey, steamIds) {
    console.log("Getting user data for " + steamIds.length + " friends");
    const url =
        "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" +
        apiKey +
        "&steamids=" +
        steamIds.reduce((acc, x) => (acc += "," + x));
    let summaries = await fetch(url)
        .then((x) => x.json())
        .then((x) => x["response"]["players"]);
    console.log("Found summaries for " + summaries.length + " friends");
    let friendsBySteamId = {};
    for (let f of summaries) {
        friendsBySteamId[f["steamid"]] = f;
    }
    return friendsBySteamId;
}

async function getGamesForSteamIds(apiKey, steamIds) {
    let gamesBySteamId = {};
    for (let steamId of steamIds) {
        console.log("Getting games for user " + steamId);
        var url =
            "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" +
            apiKey +
            "&include_played_free_games=1&include_appinfo=1&format=json&steamid=" +
            steamId;
        var games = await fetch(url)
            .then((x) => x.json())
            .then((x) => x["response"]["games"]);
        if (typeof games !== "undefined") {
            console.log(
                "Found " + games.length + " games for Steam user " + steamId
            );
            gamesBySteamId[steamId] = games;
        } else {
            console.log("Could not get games for Steam user " + steamId);
        }
    }
    return gamesBySteamId;
}

