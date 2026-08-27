<script setup>
import { computed } from 'vue'
import { useClock } from '../composables/useClock.js'
import { useConfigStore } from '../stores/configStore.js'
import { convertCelsiusTo } from '../utils/tempUnit.js'
import { getCityLocalTime, cityTimeZoneOption, formatUtcOffsetLabel } from '../utils/cityTime.js'
import { CATEGORY_EMOJI } from '../utils/weatherCondition.js'

const props = defineProps({
  weatherData: { type: Object, default: null },
  category: { type: String, default: 'clear' },
  isLoading: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
})

const { now } = useClock()
const configStore = useConfigStore()

const cityNow = computed(() => getCityLocalTime(now.value, props.weatherData?.timezone))
const tzFormatOption = computed(() => cityTimeZoneOption(props.weatherData?.timezone))
const utcOffsetLabel = computed(() => formatUtcOffsetLabel(props.weatherData?.timezone))

const dateText = computed(() =>
  cityNow.value.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    ...tzFormatOption.value,
  })
)

const timeText = computed(() =>
  cityNow.value.toLocaleTimeString('ko-KR', { hour12: false, ...tzFormatOption.value })
)

const displayTemp = computed(() =>
  convertCelsiusTo(configStore.unit, props.weatherData?.main?.temp ?? null)
)
</script>

<template>
  <section class="weather-display" :class="`weather-display--${category}`">
    <div class="weather-display__datetime">
      <p class="weather-display__date">
        {{ dateText }}
        <span v-if="utcOffsetLabel" class="weather-display__tz">({{ utcOffsetLabel }})</span>
      </p>
      <p class="weather-display__time">{{ timeText }}</p>
    </div>

    <div v-if="isLoading" class="weather-display__status">날씨 정보를 불러오는 중입니다...</div>

    <div v-else-if="errorMessage" class="weather-display__status weather-display__status--error">
      ⚠️ {{ errorMessage }}
    </div>

    <div v-else-if="!weatherData" class="weather-display__status">
      도시를 검색하거나 현재 위치 버튼을 눌러 날씨를 확인하세요.
    </div>

    <div v-else class="weather-display__body">
      <p class="weather-display__city">
        {{ weatherData.name
        }}<span v-if="weatherData.sys?.country">, {{ weatherData.sys.country }}</span>
      </p>
      <p class="weather-display__emoji">{{ CATEGORY_EMOJI[category] ?? '🌈' }}</p>
      <p class="weather-display__temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <p class="weather-display__desc">{{ weatherData.weather?.[0]?.description }}</p>
      <p class="weather-display__humidity">💧 습도 {{ weatherData.main.humidity }}%</p>
    </div>
  </section>
</template>

<style scoped>
.weather-display {
  border-radius: 16px;
  padding: 24px;
  color: #fff;
  text-align: center;
  transition: background 0.4s ease-in-out;
}

.weather-display--clear {
  background: linear-gradient(160deg, #4facfe 0%, #00c6fb 100%);
}
.weather-display--clouds {
  background: linear-gradient(160deg, #757f9a 0%, #d7dde8 100%);
}
.weather-display--rain {
  background: linear-gradient(160deg, #1f2937 0%, #4b6584 100%);
}
.weather-display--snow {
  background: linear-gradient(160deg, #83a4d4 0%, #e6f0fa 100%);
  color: #1f2937;
}

.weather-display__datetime {
  margin-bottom: 16px;
  opacity: 0.9;
}
.weather-display__date {
  font-size: 14px;
  margin: 0;
}
.weather-display__tz {
  opacity: 0.75;
  font-size: 12px;
}
.weather-display__time {
  font-size: 24px;
  font-weight: 700;
  margin: 4px 0 0;
}

.weather-display__status {
  padding: 24px 0;
  font-size: 14px;
  opacity: 0.9;
}
.weather-display__status--error {
  color: #ffe4e4;
  font-weight: 600;
}

.weather-display__city {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
.weather-display__emoji {
  font-size: 48px;
  margin: 8px 0;
}
.weather-display__temp {
  font-size: 40px;
  font-weight: 700;
  margin: 0;
}
.weather-display__desc {
  margin: 4px 0 8px;
  font-size: 15px;
}
.weather-display__humidity {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}
</style>
