<script setup>
defineProps({
  song: {
    type: Object,
    default: null,
  },
  isLoading: { type: Boolean, default: false },
  isFallback: { type: Boolean, default: false },
  countryName: { type: String, default: '' },
})
</script>

<template>
  <section class="song-of-the-day">
    <h3 class="song-of-the-day__title">🎵 오늘의 노래 추천</h3>
    <p v-if="countryName && !isLoading" class="song-of-the-day__country">
      {{ countryName }} 차트 기준
    </p>
    <p v-if="isLoading" class="song-of-the-day__empty">불러오는 중...</p>
    <template v-else-if="song">
      <p class="song-of-the-day__song">{{ song.artist }} - {{ song.title }}</p>
      <p v-if="isFallback" class="song-of-the-day__notice">
        ⚠️ 실시간 차트 조회에 실패해 샘플 목록에서 표시 중입니다.
      </p>
    </template>
    <p v-else class="song-of-the-day__empty">이 국가의 인기곡 정보를 불러오지 못했습니다.</p>
  </section>
</template>

<style scoped>
.song-of-the-day {
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.06);
  text-align: center;
}

.song-of-the-day__title {
  margin: 0 0 8px;
  font-size: 15px;
}

.song-of-the-day__country {
  margin: 0 0 6px;
  font-size: 12px;
  opacity: 0.7;
}

.song-of-the-day__song {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.song-of-the-day__empty {
  margin: 0;
  font-size: 14px;
  opacity: 0.7;
}

.song-of-the-day__notice {
  margin: 6px 0 0;
  font-size: 12px;
  opacity: 0.75;
}
</style>
