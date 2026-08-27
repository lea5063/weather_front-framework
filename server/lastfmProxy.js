const LASTFM_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/'

// 클라이언트 쿼리에 서버 전용 API 키를 추가해 Last.fm 응답을 대신 받아오기 위해 생성했습니다.
export async function proxyLastfm(rawQuery, apiKey) {
  if (!apiKey) {
    return {
      status: 200,
      body: JSON.stringify({
        error: 10,
        message: 'LASTFM_API_KEY 환경변수가 서버에 설정되지 않았습니다.',
      }),
    }
  }

  const params = new URLSearchParams(rawQuery)
  params.set('api_key', apiKey)
  params.set('format', 'json')

  const upstream = await fetch(`${LASTFM_ENDPOINT}?${params.toString()}`)
  const body = await upstream.text()
  return { status: upstream.status, body }
}

// Node 요청과 응답 객체를 Last.fm 프록시 결과에 연결하고 오류를 일관된 JSON으로 반환하기 위해 생성했습니다.
export async function handleLastfmRequest(req, res, apiKey) {
  const url = req.url ?? ''
  const rawQuery = url.includes('?') ? url.slice(url.indexOf('?') + 1) : ''
  try {
    const { status, body } = await proxyLastfm(rawQuery, apiKey)
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(body)
  } catch (err) {
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 16, message: String(err?.message ?? err) }))
  }
}
