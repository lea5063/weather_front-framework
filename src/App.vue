<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="app-shell">
    <NavBar />
    <main class="app-shell__content">
      <RouterView />
    </main>
  </div>
</template>

<style>
:root {
  --nav-height: 56px;
}

.app-shell {
  min-height: 100dvh;
  background: linear-gradient(160deg, #1f2937 0%, #334155 100%);
  color: #fff;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
}

.app-shell__content {
  min-height: calc(100dvh - var(--nav-height));
}
</style>
