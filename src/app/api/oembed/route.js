import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const format = searchParams.get('format') || 'json'

  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
  }

  // Parse the URL to extract chart data
  const chartUrl = new URL(url)
  const dataParam = chartUrl.searchParams.get('d')

  // Create embed URL
  const embedUrl = dataParam
    ? `https://sportspie.site/embed?d=${encodeURIComponent(dataParam)}`
    : 'https://sportspie.site'

  // Base oEmbed response
  const oembedResponse = {
    version: '1.0',
    type: 'rich',
    provider_name: 'Sports Pie',
    provider_url: 'https://sportspie.site',
    title: dataParam ? 'My Sports Fandom Breakdown' : 'Sports Fandom Pie Chart',
    author_name: 'Sports Pie',
    author_url: 'https://sportspie.site',
    width: 800,
    height: 600,
    thumbnail_url: dataParam
      ? `https://sportspie.site/api/og?d=${encodeURIComponent(dataParam)}`
      : 'https://sportspie.site/api/og',
    thumbnail_width: 1200,
    thumbnail_height: 630,
    html: `<iframe src="${embedUrl}" width="800" height="600" frameborder="0" allowfullscreen style="border-radius: 8px;"></iframe>`,
  }

  if (format === 'xml') {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<oembed>
  <version>1.0</version>
  <type>rich</type>
  <provider_name>Sports Pie</provider_name>
  <provider_url>https://sportspie.site</provider_url>
  <title>${oembedResponse.title}</title>
  <author_name>Sports Pie</author_name>
  <author_url>https://sportspie.site</author_url>
  <width>1200</width>
  <height>630</height>
  <thumbnail_url>${oembedResponse.thumbnail_url}</thumbnail_url>
  <thumbnail_width>1200</thumbnail_width>
  <thumbnail_height>630</thumbnail_height>
  <html>${oembedResponse.html}</html>
</oembed>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }

  return NextResponse.json(oembedResponse)
}
