<script>
  import { post, del } from "utils.js";

  export let message = "",
    inProgress = false,
    forceRefresh = false,
    mySteamId = "",
    apiKey = "";

  async function handleClick(_) {
    inProgress = true;
    message = "Retrieving friends and games lists...";
    const response = await post("/api/key", {
      apiKey,
      mySteamId,
      forceRefresh,
    });
    inProgress = false;
    if (typeof response.error !== "undefined") {
      message = response.error;
    } else if (typeof response.success !== "undefined") {
      message = response.success;
    } else {
      message = "";
    }
  }

  async function handleClear(_) {
    inProgress = true;
    message = "Clearing all data...";
    const response = await del("/api/key");
    inProgress = false;
    message = response.success;
  }
</script>

<style>

</style>

<div id="config">
  <form>
    <fieldset>
      <legend>Configuration</legend>
      <div class="input-group vertical">
        <label for="steam-id">Steam ID</label>

        <input
          type="text"
          id="steam-id"
          bind:value={mySteamId}
          placeholder="Steam ID" />

      </div>
      <div class="input-group vertical">
        <label for="api-key">Steam Web API key</label>

        <input
          id="api-key"
          type="text"
          bind:value={apiKey}
          placeholder="API Key" />

      </div>
      <div class="row">
        <button
          type="button"
          class="primary"
          disabled={inProgress}
          on:click={handleClick}>
          {#if mySteamId === '' || apiKey === ''}Get started{:else}Update{/if}
        </button>
      </div>
    </fieldset>
    <fieldset>
      <legend>Danger zone</legend>
      <button
        type="button"
        class="secondary"
        disabled={inProgress}
        on:click={handleClear}>
        Clear all data
      </button>
    </fieldset>
  </form>
  {#if message != ''}
    <div class="row">
      {#if inProgress}
        <div class="spinner" />
      {/if}
      {#if message != ''}
        <p>{message}</p>
      {/if}

    </div>
  {/if}
</div>
