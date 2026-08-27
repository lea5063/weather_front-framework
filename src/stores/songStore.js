import { defineStore } from 'pinia'
import { fetchTopTracksByCountry } from '../api/lastfmApi.js'
import { getDisplayCountryName } from '../data/countryNames.js'
import { FALLBACK_TRACKS_KR } from '../data/fallbackTracksKr.js'
import { logger } from '../utils/logger.js'

let requestToken = 0

export const useSongStore = defineStore('song', {
  state: () => ({
    topTracks: [],
    isSongLoading: false,
    songErrorMessage: '',
    currentCountryCode: 'KR',
  }),

  getters: {
    currentCountryName: (state) => getDisplayCountryName(state.currentCountryCode),

    sourceList: (state) => {
      if (state.topTracks.length > 0) return state.topTracks
      return state.currentCountryCode === 'KR' ? FALLBACK_TRACKS_KR : []
    },

    isFallback: (state) =>
      state.topTracks.length === 0 &&
      !state.isSongLoading &&
      state.currentCountryCode === 'KR',
  },

  actions: {
    // 국가별 인기곡을 불러오고 최신 요청만 상태에 반영하기 위해 생성했습니다.
    async loadTopTracks(countryCode) {
      const code = (countryCode ?? 'KR').toUpperCase()
      const myToken = ++requestToken
      this.isSongLoading = true
      this.songErrorMessage = ''
      try {
        const tracks = await fetchTopTracksByCountry(code, 50)
        if (myToken !== requestToken) return
        this.topTracks = tracks
        this.currentCountryCode = code
      } catch (error) {
        if (myToken !== requestToken) return
        logger.warn(`[songStore] Last.fm 조회 실패(${code}), 폴백 사용:`, error.message)
        this.songErrorMessage = error.message
        this.topTracks = []
        this.currentCountryCode = code
      } finally {
        if (myToken === requestToken) this.isSongLoading = false
      }
    },

    // 선택한 도시의 국가가 현재 차트와 다를 때만 새 추천곡 요청을 시작하기 위해 생성했습니다.
    maybeLoadForCountry(countryCode) {
      if (countryCode && countryCode !== this.currentCountryCode) {
        this.loadTopTracks(countryCode)
      }
    },
  },
})
