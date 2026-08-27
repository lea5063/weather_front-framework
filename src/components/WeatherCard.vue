<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore.js'
import { convertCelsiusTo } from '../utils/tempUnit.js'
import { getCityLocalTime, cityTimeZoneOption, formatUtcOffsetLabel } from '../utils/cityTime.js'
import { getCategoryFromWeatherData, CATEGORY_EMOJI } from '../utils/weatherCondition.js'
import { useClock } from '../composables/useClock.js'

const props = defineProps({
  cityData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail', 'remove-card'])

const configStore = useConfigStore()
const { now } = useClock()

const cityNow = computed(() => getCityLocalTime(now.value, props.cityData.weatherData?.timezone))
const cityTimeText = computed(() =>
  cityNow.value.toLocaleTimeString('ko-KR', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    ...cityTimeZoneOption(props.cityData.weatherData?.timezone),
  })
)
const utcOffsetLabel = computed(() => formatUtcOffsetLabel(props.cityData.weatherData?.timezone))

const rawCelsius = computed(() => props.cityData.weatherData?.main?.temp ?? null)
const displayTemp = computed(() => convertCelsiusTo(configStore.unit, rawCelsius.value))
const category = computed(() => getCategoryFromWeatherData(props.cityData.weatherData))
const description = computed(() => props.cityData.weatherData?.weather?.[0]?.description ?? '')
const isHot = computed(() => rawCelsius.value !== null && rawCelsius.value >= 25)

// 카드 클릭 사실과 선택한 도시 데이터를 부모 컴포넌트에 전달하기 위해 생성했습니다.
function handleCardClick() {
  emit('select-card', props.cityData)
}

// 상세보기 버튼에서 선택한 도시 데이터를 부모 컴포넌트에 전달하기 위해 생성했습니다.
function handleDetailClick() {
  emit('click-detail', props.cityData)
}

// 삭제 버튼에서 제거할 도시 데이터를 부모 컴포넌트에 전달하기 위해 생성했습니다.
function handleRemoveClick() {
  emit('remove-card', props.cityData)
}
</script>

<template>
  <el-card class="weather-card" shadow="hover" @click="handleCardClick">
    <button
      type="button"
      class="weather-card__remove"
      aria-label="이 카드 삭제"
      title="삭제"
      @click.stop="handleRemoveClick"
    >
      ×
    </button>
    <div v-if="cityData.isLoading" class="weather-card__status">불러오는 중...</div>
    <div v-else-if="cityData.errorMessage" class="weather-card__status weather-card__status--error">
      ⚠️ {{ cityData.errorMessage }}
    </div>
    <div v-else class="weather-card__body">
      <div class="weather-card__row">
        <span class="weather-card__name">{{ cityData.ko }}</span>
        <span class="weather-card__emoji">{{ category ? CATEGORY_EMOJI[category] : '🌈' }}</span>
      </div>
      <p class="weather-card__local-time">
        🕒 현지 시각 {{ cityTimeText }}
        <span v-if="utcOffsetLabel" class="weather-card__tz">({{ utcOffsetLabel }})</span>
      </p>
      <p class="weather-card__temp">현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <p class="weather-card__desc">{{ description }}</p>
      <span v-if="isHot" class="weather-card__badge weather-card__badge--hot">🔥 더움 (25도 이상)</span>
      <span v-else class="weather-card__badge weather-card__badge--cool">❄️ 선선함 (25도 미만)</span>
    </div>
    <el-button size="small" class="weather-card__detail-btn" @click.stop="handleDetailClick">
      상세보기
    </el-button>
  </el-card>
</template>

<style scoped>
.weather-card {
  position: relative;
  cursor: pointer;
  color: #1f2937;
}

.weather-card__remove {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 1;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.08);
  color: #6b7280;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
}

.weather-card__remove:hover {
  background-color: #fee2e2;
  color: #b91c1c;
}

.weather-card__status {
  padding: 12px 0;
  font-size: 14px;
  opacity: 0.8;
}

.weather-card__status--error {
  color: #b91c1c;
  font-weight: 600;
}

.weather-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.weather-card__name {
  font-weight: 700;
  font-size: 16px;
}

.weather-card__emoji {
  font-size: 22px;
}

.weather-card__local-time {
  margin: 4px 0 0;
  font-size: 12px;
  opacity: 0.75;
}

.weather-card__tz {
  opacity: 0.8;
}

.weather-card__temp {
  margin: 6px 0 2px;
  font-size: 15px;
}

.weather-card__desc {
  margin: 0 0 8px;
  font-size: 13px;
  opacity: 0.75;
}

.weather-card__badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.weather-card__badge--hot {
  background-color: #fee2e2;
  color: #b91c1c;
}

.weather-card__badge--cool {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.weather-card__detail-btn {
  margin-top: 10px;
}
</style>
