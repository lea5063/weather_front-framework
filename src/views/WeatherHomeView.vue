<script setup>
import { computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import BaseDashboardCard from '../components/BaseDashboardCard.vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import LocationButton from '../components/LocationButton.vue'
import SongOfTheDay from '../components/SongOfTheDay.vue'

import { useDashboardStore } from '../stores/dashboardStore.js'
import { useSongStore } from '../stores/songStore.js'
import { getDailyIndex } from '../utils/dailyPick.js'
import { logger } from '../utils/logger.js'
import { useToday } from '../composables/useToday.js'
import { useDebouncedRef } from '../composables/useDebounced.js'

const router = useRouter()
const { today } = useToday()
const dashboardStore = useDashboardStore()
const songStore = useSongStore()

const debouncedQuery = useDebouncedRef(() => dashboardStore.searchQuery, 200)
const filteredDashboardCities = computed(() => {
  const trimmed = debouncedQuery.value.trim()
  if (!trimmed) return dashboardStore.dashboardCities
  const lower = trimmed.toLowerCase()
  return dashboardStore.dashboardCities.filter(
    (city) => city.ko.includes(trimmed) || city.en.toLowerCase().includes(lower)
  )
})

const dailySong = computed(() => {
  const list = songStore.sourceList
  const index = getDailyIndex(list.length, today.value)
  return index >= 0 ? list[index] : null
})

watch(
  () => dashboardStore.selectedCityInfo,
  (next, prev) => {
    if (next) {
      logger.log(`[watch] 선택된 도시: "${prev?.ko ?? '없음'}" -> "${next.ko}"`)
    }
  }
)

watchEffect(() => {
  logger.log(`[watchEffect] 현재 검색어: "${dashboardStore.searchQuery}"`)
})

onMounted(() => {
  dashboardStore.initializeIfNeeded()
})

// 스토어 액션 결과를 성공 또는 오류 토스트로 표시하기 위해 생성했습니다.
function notify({ type, message }) {
  ElMessage[type === 'success' ? 'success' : 'error'](message)
}

// 입력한 도시명을 스토어에 전달하고 검색 결과를 사용자에게 알리기 위해 생성했습니다.
async function handleSearchSubmit(rawQuery) {
  notify(await dashboardStore.searchCity(rawQuery))
}

// 브라우저에서 얻은 현재 좌표의 날씨 카드를 추가하기 위해 생성했습니다.
async function handleLocated({ lat, lon }) {
  notify(await dashboardStore.locate(lat, lon))
}

// 현재 위치 조회 실패 원인을 오류 토스트로 표시하기 위해 생성했습니다.
function handleLocationError(message) {
  ElMessage.error(message)
}

// 사용자가 누른 날씨 카드를 선택 상태로 반영하기 위해 생성했습니다.
function handleSelectCard(cityEntry) {
  dashboardStore.selectCard(cityEntry)
}

// 사용자가 삭제한 도시 카드를 대시보드에서 제거하기 위해 생성했습니다.
function handleRemoveCard(cityEntry) {
  notify(dashboardStore.removeCity(cityEntry))
}

// 선택한 도시의 상세 날씨 경로로 이동하기 위해 생성했습니다.
function handleClickDetail(cityEntry) {
  router.push(`/weather/${cityEntry.id}`)
}

// 대시보드와 추천곡 상태를 초기 설정으로 되돌리기 위해 생성했습니다.
function handleReset() {
  dashboardStore.resetDashboard()
  ElMessage.success('대시보드를 초기 상태로 되돌렸습니다.')
}
</script>

<template>
  <div class="weather-home">
    <BaseDashboardCard title="도시 검색 (한글 즉시 동기화)" icon="🔍">
      <SearchBar
        v-model="dashboardStore.searchQuery"
        :is-loading="dashboardStore.isSearching"
        @search="handleSearchSubmit"
      />
      <p class="weather-home__hint">
        검색 중인 도시: {{ dashboardStore.searchQuery || '(전체)' }}
      </p>
      <LocationButton @located="handleLocated" @location-error="handleLocationError" />
    </BaseDashboardCard>

    <BaseDashboardCard title="지역별 날씨 현황" icon="📋">
      <div class="weather-home__toolbar">
        <el-button size="small" @click="handleReset">초기화</el-button>
      </div>
      <p v-if="filteredDashboardCities.length === 0" class="weather-home__empty">
        {{
          dashboardStore.dashboardCities.length === 0
            ? '표시할 카드가 없습니다. 도시를 검색해 추가하세요.'
            : '일치하는 도시가 없습니다.'
        }}
      </p>
      <div v-else class="weather-home__grid">
        <WeatherCard
          v-for="city in filteredDashboardCities"
          :key="city.id"
          :city-data="city"
          @select-card="handleSelectCard"
          @click-detail="handleClickDetail"
          @remove-card="handleRemoveCard"
        />
      </div>
      <p v-if="dashboardStore.statusMessage" class="weather-home__status">
        {{ dashboardStore.statusMessage }}
      </p>
      <p v-else class="weather-home__status weather-home__status--muted">
        카드를 클릭하거나 검색해 보세요.
      </p>
    </BaseDashboardCard>

    <SongOfTheDay
      :song="dailySong"
      :is-loading="songStore.isSongLoading"
      :is-fallback="songStore.isFallback"
      :country-name="songStore.currentCountryName"
    />
  </div>
</template>

<style scoped>
.weather-home {
  max-width: 480px;
  margin: 0 auto;
  padding: 20px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weather-home__hint {
  margin: 8px 0;
  font-size: 13px;
  opacity: 0.8;
}

.weather-home__toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.weather-home__grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.weather-home__empty {
  padding: 16px 0;
  text-align: center;
  opacity: 0.8;
}

.weather-home__status {
  margin: 12px 0 0;
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(34, 197, 94, 0.2);
  text-align: center;
  font-size: 14px;
}

.weather-home__status--muted {
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 0.85;
}
</style>
