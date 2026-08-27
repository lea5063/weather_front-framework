<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
// 존재하지 않는 경로에서 날씨 메인 화면으로 이동하기 위해 생성했습니다.
function handleGoHome() {
  router.push('/')
}
</script>

<template>
  <div class="not-found-view">
    <el-card class="not-found-view__card" shadow="always">
      <p class="not-found-view__emoji">☀️❓</p>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다.</p>
      <el-button type="primary" @click="handleGoHome">날씨 메인으로 이동</el-button>
    </el-card>
  </div>
</template>

<style scoped>
.not-found-view {
  min-height: calc(100dvh - var(--nav-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.not-found-view__card {
  max-width: 360px;
  width: 100%;
}

.not-found-view__emoji {
  font-size: 48px;
  margin: 0 0 8px;
}
</style>
