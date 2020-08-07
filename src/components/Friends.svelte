<script>
  export let friends = [];
</script>

<div id="friends">
  {#if typeof friends == 'undefined'}
    <p>
      No friends found.
      <a href="/config">Configure</a>
      your Steam Web API key.
    </p>
  {:else if friends.length > 0}
    <h2>Games in common</h2>
    <div class="collapse">
      {#each friends as friend, i}
        <input
          type="checkbox"
          id="collapse-section{i}"
          checked
          aria-hidden="true" />
        <label for="collapse-section{i}" aria-hidden="true">
          {friend.name}
        </label>
        <div>
          {#if friend.games.length > 0}
            <ul>
              {#each friend.games as game}
                <li>{game.name}</li>
              {/each}
            </ul>
          {:else}
            <p>No matching games.</p>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <p>
      No friends found. If you're sure you have some,
      <a href="/config">check you've configured</a>
      your Steam Web API key.
    </p>
  {/if}
</div>
