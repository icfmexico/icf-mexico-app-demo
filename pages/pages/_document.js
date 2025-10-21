// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* iOS toma el título del ícono de ESTA meta */}
        <meta name="apple-mobile-web-app-title" content="ICF MEXICO" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* iOS icon (por si acaso) */}
        <link rel="apple-touch-icon" href="/icons/app-192.png" />
        {/* Manifest estándar */}
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
