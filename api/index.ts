import fetch from 'node-fetch'

type VercelRequest = {
  query: Record<string, string>
  headers: Record<string, string>
  method: string
  body: any
}

type VercelResponse = {
  status: (status: number) => VercelResponse
  send: (body?: string) => void
  headers?: Record<string, string>
}

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'OPTIONS') {
    res.headers = {
      'Access-Control-Allow-Origin': 'https://carotte.netlify.app',
      'Access-Control-Allow-Methods': req.headers['Access-Control-Request-Method'],
      'Access-Control-Allow-Headers': req.headers['Access-Control-Request-Headers'],
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

  const response = await fetch(url, {
    method: req.method,
    headers: { Authorization: req.headers.Authorization },
    body: req.body ? JSON.stringify(req.body) : null,
  })

  res.headers = {}

  response.headers.forEach((value, key) => {
    res.headers[key] = value
  })

  res.status(response.status).send(await response.text())
}
