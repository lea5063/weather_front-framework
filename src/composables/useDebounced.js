import { ref, watch, onUnmounted } from 'vue'

// 원본 값의 변경이 잠시 멈춘 뒤에만 반응형 값에 반영하기 위해 생성했습니다.
export function useDebouncedRef(getter, delay = 200) {
  const debounced = ref(getter())
  let timerId = null

  watch(getter, (value) => {
    if (timerId) clearTimeout(timerId)
    timerId = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  onUnmounted(() => {
    if (timerId) clearTimeout(timerId)
  })

  return debounced
}
