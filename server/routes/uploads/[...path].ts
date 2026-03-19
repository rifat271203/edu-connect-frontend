const BACKEND_URL = 'https://sincere-spontaneity-production-ab4e.up.railway.app'

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || ''
  const targetUrl = `${BACKEND_URL}/uploads/${path}`

  const response = await fetch(targetUrl, {
    headers: {
      // Forward range headers for video streaming
      ...(event.headers.get('range') ? { range: event.headers.get('range')! } : {}),
    },
  })

  // Copy status
  event.node.res.statusCode = response.status

  // Forward relevant headers, but override CORP so the browser allows cross-origin loading
  const headersToForward = [
    'content-type',
    'content-length',
    'content-range',
    'accept-ranges',
    'cache-control',
    'last-modified',
    'etag',
  ]

  for (const header of headersToForward) {
    const value = response.headers.get(header)
    if (value) {
      event.node.res.setHeader(header, value)
    }
  }

  // Explicitly set cross-origin resource policy to allow browser loading
  event.node.res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  event.node.res.setHeader('Access-Control-Allow-Origin', '*')

  // Stream the response body back
  const buffer = await response.arrayBuffer()
  return Buffer.from(buffer)
})
