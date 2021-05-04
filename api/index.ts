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
  res.headers = {
    'Access-Control-Allow-Origin': 'https://carotte.netlify.app',
    'Vary': 'Origin',
    'Access-Control-Allow-Credentials': 'true',
  }

  if (req.method === 'OPTIONS') {
    res.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE'
    res.headers['Access-Control-Allow-Headers'] = req.headers['Access-Control-Request-Headers']
    res.headers['Content-Length'] = '0'
    res.headers['Vary'] = 'Origin,Access-Control-Request-Headers'

    res.status(204).send()
    return
  }

  const url = req.query.url

  if (!url) {
    res.status(404).send()
    return
  }

  const response = await fetch(url, {
    method: req.method,
    headers: { Authorization: req.headers.Authorization },
    body: req.body ? JSON.stringify(req.body) : null,
  })

  response.headers.forEach((value, key) => {
    res.headers[key] = value
  })

  res.status(response.status).send(await response.text())
}
