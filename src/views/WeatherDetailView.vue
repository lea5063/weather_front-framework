<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import WeatherDisplay from '../components/WeatherDisplay.vue'
import { fetchWeatherByCity, fetchWeatherByCoords } from '../api/weatherApi.js'
import { findCityBySlug } from '../data/cities.js'
import { getCategoryFromWeatherData } from '../utils/weatherCondition.js'
import { useDashboardStore } from '../stores/dashboardStore.js'
import { recallCityCoords, recallCityName } from '../utils/recentCities.js'

const route = useRoute()
const router = useRouter()
const dashboardStore = useDashboardStore()

const weatherData = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

const category = computed(() => getCategoryFromWeatherData(weatherData.value, 'clear'))

// 상세 경로의 도시 ID를 날씨 API가 조회할 수 있는 도시명으로 복원하기 위해 생성했습니다.
function resolveCityNameForApi(cityId) {
  const knownCity = findCityBySlug(cityId)
  if (knownCity) return knownCity.en

  const dashboardCity = dashboardStore.dashboardCities.find((city) => city.id === cityId)
  if (dashboardCity) return dashboardCity.en

  const remembered = recallCityName(cityId)
  if (remembered) return remembered

  return cityId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

let requestToken = 0

// 저장된 날씨나 좌표 또는 도시명을 사용해 상세 화면의 날씨 데이터를 불러오기 위해 생성했습니다.
async function loadDetail(cityId) {
  const myToken = ++requestToken
  isLoading.value = true
  errorMessage.value = ''

  try {
    const dashboardCity = dashboardStore.dashboardCities.find((city) => city.id === cityId)
    const savedCoords = recallCityCoords(cityId)
    const coords = dashboardCity?.weatherData?.coord ?? savedCoords
    const data = dashboardCity?.weatherData
      ? dashboardCity.weatherData
      : coords
        ? await fetchWeatherByCoords(coords.lat, coords.lon)
        : await fetchWeatherByCity(resolveCityNameForApi(cityId))
    if (myToken !== requestToken) return
    weatherData.value = data
  } catch (error) {
    if (myToken !== requestToken) return
    errorMessage.value = error.message
  } finally {
    if (myToken === requestToken) isLoading.value = false
  }
}

onMounted(() => loadDetail(route.params.cityId))

watch(
  () => route.params.cityId,
  (nextCityId) => {
    if (nextCityId) loadDetail(nextCityId)
  }
)

// 상세 화면에서 메인 대시보드로 돌아가기 위해 생성했습니다.
function handleGoBack() {
  router.push('/')
}
</script>

<template>
  <div class="weather-detail" :class="`weather-detail--${category}`">
    <div class="weather-detail__panel">
      <h2 class="weather-detail__title">📍 지역별 상세 기상관측 정보</h2>
      <WeatherDisplay
        :weather-data="weatherData"
        :category="category"
        :is-loading="isLoading"
        :error-message="errorMessage"
      />
      <el-button class="weather-detail__back" @click="handleGoBack">
        ← 메인 대시보드로 돌아가기
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.weather-detail {
  min-height: calc(100dvh - var(--nav-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 0.4s ease-in-out;
}

.weather-detail--clear {
  background-image: url('/weather-bg/clear.avif');
}
.weather-detail--clouds {
  background-image: url('/weather-bg/clouds.avif');
}
.weather-detail--rain {
  background-image: url('/weather-bg/rain.avif');
}
.weather-detail--snow {
  background-image: url('/weather-bg/snow.avif');
}

.weather-detail__panel {
  width: 100%;
  max-width: 420px;
  padding: 20px;
  border-radius: 20px;
  background-color: rgba(17, 24, 39, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.weather-detail__title {
  text-align: center;
  font-size: 18px;
  margin: 0 0 16px;
}

.weather-detail__back {
  margin-top: 16px;
  width: 100%;
}
</style>
