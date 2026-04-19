// Public NewsAPI proxy — keeps API key server-side
import { NextRequest, NextResponse } from 'next/server'

const NEWS_API_KEY = process.env.NEWS_API_KEY
const NEWS_API_BASE = 'https://newsapi.org/v2'

export async function GET(request: NextRequest) {
  try {
    if (!NEWS_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'News API not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const country = searchParams.get('country') || 'us'
    const category = searchParams.get('category') || 'technology'
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 40)

    let url: string
    if (q) {
      // Search mode
      url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${NEWS_API_KEY}`
    } else {
      // Top headlines mode
      url = `${NEWS_API_BASE}/top-headlines?country=${country}&category=${category}&pageSize=${limit}&apiKey=${NEWS_API_KEY}`
    }

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // cache for 1 hour
      headers: { 'User-Agent': 'RameTech-Website/1.0' },
    })

    const data = await res.json()

    if (data.status !== 'ok') {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to fetch news from NewsAPI' },
        { status: 502 }
      )
    }

    const articles = (data.articles as any[])
      .filter((a) => a.title && a.title !== '[Removed]' && a.url)
      .slice(0, limit)
      .map((a) => ({
        title: a.title as string,
        description: (a.description as string | null) || null,
        url: a.url as string,
        imageUrl: (a.urlToImage as string | null) || null,
        source: (a.source?.name as string | null) || null,
        publishedAt: a.publishedAt as string,
      }))

    return NextResponse.json({ success: true, data: articles })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
