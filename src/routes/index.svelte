<script context="module">
  export async function preload(page, session) {
    if (typeof session.user == "undefined") {
      return;
    }

    const { gamesBySteamId, friendsBySteamId, mySteamId } = session.user;

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
    return { friends };
  }
</script>

<script>
  import Friends from "../components/Friends.svelte";

  export let friends;
</script>

<style>

</style>

<svelte:head>
  <title>LFG</title>
</svelte:head>

<Friends {friends} />
