import { defineStore } from 'pinia'
import { DEFAULT_DASHBOARD_CITIES, findCityByKeyword, slugifyCityName } from '../data/cities.js'
import { fetchWeatherByCity, fetchWeatherByCoords } from '../api/weatherApi.js'
import { resolveEnglishCityName } from '../api/wikiCityResolver.js'
import { rememberCityName } from '../utils/recentCities.js'
import { useSongStore } from './songStore.js'

// 기본 도시마다 독립적인 로딩 상태를 가진 새 대시보드 카드 목록을 만들기 위해 생성했습니다.
function buildDefaultCities() {
  return DEFAULT_DASHBOARD_CITIES.map((city) => ({
    id: slugifyCityName(city.en),
    ko: city.ko,
    en: city.en,
    weatherData: null,
    isLoading: true,
    errorMessage: '',
  }))
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashboardCities: buildDefaultCities(),
    searchQuery: '',
    isSearching: false,
    isLocating: false,
    selectedCityInfo: null,
    statusMessage: '',
    hasInitialized: false,
  }),

  actions: {
    // 앱 세션에서 최초 한 번만 기본 도시 날씨와 한국 추천곡을 불러오기 위해 생성했습니다.
    async initializeIfNeeded() {
      if (this.hasInitialized) return
      this.hasInitialized = true
      await Promise.all(this.dashboardCities.map((city) => this.loadCityWeather(city)))
      await useSongStore().loadTopTracks('KR')
    },

    // 개별 도시 카드의 날씨와 로딩 및 오류 상태를 갱신하기 위해 생성했습니다.
    async loadCityWeather(cityEntry) {
      cityEntry.isLoading = true
      cityEntry.errorMessage = ''
      try {
        cityEntry.weatherData = await fetchWeatherByCity(cityEntry.en)
        rememberCityName(cityEntry.id, cityEntry.en, cityEntry.weatherData?.coord)
      } catch (error) {
        cityEntry.errorMessage = error.message
      } finally {
        cityEntry.isLoading = false
      }
    },

    // 사용자의 도시 검색어를 여러 폴백 방식으로 조회해 대시보드 카드를 추가하기 위해 생성했습니다.
    async searchCity(rawQuery) {
      if (this.isSearching) {
        return { type: 'error', message: '검색을 처리하는 중입니다. 잠시만 기다려 주세요.' }
      }
      this.isSearching = true
      try {
        const matchedCity = findCityByKeyword(rawQuery)
        const queryForApi = matchedCity ? matchedCity.en : rawQuery

        let data
        try {
          data = await fetchWeatherByCity(queryForApi)
        } catch (firstError) {
          const resolvedEnglishName = await resolveEnglishCityName(rawQuery)
          if (!resolvedEnglishName) throw firstError
          data = await fetchWeatherByCity(resolvedEnglishName)
        }

        const id = slugifyCityName(data.name)
        rememberCityName(id, data.name, data.coord)

        const existing = this.dashboardCities.find((c) => c.id === id)
        if (existing) {
          existing.weatherData = data
          existing.errorMessage = ''
          return { type: 'success', message: `${data.name}의 날씨를 새로고침했습니다.` }
        }

        this.dashboardCities.push({
          id,
          ko: matchedCity ? matchedCity.ko : data.name,
          en: data.name,
          weatherData: data,
          isLoading: false,
          errorMessage: '',
        })
        return { type: 'success', message: `${data.name} 카드를 추가했습니다.` }
      } catch (error) {
        return { type: 'error', message: error.message }
      } finally {
        this.isSearching = false
        this.searchQuery = ''
      }
    },

    // 좌표 날씨와 지도 지역 정보를 결합해 이름과 국가 코드가 보완된 카드를 추가하기 위해 생성했습니다.
    async locate(lat, lon, fallbackLocation = {}) {
      if (this.isLocating) {
        return { type: 'error', message: '위치를 확인하는 중입니다. 잠시만 기다려 주세요.' }
      }
      this.isLocating = true
      try {
        const data = await fetchWeatherByCoords(lat, lon)
        const fallbackCityName =
          typeof fallbackLocation === 'string' ? fallbackLocation : (fallbackLocation.name ?? '')
        const fallbackCountryCode =
          typeof fallbackLocation === 'object' ? fallbackLocation.countryCode : null
        const weatherData = fallbackCountryCode
          ? { ...data, sys: { ...data.sys, country: data.sys?.country || fallbackCountryCode } }
          : data
        const apiCityName = data.name?.trim()
        const displayName = apiCityName || fallbackCityName.trim() || '이름 없는 지역'
        const id = apiCityName
          ? slugifyCityName(apiCityName)
          : `location-${lat.toFixed(4)}-${lon.toFixed(4)}`
        rememberCityName(id, displayName, { lat, lon })

        const existing = this.dashboardCities.find((c) => c.id === id)
        if (existing) {
          existing.weatherData = weatherData
          existing.ko = displayName
          existing.en = displayName
          existing.errorMessage = ''
        } else {
          this.dashboardCities.push({
            id,
            ko: displayName,
            en: displayName,
            weatherData,
            isLoading: false,
            errorMessage: '',
          })
        }
        return { type: 'success', message: `${displayName}의 날씨를 불러왔습니다.` }
      } catch (error) {
        return { type: 'error', message: error.message }
      } finally {
        this.isLocating = false
      }
    },

    // 선택한 카드 상태를 기록하고 해당 국가의 추천곡 차트 전환을 요청하기 위해 생성했습니다.
    selectCard(cityEntry) {
      const status = cityEntry.weatherData?.weather?.[0]?.description ?? '정보 없음'
      this.selectedCityInfo = { ko: cityEntry.ko, status }
      this.statusMessage = `${cityEntry.ko}이(가) 선택되었습니다.`

      useSongStore().maybeLoadForCountry(cityEntry.weatherData?.sys?.country)
    },

    // 지정한 도시 카드를 목록에서 제거하고 관련 선택 상태를 정리하기 위해 생성했습니다.
    removeCity(cityEntry) {
      const index = this.dashboardCities.findIndex((c) => c.id === cityEntry.id)
      if (index === -1) {
        return { type: 'error', message: '이미 삭제된 카드입니다.' }
      }
      const [removed] = this.dashboardCities.splice(index, 1)

      if (this.selectedCityInfo?.ko === removed.ko) {
        this.selectedCityInfo = null
        this.statusMessage = ''
      }
      return { type: 'success', message: `${removed.ko} 카드를 삭제했습니다.` }
    },

    // 도시 목록과 추천곡 상태를 초기값으로 되돌린 뒤 기본 데이터를 다시 불러오기 위해 생성했습니다.
    resetDashboard() {
      useSongStore().$reset()
      this.$reset()
      this.initializeIfNeeded()
    },
  },
})
