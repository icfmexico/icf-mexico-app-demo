// pages/v2/index.js — prueba mínima
import { useEffect } from "react";
import Head from "next/head";

export default function V2() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/v2/sw.js?v=1").catch(() => {});
    }
  }, []);

  return (
    <>
      <Head>
        <title>ICF MEXICO — v2</title>
        <link rel="manifest" href="/v2/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-title" content="ICF MEXICO" />
        <link rel="apple-touch-icon" href="/icons/app-192.png" />
      </Head>
      <main style={{padding:"24px",fontFamily:"system-ui"}}>
        <h1>ICF MEXICO — v2 OK</h1>
        <p>Si ves esto, la nueva ruta /v2 funciona ✅.</p>
      </main>
    </>
  );
}
