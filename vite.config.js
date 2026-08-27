import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { handleLastfmRequest } from './server/lastfmProxy.js'

// 개발 서버와 미리보기 서버에서 Last.fm 요청을 안전하게 중계하는 Vite 플러그인을 만들기 위해 생성했습니다.
function lastfmProxyPlugin(apiKey) {
  // Last.fm API 경로만 가로채 공통 서버 핸들러로 전달하기 위해 생성했습니다.
  const middleware = (req, res, next) => {
    if (!req.url || !req.url.startsWith('/api/lastfm')) return next()
    handleLastfmRequest(req, res, apiKey)
  }
  return {
    name: 'lastfm-proxy',
    // Vite 개발 서버에 Last.fm 프록시 미들웨어를 등록하기 위해 생성했습니다.
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    // Vite 미리보기 서버에도 동일한 Last.fm 프록시를 등록하기 위해 생성했습니다.
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), lastfmProxyPlugin(env.LASTFM_API_KEY)],
  }
})
