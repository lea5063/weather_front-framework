# Weather Dashboard

Vue 3로 만든 날씨 대시보드입니다. 도시를 검색하거나 현재 위치와 지도에서 도시를 추가할 수 있고, 선택한 도시의 날씨와 현지 시각을 확인할 수 있습니다.

## 주요 기능

- 한글·영문 도시 검색
- 현재 위치와 지도 클릭으로 도시 추가
- 섭씨·화씨 전환
- 도시별 현재 날씨, 습도, 현지 시각 표시
- 국가별 Last.fm 인기곡 중 오늘의 곡 추천
- 상세 화면과 404 화면을 포함한 SPA 라우팅

## 사용 기술

- Vue 3, Vue Router, Pinia
- Axios, Element Plus, Leaflet
- Vite
- OpenWeatherMap, Last.fm, OpenStreetMap Nominatim, MediaWiki API

## 로컬 실행

Node.js를 설치한 뒤 프로젝트 루트에서 의존성을 설치합니다.

```bash
npm install
```

`.env.example`을 복사해 `.env`를 만들고 API 키를 입력합니다.

```env
VITE_OPENWEATHER_API_KEY=your_openweather_key
LASTFM_API_KEY=your_lastfm_key
```

- [OpenWeatherMap API key](https://openweathermap.org/api)
- [Last.fm API key](https://www.last.fm/api/account/create)

개발 서버를 실행합니다.

```bash
npm run dev
```

OpenWeatherMap 요청은 브라우저에서 직접 보내기 때문에 키 이름에 `VITE_` 접두사가 필요합니다. 이 값은 빌드 결과에도 포함되므로 비밀 키로 취급할 수 없습니다.

Last.fm 키는 브라우저에 전달하지 않습니다. 로컬에서는 Vite 미들웨어가, Vercel에서는 `/api/lastfm` 서버리스 함수가 키를 붙여 요청합니다.

## 명령어

| 명령어 | 용도 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run build:staging` | staging 모드 빌드 |
| `npm run build:production` | production 모드 빌드 |
| `npm run preview` | 빌드 결과 확인 |
| `npm run lint` | ESLint 검사 |
| `npm run lint:fix` | ESLint 자동 수정 |
| `npm run format` | Prettier 적용 |

## 배포

### Vercel

이 저장소는 Vercel 배포를 기준으로 설정되어 있습니다.

1. 저장소를 Vercel 프로젝트로 가져옵니다.
2. Environment Variables에 다음 값을 등록합니다.
   - `VITE_OPENWEATHER_API_KEY`
   - `LASTFM_API_KEY`
3. 배포합니다.

`api/lastfm.js`가 Last.fm 프록시로 동작하고, `vercel.json`은 `/map`, `/weather/:cityId` 같은 주소를 새로고침해도 Vue Router가 처리할 수 있도록 설정합니다.

배포된 사이트를 사용하는 사람은 별도로 API 키를 입력할 필요가 없습니다. 다만 OpenWeatherMap 키는 클라이언트 번들에서 확인할 수 있으므로 사용량 제한과 도메인 제한을 설정하는 편이 좋습니다. Last.fm 키는 Vercel 서버 환경변수에만 저장됩니다.

### 정적 호스팅

GitHub Pages나 S3처럼 정적 파일만 제공하는 환경에서는 추가 설정이 필요합니다.

- 모든 페이지 경로를 `index.html`로 보내는 SPA rewrite
- `/api/lastfm`을 처리할 별도 서버 또는 서버리스 함수

프록시가 없으면 Last.fm 실시간 차트는 실패하며, 한국 차트에는 프로젝트에 포함된 샘플 목록이 대신 표시됩니다.

## 프로젝트 구조

```text
api/                 Vercel 서버리스 함수
server/              Last.fm 프록시 공통 로직
src/
  api/               외부 API 호출
  components/        화면 구성 요소
  composables/       시계, 날짜, 지도 생명주기 등 재사용 로직
  data/              도시·국가 이름과 추천곡 폴백 데이터
  router/             페이지 라우팅
  stores/             Pinia 상태 관리
  utils/              온도, 시간, 날씨 분류 등의 순수 함수
  views/              홈, 상세, 지도, 소개, 404 화면
```

## 주요 구현

### 대시보드 상태

도시 카드 목록은 `dashboardStore`에서 관리합니다. 페이지를 이동해도 카드가 사라지지 않고, 초기화 버튼을 눌렀을 때만 기본 도시 목록으로 돌아갑니다.

### 도시 검색

자주 사용하는 도시는 `src/data/cities.js`의 한글·영문 이름을 사용합니다. 사전에 없는 한글 지명은 OpenWeatherMap 조회 실패 후 한국어 위키백과의 영어 문서명을 찾아 한 번 더 조회합니다.

### 현지 시각

OpenWeatherMap의 UTC offset을 현재 시각에 적용합니다. 카드마다 타이머를 만들지 않고 `useClock`의 타이머 하나를 공유합니다.

### 오늘의 추천곡

도시 카드 선택 시 해당 국가의 Last.fm 차트를 불러옵니다. 날짜를 seed로 사용해 같은 날에는 같은 곡이 표시됩니다. 한국 차트 조회가 실패하면 로컬 샘플 데이터를 사용합니다.

### 지도

Leaflet과 OpenStreetMap 타일을 사용합니다. 지도 클릭 좌표를 Nominatim으로 역지오코딩한 뒤 OpenWeatherMap에서 같은 좌표의 날씨를 조회합니다.

Nominatim과 OpenWeatherMap은 서로 다른 지역 데이터를 사용합니다. 작은 도시나 행정구역은 Nominatim에서는 이름과 국가가 확인되지만 OpenWeatherMap의 좌표 응답에는 도시명이나 국가 코드가 비어 있을 수 있습니다. 이 경우 카드에는 Nominatim에서 받은 지역명을 표시하고, 상세 화면은 저장한 좌표로 날씨를 다시 조회합니다. 추천곡 역시 Nominatim의 국가 코드를 폴백으로 사용하므로 해당 국가 차트로 전환됩니다. 따라서 빈 제목, `/weather/` 404, 국가별 추천곡이 바뀌지 않는 문제를 방지합니다.

지도에서 도시·마을 이름을 찾지 못하면 가장 가까운 행정구역 이름이 표시될 수 있습니다. 지역명이 현지 문자와 영어를 함께 제공하는 경우에는 한국어 이름, 영어 이름, 원본 이름 순서로 하나만 선택해 표시합니다.

## 라우트

| 경로 | 화면 |
| --- | --- |
| `/` | 날씨 대시보드 |
| `/weather/:cityId` | 도시 상세 날씨 |
| `/map` | 지도에서 도시 추가 |
| `/about` | 서비스 소개 |
| 그 외 | 404 |

## 알려진 제약

- OpenWeatherMap 키는 클라이언트 번들에 포함됩니다.
- Nominatim 공개 서버는 호출 제한이 있으므로 트래픽이 많은 서비스에서는 별도 지오코딩 서비스가 필요합니다.
- 작은 지역의 날씨는 OpenWeatherMap이 가장 가까운 관측 지점 기준으로 반환할 수 있어 지도상의 행정구역과 표시 데이터가 정확히 일치하지 않을 수 있습니다.
- 이름이 같은 도시를 구분하는 ID 체계는 보완이 필요합니다.
- 자동 테스트는 아직 없습니다.
- 일부 카드 동작은 키보드 접근성을 추가로 개선할 수 있습니다.

## 실습 항목 대응

이 프로젝트는 Vue 문법, Composition API, 컴포넌트, Vue Router, Pinia, Axios, UI 라이브러리, Vite 빌드 실습을 한 앱으로 연결한 결과물입니다.

- 반복·조건부 렌더링: `WeatherHomeView.vue`, `WeatherCard.vue`
- props, emit, slot: `components/`
- Composition API: `views/WeatherHomeView.vue`, `composables/`
- Router와 지연 로딩: `router/index.js`
- 전역 상태: `stores/`
- 외부 API와 오류 처리: `src/api/`
- Element Plus: Card, Button, Message 사용
- 빌드와 코드 검사: Vite, ESLint, Prettier

세부 구현은 각 파일의 이름과 함수 단위로 확인할 수 있습니다.
