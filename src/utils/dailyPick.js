// 같은 날짜에는 같은 추천곡이 선택되도록 날짜 기반 인덱스를 계산하기 위해 생성했습니다.
export function getDailyIndex(listLength, dateObj = new Date()) {
  if (!listLength || listLength <= 0) return -1

  const seed =
    dateObj.getFullYear() * 10000 + (dateObj.getMonth() + 1) * 100 + dateObj.getDate()

  let h = seed >>> 0
  h ^= h << 13
  h ^= h >>> 17
  h ^= h << 5
  h >>>= 0

  return h % listLength
}
