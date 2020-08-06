<script>
  import { stores } from "@sapper/app";
  const { session } = stores();
  let mySteamId = "yourSteamId",
    apiKey = "yourApiKey";

  async function handleClick(_) {
    session.mySteamId = mySteamId;
    session.apiKey = apiKey;

    const friends = await getFriends(apiKey, mySteamId);
    const friendSteamIds = friends.map((x) => x["steamid"]);

    session.friendsBySteamId = await getPlayerSummariesForSteamIds(
      apiKey,
      friendSteamIds
    );

    session.gamesBySteamId = await getGamesForSteamIds(
      apiKey,
      friendSteamIds.concat([mySteamId])
    );
  }

  async function getFriends(apiKey, steamId) {
    console.log("Getting friends for " + steamId);
    const url =
      "https://cors-anywhere.herokuapp.com/api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=" +
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
      "https://cors-anywhere.herokuapp.com/api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" +
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
        "https://cors-anywhere.herokuapp.com/api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" +
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
</script>

<style>

</style>

<div id="config">
  <form>
    <fieldset>
      <legend>Configuration</legend>
      <label for="steam-id">Steam ID</label>
      <input
        type="text"
        id="steam-id"
        bind:value={mySteamId}
        placeholder="Steam ID" />
      <label for="api-key">API Key</label>
      <input type="text" bind:value={apiKey} placeholder="API Key" />
      <button type="button" on:click|once={handleClick}>Get started</button>
    </fieldset>
  </form>
</div>
