<script context="module">
  export async function preload(page, session) {
    if (typeof session.user === "undefined") {
      console.log("no session.user");
      return;
    }
    const { apiKey, mySteamId } = session.user;
    return { apiKey, mySteamId };
  }
</script>

<script>
  import Config from "../components/Config.svelte";
  export let apiKey, mySteamId;
</script>

<style>

</style>

<svelte:head>
  <title>Config — LFG</title>
</svelte:head>

<Config {apiKey} {mySteamId} />
