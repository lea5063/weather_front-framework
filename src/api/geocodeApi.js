import axios from 'axios'

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse'

// 지도에서 선택한 좌표를 지역명과 국가 코드로 변환하기 위해 생성했습니다.
export async function reverseGeocodeCity(lat, lon) {
  const response = await axios.get(NOMINATIM_REVERSE_URL, {
    params: {
      lat,
      lon,
      format: 'jsonv2',
      addressdetails: 1,
      namedetails: 1,
      zoom: 10,
      'accept-language': 'ko',
    },
    timeout: 8000,
  })

  if (response.data?.error) return null

  const address = response.data?.address
  if (!address) return null

  const cityName =
    address.city ?? address.town ?? address.village ?? address.municipality ?? address.county
  if (!cityName) return null
  const nameDetails = response.data?.namedetails
  const displayName = nameDetails?.['name:ko'] ?? nameDetails?.['name:en'] ?? cityName

  return {
    name: displayName,
    countryCode: address.country_code?.toUpperCase() ?? null,
  }
}
