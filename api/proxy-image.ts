import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const url = new URL(req.url)
  const imageUrl = url.searchParams.get('url')
  
  if (!imageUrl) {
    return new Response('Missing URL parameter', { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)
    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', '*')
    
    return new Response(response.body, {
      status: response.status,
      headers
    })
  } catch (error) {
    return new Response('Error fetching image', { status: 500 })
  }
} 