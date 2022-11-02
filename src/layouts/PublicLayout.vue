<script setup>
import { watch } from "vue"
import { useRoute, useRouter } from "vue-router"

/**
 * Prevent this layout to be opened directly.
 * Always redirect to /auth/login in case someone
 * trys to access /auth directly.
 */

const route = useRoute()

watch(
  () => route.name,
  (name) => {
    if (name === "auth") {
      useRouter().replace({ name: "login" })
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div id="view-wrap">
    <main>
      <section class="intro">
        <h1>Competition <span class="bold">Tracker</span></h1>
        <h2>track, share, remember</h2>
      </section>
      <section class="nav">
        <div class="options">
          <RouterLink :to="{ name: 'login' }">Login</RouterLink>
          <RouterLink :to="{ name: 'register' }">Register</RouterLink>
        </div>
      </section>
      <section class="view">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped lang="less">
#view-wrap {
  height: 100vh;
  overflow-y: auto;
}

main {
  padding-top: 14rem;
}

.flex-center {
  flex-direction: column;
}

section {
  width: 100%;
  padding: 2rem;
}

.intro {
  text-align: center;
  border-bottom: 1px solid var(--color-border);

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 0.85em;
  }
}

.nav {
  padding: 2rem;

  .options {
    display: flex;
    align-items: center;
    justify-content: center;

    > a {
      margin: 0 10px;
      border-bottom: 1px solid transparent;

      &.router-link-exact-active {
        border-bottom: 1px solid var(--color-accent);
      }
    }
  }
}
</style>
