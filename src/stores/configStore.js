import { defineStore } from 'pinia'
import { logger } from '../utils/logger.js'

const STORAGE_KEY = 'weather:unit'
const VALID_UNITS = ['celsius', 'fahrenheit']

// localStorage에서 유효한 온도 단위를 읽고 없으면 섭씨를 기본값으로 사용하기 위해 생성했습니다.
function loadUnit() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return VALID_UNITS.includes(saved) ? saved : 'celsius'
  } catch {
    return 'celsius'
  }
}

export const useConfigStore = defineStore('config', {
  state: () => ({
    unit: loadUnit(),
  }),
  getters: {
    unitSymbol: (state) => (state.unit === 'celsius' ? '°C' : '°F'),
  },
  actions: {
    // 검증된 온도 단위를 전역 상태와 localStorage에 함께 반영하기 위해 생성했습니다.
    setUnit(newUnit) {
      if (!VALID_UNITS.includes(newUnit)) {
        logger.warn(`Invalid unit value: ${newUnit}`)
        return
      }
      this.unit = newUnit
      try {
        localStorage.setItem(STORAGE_KEY, newUnit)
      } catch {}
    },

    // 현재 온도 단위를 섭씨와 화씨 중 반대 값으로 전환하기 위해 생성했습니다.
    toggleUnit() {
      this.setUnit(this.unit === 'celsius' ? 'fahrenheit' : 'celsius')
    },
  },
})
