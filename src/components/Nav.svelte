<script>
  export let segment;
</script>

<style>
  [aria-current] {
    font-weight: bolder;
  }
</style>

<header>
  <a href="#/" class="logo">LFG</a>
  <a
    aria-current={segment === undefined ? 'page' : undefined}
    href="."
    class="button">
    friends
  </a>
  <a
    aria-current={segment === 'config' ? 'page' : undefined}
    href="config"
    class="button">
    config
  </a>
  <a
    aria-current={segment === 'about' ? 'page' : undefined}
    href="about"
    class="button">
    about
  </a>
</header>
