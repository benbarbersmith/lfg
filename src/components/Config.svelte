<script>
  export let status = "",
    inprogress = false,
    forceRefresh = false,
    mySteamId,
    apiKey;

  async function handleClick(_) {
    inprogress = true;
    status = "Retrieving friends and games lists...";
    let response = await fetch("/apikey", {
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey,
        mySteamId,
        forceRefresh,
      }),
    });
    const res = await response.json();
    inprogress = false;
    if (typeof res.error !== "undefined") {
      status = res.error;
    } else if (typeof res.success !== "undefined") {
      status = res.success;
    }
  }
</script>

<style>

</style>

<div id="config">
  <form>
    <fieldset>
      <legend>Configuration</legend>
      <div>
        <label for="steam-id">Steam ID</label>
        <input
          type="text"
          id="steam-id"
          bind:value={mySteamId}
          placeholder="Steam ID" />
      </div>
      <div>
        <label for="api-key">API Key</label>
        <input type="text" bind:value={apiKey} placeholder="API Key" />
      </div>
      <div>
        <label for="force-refresh">Force refresh?</label>
        <input
          type="checkbox"
          bind:value={forceRefresh}
          placeholder="Force refresh" />
      </div>
      <button type="button" disabled={inprogress} on:click={handleClick}>
        {#if typeof mySteamId === 'undefined' || typeof apiKey === 'undefined'}
          Get started
        {:else}Update{/if}
      </button>
    </fieldset>
  </form>
  {#if typeof status !== 'undefined' && status !== ''}
    <p>{status}</p>
  {/if}
</div>
