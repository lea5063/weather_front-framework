import axios from 'axios'
import { logger } from '../utils/logger.js'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const weatherClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  params: {
    appid: API_KEY,
    units: 'metric',
    lang: 'kr',
  },
})

// OpenWeatherMap 요청 오류를 사용자가 이해할 수 있는 한국어 메시지로 변환하기 위해 생성했습니다.
function toFriendlyErrorMessage(error) {
  if (!API_KEY) {
    return 'OpenWeatherMap API 키가 설정되지 않았습니다. .env 파일의 VITE_OPENWEATHER_API_KEY 값을 확인해주세요.'
  }
  if (axios.isCancel?.(error)) {
    return '요청이 취소되었습니다.'
  }
  if (error.code === 'ECONNABORTED') {
    return '서버 응답이 너무 늦어 요청을 취소했습니다. 잠시 후 다시 시도해주세요.'
  }
  const status = error.response?.status
  if (status === 401) {
    return 'API 키가 유효하지 않습니다. OpenWeatherMap에서 발급받은 키와 활성화 상태를 확인해주세요.'
  }
  if (status === 404) {
    return '해당 도시를 찾을 수 없습니다. 도시명을 다시 확인해주세요. (예: 서울, Seoul)'
  }
  if (status === 429) {
    return 'API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
  }
  if (!error.response) {
    return '네트워크 연결을 확인해주세요.'
  }
  return '날씨 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.'
}

// 영문 도시명을 기준으로 OpenWeatherMap의 현재 날씨를 조회하기 위해 생성했습니다.
export async function fetchWeatherByCity(cityEnglishName) {
  try {
    const response = await weatherClient.get('', {
      params: { q: cityEnglishName },
    })
    return response.data
  } catch (error) {
    logger.error('[weatherApi] fetchWeatherByCity 실패:', error)
    throw new Error(toFriendlyErrorMessage(error), { cause: error })
  }
}

// 위도와 경도를 기준으로 OpenWeatherMap의 현재 날씨를 조회하기 위해 생성했습니다.
export async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await weatherClient.get('', {
      params: { lat, lon },
    })
    return response.data
  } catch (error) {
    logger.error('[weatherApi] fetchWeatherByCoords 실패:', error)
    throw new Error(toFriendlyErrorMessage(error), { cause: error })
  }
}
