<script>
  import Config from "../components/Config.svelte";
  import Friends from "../components/Friends.svelte";
</script>

<style>
  h1 {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>LFG</title>
</svelte:head>

<h1>LFG</h1>

<Friends />
