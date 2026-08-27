const STORAGE_KEY = 'weather:cityNames'

// localStorage에 저장된 최근 도시 정보를 안전하게 읽기 위해 생성했습니다.
function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

// 도시 ID와 이름 및 좌표를 저장해 새로고침 후에도 상세 조회 정보를 복원하기 위해 생성했습니다.
export function rememberCityName(id, enName, coords = null) {
  if (!id || !enName) return
  try {
    const all = readAll()
    const next = {
      name: enName,
      ...(Number.isFinite(coords?.lat) && Number.isFinite(coords?.lon)
        ? { lat: coords.lat, lon: coords.lon }
        : {}),
    }
    if (JSON.stringify(all[id]) === JSON.stringify(next)) return
    all[id] = next
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {}
}

// 저장된 도시 ID에 대응하는 도시명을 이전 저장 형식까지 호환해 가져오기 위해 생성했습니다.
export function recallCityName(id) {
  if (!id) return null
  const saved = readAll()[id]
  return typeof saved === 'string' ? saved : (saved?.name ?? null)
}

// 저장된 도시 ID에 대응하는 유효한 위도와 경도를 가져오기 위해 생성했습니다.
export function recallCityCoords(id) {
  if (!id) return null
  const saved = readAll()[id]
  if (!Number.isFinite(saved?.lat) || !Number.isFinite(saved?.lon)) return null
  return { lat: saved.lat, lon: saved.lon }
}
