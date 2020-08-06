<script>
  import { stores } from "@sapper/app";
  const { session } = stores();

  let friendSteamIds = [];
  let matchedGamesByFriend = {};

  const isInitialized = () =>
    typeof session.friendsBySteamId !== "undefined" &&
    typeof session.gamesBySteamId !== "undefined" &&
    typeof session.mySteamId !== "undefined";

  $: if (isInitialized()) {
    matchedGamesByFriend = {};
    const myGames = new Set(session.gamesBySteamId[session.mySteamId]);
    for (const steamId in session.gamesBySteamId) {
      if (steamId == session.mySteamId) {
        // No need to match with ourselves
        continue;
      }
      if (
        !(steamId in session.gamesBySteamId) ||
        typeof session.gamesBySteamId[steamId] === "undefined"
      ) {
        // No games retrieved for this user
        continue;
      }

      friendSteamIds.push(steamId);
      const theirGames = new Set(
        session.gamesBySteamId[steamId].map((x) => x["appid"])
      );
      for (let g of myGames) {
        if (theirGames.has(g["appid"])) {
          if (!(steamId in matchedGamesByFriend)) {
            matchedGamesByFriend[steamId] = [];
          }
          matchedGamesByFriend[steamId].push(g["name"]);
        }
      }
    }
    friendSteamIds.sort(
      (a, b) =>
        a in matchedGamesByFriend &&
        (!(b in matchedGamesByFriend) ||
          matchedGamesByFriend[a].length >= matchedGamesByFriend[b].length)
    )
      ? -1
      : 1;
  }
</script>

{#if isInitialized() && friendSteamIds.length > 0}
  <div id="friends">
    <h2>Games in common</h2>
    {#each friendSteamIds as friend}
      <h3>{session.friendsBySteamId[friend]['personaname']}</h3>
      <ul>
        {#each matchedGamesByFriend[friend] as game}
          <li>{game}</li>
        {/each}
      </ul>
    {/each}
  </div>
{/if}
