import { ref, onMounted, onUnmounted } from 'vue'

const now = ref(new Date())
let timerId = null
let subscriberCount = 0

// 첫 구독자가 생길 때 앱에서 공유하는 현재 시각 타이머를 시작하기 위해 생성했습니다.
function startClock() {
  subscriberCount += 1
  if (timerId === null) {
    now.value = new Date()
    timerId = setInterval(() => {
      now.value = new Date()
    }, 1000)
  }
}

// 마지막 구독자가 사라질 때 공유 시각 타이머를 정리하기 위해 생성했습니다.
function stopClock() {
  subscriberCount = Math.max(0, subscriberCount - 1)
  if (subscriberCount === 0 && timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }
}

// 여러 컴포넌트가 하나의 반응형 현재 시각을 공유하도록 제공하기 위해 생성했습니다.
export function useClock() {
  onMounted(startClock)
  onUnmounted(stopClock)
  return { now }
}
