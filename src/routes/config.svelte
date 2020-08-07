<script context="module">
  export async function preload(page, session) {
    let apiKey, mySteamId;
    if (
      typeof session.user !== "undefined" &&
      typeof session.user.apiKey !== "undefined" &&
      typeof session.user.mySteamId !== "undefined"
    ) {
      mySteamId = session.user.mySteamId;
      apiKey = session.user.apiKey;
    } else if (process.browser) {
      let response = await fetch("/api/key").then((res) => res.json());
      mySteamId = response.mySteamId;
      apiKey = response.apiKey;
    }
    return { apiKey, mySteamId };
  }
</script>

<script>
  import Config from "../components/Config.svelte";
  export let apiKey = "",
    mySteamId = "";
</script>

<style>

</style>

<svelte:head>
  <title>Config — LFG</title>
</svelte:head>

<Config {apiKey} {mySteamId} />
