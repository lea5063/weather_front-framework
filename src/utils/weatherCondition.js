export const WEATHER_CATEGORY = {
  CLEAR: 'clear',
  CLOUDS: 'clouds',
  RAIN: 'rain',
  SNOW: 'snow',
}

// OpenWeatherMap 상태 코드를 화면 배경에 사용할 네 가지 날씨 분류로 변환하기 위해 생성했습니다.
export function getWeatherCategory(weatherId) {
  const id = Number(weatherId)

  if (Number.isNaN(id)) {
    return WEATHER_CATEGORY.CLOUDS
  }
  if (id >= 200 && id < 600) return WEATHER_CATEGORY.RAIN
  if (id >= 600 && id < 700) return WEATHER_CATEGORY.SNOW
  if (id >= 700 && id < 800) return WEATHER_CATEGORY.CLOUDS
  if (id === 800) return WEATHER_CATEGORY.CLEAR
  if (id > 800 && id < 900) return WEATHER_CATEGORY.CLOUDS

  return WEATHER_CATEGORY.CLOUDS
}

// 날씨 응답 객체에서 상태 코드를 안전하게 꺼내 화면용 날씨 분류를 반환하기 위해 생성했습니다.
export function getCategoryFromWeatherData(weatherData, fallback = null) {
  const id = weatherData?.weather?.[0]?.id
  return id === undefined || id === null ? fallback : getWeatherCategory(id)
}

export const CATEGORY_EMOJI = {
  clear: '☀️',
  clouds: '☁️',
  rain: '🌧️',
  snow: '❄️',
}
