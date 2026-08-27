<script setup>
import { ref } from 'vue'

const emit = defineEmits(['located', 'location-error'])

const isLocating = ref(false)

// 브라우저 위치 권한을 요청하고 성공한 좌표 또는 실패 메시지를 부모에게 전달하기 위해 생성했습니다.
function handleClick() {
  if (!('geolocation' in navigator)) {
    emit('location-error', '이 브라우저는 위치 정보 기능을 지원하지 않습니다.')
    return
  }

  isLocating.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      isLocating.value = false
      emit('located', {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      })
    },
    (error) => {
      isLocating.value = false
      emit('location-error', mapGeolocationError(error))
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000,
    }
  )
}

// 브라우저 위치 조회 오류 코드를 사용자가 이해할 수 있는 문장으로 바꾸기 위해 생성했습니다.
function mapGeolocationError(error) {
  switch (error.code) {
    case 1:
      return '위치 정보 제공에 동의하지 않으셨습니다. 브라우저 설정에서 위치 권한을 허용한 뒤 다시 시도해주세요.'
    case 2:
      return '현재 위치를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.'
    case 3:
      return '위치 확인 요청이 시간 초과되었습니다. 다시 시도해주세요.'
    default:
      return '위치 정보를 가져오는 중 알 수 없는 오류가 발생했습니다.'
  }
}
</script>

<template>
  <button type="button" class="location-button" :disabled="isLocating" @click="handleClick">
    {{ isLocating ? '📍 위치 확인 중...' : '📍 현재 위치 날씨 보기' }}
  </button>
</template>

<style scoped>
.location-button {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.15);
  color: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.location-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.28);
}

.location-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
