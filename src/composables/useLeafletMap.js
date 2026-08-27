import { onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { logger } from '../utils/logger.js'

// Leaflet 지도의 생성과 클릭 연결 및 컴포넌트 해제를 한곳에서 관리하기 위해 생성했습니다.
export function useLeafletMap(containerRef, onMapClick) {
  let mapInstance = null
  let clickHandler = null

  onMounted(() => {
    if (!containerRef.value) {
      logger.warn('[useLeafletMap] 지도를 그릴 DOM 엘리먼트를 찾지 못했습니다.')
      return
    }

    mapInstance = L.map(containerRef.value, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      worldCopyJump: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstance)

    clickHandler = (event) => {
      onMapClick(event.latlng.lat, event.latlng.lng)
    }
    mapInstance.on('click', clickHandler)
  })

  onUnmounted(() => {
    if (mapInstance) {
      if (clickHandler) mapInstance.off('click', clickHandler)
      mapInstance.remove()
      mapInstance = null
    }
  })
}
