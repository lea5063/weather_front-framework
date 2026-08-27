// 섭씨 원본 온도를 사용자가 선택한 섭씨 또는 화씨 표시값으로 변환하기 위해 생성했습니다.
export function convertCelsiusTo(unit, celsiusTemp) {
  if (celsiusTemp === undefined || celsiusTemp === null || Number.isNaN(celsiusTemp)) {
    return null
  }
  if (unit === 'fahrenheit') {
    return Math.round((celsiusTemp * 9) / 5 + 32)
  }
  return Math.round(celsiusTemp)
}
