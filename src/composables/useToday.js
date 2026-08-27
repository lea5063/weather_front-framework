import { ref, onMounted, onUnmounted } from 'vue'

const today = ref(new Date())
let timerId = null
let subscriberCount = 0

// 두 Date 값이 같은 달력 날짜인지 비교하기 위해 생성했습니다.
function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// 날짜가 바뀐 경우에만 공유 today 값을 새 날짜로 갱신하기 위해 생성했습니다.
function tick() {
  const nowDate = new Date()
  if (!sameDay(nowDate, today.value)) today.value = nowDate
}

// 첫 구독자가 생길 때 날짜 변경 확인 타이머를 시작하기 위해 생성했습니다.
function start() {
  subscriberCount += 1
  if (timerId === null) {
    tick()
    timerId = setInterval(tick, 60_000)
  }
}

// 마지막 구독자가 사라질 때 날짜 변경 확인 타이머를 정리하기 위해 생성했습니다.
function stop() {
  subscriberCount = Math.max(0, subscriberCount - 1)
  if (subscriberCount === 0 && timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }
}

// 여러 컴포넌트가 하루 단위로 갱신되는 반응형 날짜를 공유하도록 제공하기 위해 생성했습니다.
export function useToday() {
  onMounted(start)
  onUnmounted(stop)
  return { today }
}
