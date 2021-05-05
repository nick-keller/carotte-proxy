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
  setHeader: (name: string, value: string) => void
}

export default async (req: VercelRequest, res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://carotte.netlify.app')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
  res.setHeader('Vary', 'Origin,Access-Control-Request-Headers')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
    res.setHeader('Content-Length', '0')
    res.status(204).send()
    return
  }

  const { url, ...otherQueryParams } = req.query

  if (!url) {
    res.status(404).send()
    return
  }

  const stringQueryParams = Object.entries(otherQueryParams).map(([key, value]) => `${key}=${value}`).join('&')

  const response = await fetch(url + (stringQueryParams ? '&' + stringQueryParams : ''), {
    method: req.method,
    headers: { Authorization: req.headers.authorization },
    body: req.body ? JSON.stringify(req.body) : null,
  })

  res.status(response.status).send(await response.text())
}
