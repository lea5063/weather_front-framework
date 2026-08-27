import axios from 'axios'
import { logger } from '../utils/logger.js'

const WIKI_API_BASE = 'https://ko.wikipedia.org/w/api.php'

const resolutionCache = new Map()

// 사용자가 입력한 한글 지명과 가장 가까운 한국어 위키백과 문서 제목을 찾기 위해 생성했습니다.
async function searchWikiTitle(query) {
  const response = await axios.get(WIKI_API_BASE, {
    params: {
      action: 'query',
      list: 'search',
      srsearch: query,
      srlimit: 1,
      format: 'json',
      origin: '*',
    },
    timeout: 8000,
  })
  const hits = response.data?.query?.search
  return hits && hits.length > 0 ? hits[0].title : null
}

// 한국어 위키백과 문서에 연결된 영어판 도시명을 가져오기 위해 생성했습니다.
async function fetchEnglishLangLink(koreanTitle) {
  const response = await axios.get(WIKI_API_BASE, {
    params: {
      action: 'query',
      titles: koreanTitle,
      prop: 'langlinks',
      lllang: 'en',
      redirects: 1,
      format: 'json',
      origin: '*',
    },
    timeout: 8000,
  })
  const pages = response.data?.query?.pages
  if (!pages) return null

  const page = Object.values(pages)[0]
  const englishTitle = page?.langlinks?.[0]?.['*']
  if (!englishTitle) return null

  return englishTitle.replace(/\s*\([^)]*\)\s*$/, '').trim()
}

// 날씨 API가 인식하지 못한 한글 지명을 영문 도시명으로 보완하기 위해 생성했습니다.
export async function resolveEnglishCityName(koreanQuery) {
  const normalized = koreanQuery.trim()
  if (!normalized) return null

  if (resolutionCache.has(normalized)) {
    return resolutionCache.get(normalized)
  }

  let result = null
  try {
    const title = await searchWikiTitle(normalized)
    if (title) {
      result = await fetchEnglishLangLink(title)
    }
  } catch (error) {
    logger.warn('[wikiCityResolver] 위키백과 조회 실패:', error.message)
    result = null
  }

  resolutionCache.set(normalized, result)
  return result
}
