<script>
  import { isObject, alphaNumSort } from "../util/misc.js";
  import { dynamicPaths } from "../store.js";

  //FIXME: segment is essentially deprecate
  export let segment;
</script>

<style>
  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: "";
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  .selected {
    position: relative;
    display: inline-block;
  }

  .selected::after {
    position: absolute;
    content: "";
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -1px;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
    text-transform: capitalize;
  }
</style>

<nav>
  <ul>
    <!-- Home/index path -->
    <li>
      <a class:selected={segment === undefined} href=".">home</a>
    </li>

    <!-- Svelte pages paths -->
    <li>
      <a class:selected={segment === 'about'} href="directory">directory</a>
    </li>

    <!-- Add paths for dynamic content -->
    {#each $dynamicPaths as path}
      <li>
        {#if isObject(path)}
          <a
            class="clean-link"
            class:selected={segment == path.rootName}
            href={path.path}>
            {path.rootName}
          </a>
        {:else}
          <a class:selected={segment == path} href={path}>{path}</a>
        {/if}
      </li>
    {/each}

  </ul>
</nav>

<!-- TODO: prefetch path for dynamic path links? -->
<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen
    <li>
      <a rel="prefetch" class:selected={segment === 'blog'} href="blog">blog</a>
    </li> -->
