<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useLeafletMap } from '../composables/useLeafletMap.js'
import { reverseGeocodeCity } from '../api/geocodeApi.js'
import { useDashboardStore } from '../stores/dashboardStore.js'
import { logger } from '../utils/logger.js'

const dashboardStore = useDashboardStore()
const mapContainer = ref(null)
const isResolving = ref(false)

// 지도 클릭 좌표의 지역을 확인하고 해당 위치의 날씨 카드를 대시보드에 추가하기 위해 생성했습니다.
async function handleMapClick(lat, lon) {
  if (isResolving.value) return

  isResolving.value = true
  try {
    let location
    try {
      location = await reverseGeocodeCity(lat, lon)
    } catch (geocodeError) {
      logger.warn('[WeatherMapView] 역지오코딩 요청 실패:', geocodeError.message)
      ElMessage.error('위치 정보를 가져오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.')
      return
    }

    if (!location) {
      ElMessage.error('바다이거나 인식할 수 없는 지역입니다. 육지의 도시를 클릭해 주세요.')
      return
    }

    const result = await dashboardStore.locate(lat, lon, location)
    if (result.type === 'success') {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  } finally {
    isResolving.value = false
  }
}

useLeafletMap(mapContainer, handleMapClick)
</script>

<template>
  <div class="weather-map">
    <div class="weather-map__toolbar">
      <RouterLink to="/" class="weather-map__back">← 메인 대시보드로 돌아가기</RouterLink>
      <p class="weather-map__hint">
        {{
          isResolving ? '위치를 확인하는 중...' : '지도에서 도시를 클릭하면 대시보드에 추가됩니다.'
        }}
      </p>
    </div>
    <div ref="mapContainer" class="weather-map__canvas"></div>
  </div>
</template>

<style scoped>
.weather-map {
  display: flex;
  flex-direction: column;
  height: calc(100dvh - var(--nav-height));
}

.weather-map__toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  background-color: rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.weather-map__back {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;
}

.weather-map__back:hover {
  text-decoration: underline;
}

.weather-map__hint {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.weather-map__canvas {
  flex: 1;
  width: 100%;
}
</style>
