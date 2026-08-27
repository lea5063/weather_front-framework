// 기준 시각에 도시의 UTC 오프셋을 적용해 현지 시각을 계산하기 위해 생성했습니다.
export function getCityLocalTime(baseDate, timezoneOffsetSeconds) {
  if (timezoneOffsetSeconds === undefined || timezoneOffsetSeconds === null) {
    return baseDate
  }
  return new Date(baseDate.getTime() + timezoneOffsetSeconds * 1000)
}

// 오프셋을 적용한 시각을 중복 보정 없이 출력할 Intl 시간대 옵션을 만들기 위해 생성했습니다.
export function cityTimeZoneOption(timezoneOffsetSeconds) {
  return timezoneOffsetSeconds === undefined || timezoneOffsetSeconds === null
    ? {}
    : { timeZone: 'UTC' }
}

// 초 단위 UTC 오프셋을 UTC+9 또는 UTC+5:30 형태의 라벨로 표시하기 위해 생성했습니다.
export function formatUtcOffsetLabel(timezoneOffsetSeconds) {
  if (timezoneOffsetSeconds === undefined || timezoneOffsetSeconds === null) return ''
  const totalMinutes = timezoneOffsetSeconds / 60
  const sign = totalMinutes >= 0 ? '+' : '-'
  const abs = Math.abs(totalMinutes)
  const hours = Math.floor(abs / 60)
  const minutes = abs % 60
  return minutes === 0
    ? `UTC${sign}${hours}`
    : `UTC${sign}${hours}:${String(minutes).padStart(2, '0')}`
}
