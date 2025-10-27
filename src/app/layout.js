export const metadata = {
  metadataBase: new URL('https://sportspie.site'),
  title: 'Sports Fandom Pie Chart - Visualize Your Sports Love',
  description: 'Create and share interactive pie charts showing your sports fandom breakdown across NFL, NBA, NHL, MLB, and more.',
  openGraph: {
    title: 'Sports Fandom Pie Chart - Visualize Your Sports Love',
    description: 'Create and share interactive pie charts showing your sports fandom breakdown across NFL, NBA, NHL, MLB, and more.',
    url: 'https://sportspie.site/',
    siteName: 'Sports Pie',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Fandom Pie Chart - Visualize Your Sports Love',
    description: 'Create and share interactive pie charts showing your sports fandom breakdown across NFL, NBA, NHL, MLB, and more.',
    creator: '@whyisjake',
    images: ['/api/og'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="/_vercel/insights/script.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
