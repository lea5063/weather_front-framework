import { handleLastfmRequest } from '../server/lastfmProxy.js'

// Vercel 서버리스 요청을 서버 전용 Last.fm API 키와 함께 공통 프록시로 전달하기 위해 생성했습니다.
export default function handler(req, res) {
  return handleLastfmRequest(req, res, process.env.LASTFM_API_KEY)
}
