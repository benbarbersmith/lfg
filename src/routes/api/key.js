const fetch = require('node-fetch');

export async function get(req, res, _) {
    if (typeof req.session.user !== 'undefined' && typeof req.session.user.mySteamId !== 'undefined' && typeof req.session.user.apiKey !== 'undefined') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ mySteamId: req.session.user.mySteamId, apiKey: req.session.user.apiKey }));
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status = 500;
        res.end(JSON.stringify({ error: "Steam ID and Web API key have not yet been configured." }));
    }
}

export async function post(req, res, _) {
    let { mySteamId, apiKey, forceRefresh } = req.body;

    if (typeof mySteamId === 'undefined' || mySteamId == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status = 400;
        res.end(JSON.stringify({ error: "Steam ID not provided." }));
        return;
    } else if (typeof apiKey === 'undefined' || apiKey == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status = 400;
        res.end(JSON.stringify({ error: "API key not provided." }));
        return;
    }

    if (typeof req.session.user === 'undefined') {
        req.session.user = {};
    }

    if (typeof req.session.user.mySteamId === 'undefined' || req.session.user.mySteamId != mySteamId) {
        // Updating session Steam ID, will refresh friends and games
        req.session.user.mySteamId = mySteamId;
        forceRefresh = true;
    }
    if (typeof req.session.user.apiKey === 'undefined' || req.session.user.apiKey != apiKey) {
        // Updating session API key, will refresh friends and games
        req.session.user.apiKey = apiKey;
        forceRefresh = true;
    }

    // Only do the expensive work if expected data does not exist or the user forced a refresh
    if (forceRefresh || typeof req.session.user.gamesBySteamId === 'undefined' || typeof req.session.user.friendsBySteamId === 'undefined' || typeof req.session.user.friends === 'undefined') {
        const { mySteamId, apiKey } = req.body;
        req.session.mySteamId = mySteamId;
        req.session.apiKey = apiKey;

        const friends = await getFriends(apiKey, mySteamId);
        const friendSteamIds = friends.map((x) => x["steamid"]);

        req.session.user.friendsBySteamId = await getPlayerSummariesForSteamIds(
            apiKey,
            friendSteamIds
        );

        req.session.user.gamesBySteamId = await getGamesForSteamIds(
            apiKey,
            friendSteamIds.concat([mySteamId])
        );

        req.session.user.friends = calculateMatchingGamesForFriends(req.session.user.gamesBySteamId, req.session.user.friendsBySteamId, mySteamId);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: "Successfully retrieved friends and games lists.", friends }));
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "API key and Steam ID were both unchanged.", friends: req.session.user.friends }));
    }
}

export async function del(req, res, _) {
    delete req.session.user;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: "Successfully cleared all user data." }));
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

function calculateMatchingGamesForFriends(gamesBySteamId, friendsBySteamId, mySteamId) {
    gamesBySteamId[mySteamId].sort((a, b) =>
        a.playtime_forever > b.playtime_forever ? -1 : 1
    );

    let friends = [];

    for (const steamId in friendsBySteamId) {
        let friend = {
            steamId: steamId,
            name: friendsBySteamId[steamId].personaname,
            games: [],
        };

        if (
            steamId in gamesBySteamId &&
            typeof gamesBySteamId[steamId] !== "undefined"
        ) {
            const theirGames = new Set(
                gamesBySteamId[steamId].map((x) => x["appid"])
            );
            for (let g of gamesBySteamId[mySteamId]) {
                if (theirGames.has(g["appid"])) {
                    friend.games.push(g);
                }
            }
        }
        friends.push(friend);
    }

    friends.sort((a, b) => (a.games.length > b.games.length ? -1 : 1));
    return friends;
}