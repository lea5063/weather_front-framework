<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
// 서비스 소개 화면에서 대시보드 홈으로 이동하기 위해 생성했습니다.
function handleGoHome() {
  router.push('/')
}
</script>

<template>
  <div class="about-view">
    <el-card class="about-view__card" shadow="always">
      <h2>ℹ️ 서비스 소개</h2>
      <p>본 앱은 Vue 3, Vue Router, Pinia 기반으로 제작된 실습용 날씨 대시보드입니다.</p>
      <ul class="about-view__list">
        <li>OpenWeatherMap API로 실시간 날씨 데이터를 조회합니다.</li>
        <li>Last.fm API로 검색한 도시의 국가별 인기곡을 추천합니다.</li>
        <li>클라이언트 사이드 라우팅을 통해 새로고침 없이 화면이 전환됩니다.</li>
        <li>URL 쿼리 스트링 매핑을 활용해 실시간 검색 상태를 유지합니다.</li>
      </ul>
      <el-button type="primary" class="about-view__button" @click="handleGoHome">
        대시보드 홈으로 이동
      </el-button>
    </el-card>
  </div>
</template>

<style scoped>
.about-view {
  min-height: calc(100dvh - var(--nav-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.about-view__card {
  max-width: 420px;
  width: 100%;
}

.about-view__list {
  padding-left: 20px;
  margin: 12px 0;
  line-height: 1.6;
}

.about-view__button {
  width: 100%;
  margin-top: 8px;
}
</style>
