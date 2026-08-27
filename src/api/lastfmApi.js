import axios from 'axios'
import { getCountryNameCandidates } from '../data/countryNames.js'
import { logger } from '../utils/logger.js'

const BASE_URL = '/api/lastfm/'

const lastfmClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  params: {
    method: 'geo.gettoptracks',
    format: 'json',
  },
})

const workingCountryNameCache = new Map()

// Last.fm 요청 오류를 화면에 표시할 이해하기 쉬운 한국어 메시지로 바꾸기 위해 생성했습니다.
function toFriendlyErrorMessage(error) {
  if (error.code === 'ECONNABORTED') {
    return 'Last.fm 응답이 너무 늦어 요청을 취소했습니다.'
  }
  if (!error.response) {
    return '네트워크 연결을 확인해주세요. (Last.fm)'
  }

  const lastfmErrorCode = error.response?.data?.error
  switch (lastfmErrorCode) {
    case 10:
    case 26:
      return 'Last.fm API 키가 유효하지 않거나 서버에 설정되지 않았습니다. (LASTFM_API_KEY)'
    case 29:
      return 'Last.fm API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
    case 8:
    case 11:
    case 16:
      return 'Last.fm 서버가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.'
    default:
      return '추천곡 목록을 불러오는 중 오류가 발생했습니다.'
  }
}

// 선택한 국가의 Last.fm 인기곡 목록을 국가명 후보를 순서대로 시도해 가져오기 위해 생성했습니다.
export async function fetchTopTracksByCountry(countryCode, limit = 50) {
  const code = (countryCode ?? '').toUpperCase()
  const baseCandidates = getCountryNameCandidates(code)

  if (baseCandidates.length === 0) {
    throw new Error('국가 정보가 없어 추천곡을 조회할 수 없습니다.')
  }

  const cached = workingCountryNameCache.get(code)
  const candidates = cached
    ? [cached, ...baseCandidates.filter((c) => c !== cached)]
    : baseCandidates

  let lastError = null

  for (const country of candidates) {
    try {
      const response = await lastfmClient.get('', { params: { limit, country } })

      if (response.data?.error) {
        logger.warn(
          `[lastfmApi] country="${country}"(${code}) 실패 (code ${response.data.error}: ${response.data.message}) - 다음 후보 시도`
        )
        lastError = { response }
        continue
      }

      workingCountryNameCache.set(code, country)
      logger.log(`[lastfmApi] ${code} -> country="${country}" 로 조회 성공`)

      const rawTracks = response.data?.tracks?.track ?? []

      return rawTracks.map((track) => ({
        artist: track.artist?.name ?? '알 수 없는 아티스트',
        title: track.name ?? '알 수 없는 곡',
      }))
    } catch (error) {
      logger.error(`[lastfmApi] fetchTopTracksByCountry(${code}) 실패 (네트워크/서버 오류)`, {
        status: error.response?.status,
        body: error.response?.data,
        message: error.message,
      })
      throw new Error(toFriendlyErrorMessage(error), { cause: error })
    }
  }

  logger.error(`[lastfmApi] ${code}: 모든 country 후보 실패:`, candidates)
  throw new Error(toFriendlyErrorMessage(lastError))
}
