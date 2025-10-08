import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#1A3D7C" />
        <link rel="apple-touch-icon" href="/icons/app-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ICF México — App Demo</title>
      </Head>
      <body>
        <Main /><NextScript />
      </body>
    </Html>
  )
}