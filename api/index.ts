import fetch from 'node-fetch'

type VercelRequest = Request & { query: Record<string, string> }

type VercelResponse = {
  status: (status: number) => VercelResponse
  send: (body?: string) => void
  headers?: Record<string, string>
}

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'OPTIONS') {
    res.headers = {
      'Access-Control-Allow-Origin': 'https://carotte.netlify.app',
      'Access-Control-Allow-Methods': req.headers.get('Access-Control-Request-Method'),
      'Access-Control-Allow-Headers': req.headers.get('Access-Control-Request-Headers'),
    }
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

  res.headers = {}

  response.headers.forEach((value, key) => {
    res.headers[key] = value
  })

  res.status(response.status).send(await response.text())
}
