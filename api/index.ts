import fetch from 'node-fetch'

type VercelRequest = Request & { query: Record<string, string> }
type VercelResponse = Response & { status: (status: number) => VercelResponse, send: (body?: string) => void }

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'OPTIONS') {
    res.headers.append('Access-Control-Allow-Origin', 'https://carotte.netlify.app')
    res.headers.append('Access-Control-Allow-Methods', req.headers.get('Access-Control-Request-Method'))
    res.headers.append('Access-Control-Allow-Headers', req.headers.get('Access-Control-Request-Headers'))
    res.send()
    return
  }

  const url = req.query.url

  if (!url) {
    res.status(404)
    res.send()
    return
  }

  const headers = {}

  req.headers.forEach((value, key) => {
    headers[key] = value
  })

  const response = await fetch(url, {
    method: req.method,
    headers,
    body: req.body ? JSON.stringify(req.body) : null,
  })

  res.status(response.status).send(await response.text())
}
