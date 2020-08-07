<script>
  export let friends;
</script>

<div id="friends">
  {#if typeof friends !== 'undefined' && friends.length > 0}
    <h2>Games in common</h2>
    {#each friends as friend}
      <h3>{friend.name}</h3>
      {#if friend.games.length > 0}
        <ul>
          {#each friend.games as game}
            <li>{game.name}</li>
          {/each}
        </ul>
      {:else}
        <p>No matching games.</p>
      {/if}
    {/each}
  {:else}
    <p>No friends found.</p>
  {/if}
</div>
