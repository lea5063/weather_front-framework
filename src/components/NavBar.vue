<script setup>
import UnitToggler from './UnitToggler.vue'
</script>

<template>
  <header class="nav-bar">
    <RouterLink to="/" class="nav-bar__brand">🌤️ 날씨 대시보드</RouterLink>
    <nav class="nav-bar__links">
      <RouterLink to="/map" class="nav-bar__link">지도에서 찾기</RouterLink>
      <RouterLink to="/about" class="nav-bar__link">서비스 소개</RouterLink>
    </nav>
    <UnitToggler />
  </header>
</template>

<style scoped>
.nav-bar {
  height: var(--nav-height);
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-bar__brand {
  font-weight: 700;
  font-size: 16px;
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
}

.nav-bar__links {
  display: flex;
  gap: 16px;
  flex: 1;
}

.nav-bar__link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
}

.nav-bar__link:hover,
.nav-bar__link.router-link-active {
  color: #fff;
  font-weight: 600;
}
</style>
