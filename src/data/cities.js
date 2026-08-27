export const CITY_LIST = [
  { ko: '서울', en: 'Seoul' },
  { ko: '부산', en: 'Busan' },
  { ko: '인천', en: 'Incheon' },
  { ko: '대구', en: 'Daegu' },
  { ko: '대전', en: 'Daejeon' },
  { ko: '광주', en: 'Gwangju' },
  { ko: '울산', en: 'Ulsan' },
  { ko: '세종', en: 'Sejong' },
  { ko: '수원', en: 'Suwon' },
  { ko: '성남', en: 'Seongnam' },
  { ko: '고양', en: 'Goyang' },
  { ko: '용인', en: 'Yongin' },
  { ko: '청주', en: 'Cheongju' },
  { ko: '전주', en: 'Jeonju' },
  { ko: '천안', en: 'Cheonan' },
  { ko: '안산', en: 'Ansan' },
  { ko: '안양', en: 'Anyang' },
  { ko: '포항', en: 'Pohang' },
  { ko: '제주', en: 'Jeju' },
  { ko: '창원', en: 'Changwon' },
  { ko: '김해', en: 'Gimhae' },
  { ko: '춘천', en: 'Chuncheon' },
  { ko: '강릉', en: 'Gangneung' },
  { ko: '여수', en: 'Yeosu' },
  { ko: '목포', en: 'Mokpo' },
  { ko: '구미', en: 'Gumi' },
  { ko: '경주', en: 'Gyeongju' },
  { ko: '원주', en: 'Wonju' },
  { ko: '순천', en: 'Suncheon' },
  { ko: '평택', en: 'Pyeongtaek' },
  { ko: '도쿄', en: 'Tokyo' },
  { ko: '오사카', en: 'Osaka' },
  { ko: '뉴욕', en: 'New York' },
  { ko: '런던', en: 'London' },
  { ko: '파리', en: 'Paris' },
  { ko: '베이징', en: 'Beijing' },
  { ko: '상하이', en: 'Shanghai' },
  { ko: '방콕', en: 'Bangkok' },
  { ko: '싱가포르', en: 'Singapore' },
  { ko: '시드니', en: 'Sydney' },
]

// 영문 도시명을 상세 경로에서 사용할 소문자 하이픈 ID로 변환하기 위해 생성했습니다.
export function slugifyCityName(enName) {
  return enName.trim().toLowerCase().replace(/\s+/g, '-')
}

// 상세 경로의 도시 ID와 일치하는 로컬 도시 정보를 찾기 위해 생성했습니다.
export function findCityBySlug(slug) {
  if (!slug) return null
  return CITY_LIST.find((city) => slugifyCityName(city.en) === slug) ?? null
}

export const DEFAULT_DASHBOARD_CITIES = ['서울', '수원', '부산']
  .map((ko) => CITY_LIST.find((city) => city.ko === ko))
  .filter(Boolean)

// 사용자가 입력한 한글 또는 영문 도시명과 정확히 일치하는 도시 정보를 찾기 위해 생성했습니다.
export function findCityByKeyword(keyword) {
  if (!keyword) return null
  const normalized = keyword.trim().toLowerCase()
  if (!normalized) return null

  return (
    CITY_LIST.find(
      (city) => city.ko.toLowerCase() === normalized || city.en.toLowerCase() === normalized
    ) ?? null
  )
}
