<script context="module">
  export async function preload(page, session) {
    let friends = [];
    if (
      typeof session.user !== "undefined" &&
      typeof session.user.friends !== "undefined"
    ) {
      friends = session.user.friends;
    } else if (process.browser) {
      let response = await fetch("/api/friends").then((res) => res.json());
      friends = response.friends;
    }
    return { friends };
  }
</script>

<script>
  import Friends from "../components/Friends.svelte";

  export let friends = [];
</script>

<style>

</style>

<svelte:head>
  <title>LFG</title>
</svelte:head>

<Friends {friends} />
