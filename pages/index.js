import React, { useMemo, useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function App() {
  const [lang, setLang] = useState("es");
  const t = (es, en) => (lang === "es" ? es : en);

  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    try {
      const m = localStorage.getItem("icf_prefs");
      if (m) {
        const prefs = JSON.parse(m);
        if (prefs.lang) setLang(prefs.lang);
      }
      setTimeout(() => setShowSplash(false), 2000);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("icf_prefs", JSON.stringify({ lang })); } catch {}
  }, [lang]);
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const QUOTE_ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT || "https://icfmexico-leads.vercel.app/api/quote";
  const WHATSAPP = "https://wa.me/526143555565?text=";

  const [system, setSystem] = useState("Makros");
  const [area, setArea] = useState(120);
  const [waste, setWaste] = useState(5);
  const [steelRate, setSteelRate] = useState(80);
  const [showQuote, setShowQuote] = useState(false);
  const [quoteId, setQuoteId] = useState(null);
  const [sending, setSending] = useState(false);
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [projName, setProjName] = useState("");
  const [projLoc, setProjLoc] = useState("");

  const results = useMemo(() => {
    const panelQty = (area / 0.60) * (1 + waste/100);
    const concrete = area * 0.103;
    const steel = concrete * steelRate;
    return { panelLabel: t("Makros (ml)", "Makros (lm)"), panelQty, concrete, steel };
  }, [area, waste, steelRate, lang]);

  const fmt = (n, f=2) => new Intl.NumberFormat(lang, { maximumFractionDigits: f }).format(Number(n||0));
  const waText = encodeURIComponent(t(
    `Hola ICF México, acabo de enviar mi cotización (ID ${quoteId || ''}) desde la app y quisiera hablar con un asesor.`,
    `Hello ICF México, I just sent my quote (ID ${quoteId || ''}) from the app and would like to speak with an advisor.`
  ));

  async function handleSendQuote() {
    setSending(true); setQuoteId(null);
    try {
      const resp = await fetch(QUOTE_ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ dummy: true }) });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setTimeout(()=>{ setQuoteId(data.quote_id || `Q-${Date.now()}`); setSending(false); }, 1500);
    } catch {
      setTimeout(()=>{ setQuoteId(`Q-${Date.now()}`); setSending(false); }, 1700);
    }
  }

  function generatePdf() {
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    const marginX = 48, line=16;
    let y = 90;
    const isES = lang === 'es';
    doc.setFillColor(26,61,124);
    doc.rect(0,0,doc.internal.pageSize.getWidth(),60,'F');
    doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(16);
    doc.text('ICF México — Smart · Efficient · Strong', marginX, 38);
    doc.setTextColor(0,0,0); doc.setFont('helvetica','bold'); doc.setFontSize(14);
    doc.text(isES?'Resumen de Cotización':'Quote Summary', marginX, y);
    doc.setFont('helvetica','normal'); doc.setFontSize(11);
    y+=24; doc.text(`${isES?'ID de cotización':'Quote ID'}: ${quoteId || '—'}`, marginX, y);
    y+=line; doc.text(`${isES?'Sistema':'System'}: ${system}`, marginX, y);
    y+=line; doc.text(`${isES?'Área (m²)':'Area (m²)'}: ${fmt(area,2)}`, marginX, y);
    y+=line; doc.text(`${isES?'Concreto (m³)':'Concrete (m³)'}: ${fmt(results.concrete,2)} — ${isES?'Acero (kg)':'Steel (kg)'}: ${fmt(results.steel,0)}`, marginX, y);
    doc.save(`ICF_Mexico_Cotizacion_${quoteId || 'demo'}.pdf`);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto grid gap-6">
        {showSplash && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="text-2xl font-semibold">ICF México</div>
              <div className="text-sm text-gray-600 mt-2">{t("Construcción eficiente y sostenible, hecha en México.", "Efficient and sustainable construction, made in Mexico.")}</div>
            </div>
          </div>
        )}

        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">ICF México — {t("Demo PWA", "PWA Demo")}</h1>
            <div className="text-xs mt-1 text-gray-500">
              {t("Entorno:", "Environment:")} <span className="inline-block px-2 py-0.5 rounded bg-gray-100 border">{process.env.NEXT_PUBLIC_ENV || "DEMO"}</span> · <span className="text-gray-400">{QUOTE_ENDPOINT}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">ES</span>
            <button className={`w-12 h-6 rounded-full relative bg-gray-300`} onClick={() => setLang(lang === "es" ? "en" : "es")}>
              <span className={`absolute top-0.5 transition-all ${lang === "es" ? "left-0.5" : "left-6"} w-5 h-5 bg-white rounded-full shadow`} />
            </button>
            <span className="text-sm">EN</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-3">{t("Entradas (demo)", "Inputs (demo)")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">{t("Sistema", "System")}</label>
                <select className="w-full border rounded-xl p-2" value={system} onChange={(e)=>setSystem(e.target.value)}>
                  <option>Makros</option>
                  <option>Joist</option>
                  <option>SteelFoam</option>
                  <option>ProLite</option>
                  <option>Walls</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">{t("Área (m²)", "Area (m²)")}</label>
                <input type="number" className="w-full border rounded-xl p-2" value={area} onChange={(e)=>setArea(parseFloat(e.target.value||"0"))} />
              </div>
              <div>
                <label className="block text-sm mb-1">{t("Desperdicio (%)", "Waste (%)")}</label>
                <input type="number" className="w-full border rounded-xl p-2" value={waste} onChange={(e)=>setWaste(parseFloat(e.target.value||"0"))} />
              </div>
              <div>
                <label className="block text-sm mb-1">{t("Acero (kg/m³)", "Steel (kg/m³)")}</label>
                <input type="number" className="w-full border rounded-xl p-2" value={steelRate} onChange={(e)=>setSteelRate(parseFloat(e.target.value||"0"))} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-3">{t("Resultados (demo)", "Results (demo)")}</h2>
            <div className="grid gap-3">
              <div className="p-3 rounded-xl border">
                <div className="text-sm text-gray-500">{results.panelLabel}</div>
                <div className="text-2xl font-semibold">{fmt(results.panelQty, 2)}</div>
              </div>
              <div className="p-3 rounded-xl border">
                <div className="text-sm text-gray-500">{t("Concreto (m³)", "Concrete (m³)")}</div>
                <div className="text-2xl font-semibold">{fmt(results.concrete, 2)}</div>
              </div>
              <div className="p-3 rounded-xl border">
                <div className="text-sm text-gray-500">{t("Acero (kg)", "Steel (kg)")}</div>
                <div className="text-2xl font-semibold">{fmt(results.steel, 0)}</div>
              </div>
              <button onClick={() => setShowQuote(true)} className="mt-2 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                {t("Solicitar cotización", "Request quote")}
              </button>
            </div>
          </div>
        </div>

        <footer className="text-xs text-gray-500">
          {t("Demo PWA lista para instalar en iPhone/Android. Para pruebas no estructurales.", "Installable PWA demo for iPhone/Android. Not for structural design.")}
        </footer>
      </div>

      {showQuote && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl bg-white rounded-2xl p-4 shadow-lg">
            {!quoteId ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{t("Solicitar cotización", "Request a quote")}</h3>
                  <button onClick={() => !sending && setShowQuote(false)} className="text-gray-500">✕</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm">{t("Nombre completo", "Full name")}</label>
                    <input className="w-full border rounded-xl p-2" value={custName} onChange={(e)=>setCustName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm">Email</label>
                    <input className="w-full border rounded-xl p-2" value={custEmail} onChange={(e)=>setCustEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm">{t("Teléfono", "Phone")}</label>
                    <input className="w-full border rounded-xl p-2" value={custPhone} onChange={(e)=>setCustPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm">{t("Proyecto", "Project")}</label>
                    <input className="w-full border rounded-xl p-2" value={projName} onChange={(e)=>setProjName(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm">{t("Ubicación (ciudad, estado)", "Location (city, state)")}</label>
                    <input className="w-full border rounded-xl p-2" value={projLoc} onChange={(e)=>setProjLoc(e.target.value)} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button disabled={sending} onClick={handleSendQuote} className="px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
                    {sending ? t("Enviando…", "Sending…") : t("Enviar cotización", "Send quote")}
                  </button>
                  <button disabled={sending} onClick={()=>setShowQuote(false)} className="px-4 py-3 rounded-xl border">
                    {t("Cancelar", "Cancel")}
                  </button>
                </div>
                {sending && (
                  <div className="mt-4 text-sm text-gray-600">
                    {t("Estamos preparando tu cotización, por favor espera unos segundos…", "We’re preparing your quote, please wait a few seconds…")}
                  </div>
                )}
              </>
            ) : (
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t("¡Cotización enviada con éxito!", "Quote sent successfully!")}</h3>
                  <button onClick={() => setShowQuote(false)} className="text-gray-500">✕</button>
                </div>
                <div className="text-sm text-gray-700">
                  <div><b>{t("ID de cotización", "Quote ID")}:</b> {quoteId}</div>
                  <div><b>{t("Sistema", "System")}:</b> {system}</div>
                  <div><b>{t("Área", "Area")}:</b> {fmt(area, 2)} m²</div>
                  <div><b>{results.panelLabel}:</b> {fmt(results.panelQty, 2)}</div>
                  <div><b>{t("Concreto (m³)", "Concrete (m³)")}:</b> {fmt(results.concrete, 2)} · <b>{t("Acero (kg)", "Steel (kg)")}:</b> {fmt(results.steel, 0)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setShowQuote(false); setQuoteId(null); }} className="px-4 py-3 rounded-xl border">{t("Nueva cotización", "New quote")}</button>
                  <a className="px-4 py-3 rounded-xl border border-green-600 text-green-700 hover:bg-green-600 hover:text-white inline-flex items-center gap-2" href={WHATSAPP + waText} target="_blank" rel="noreferrer">
                    {/* WhatsApp icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18"><path fill="currentColor" d="M19.11 17.09c-.27-.14-1.59-.79-1.84-.88-.25-.09-.43-.14-.62.14-.18.27-.71.88-.88 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.35-.8-.71-1.34-1.59-1.5-1.85-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.05-.22-.53-.45-.46-.62-.46-.16 0-.34-.02-.52-.02-.18 0-.48.07-.74.34-.25.27-.97.95-.97 2.32 0 1.36.99 2.68 1.13 2.86.14.18 1.95 2.98 4.73 4.17.66.29 1.18.46 1.58.59.66.21 1.27.18 1.75.11.53-.08 1.59-.65 1.81-1.28.23-.62.23-1.15.16-1.27-.07-.11-.25-.18-.52-.32z"/><path fill="currentColor" d="M16.02 3.2c-7.1 0-12.85 5.76-12.85 12.85 0 2.53.74 4.89 2.01 6.88L3.2 28.8l6.09-1.94a12.77 12.77 0 0 0 6.73 1.94c7.1 0 12.85-5.76 12.85-12.85S23.12 3.2 16.02 3.2zm7.54 20.39c-.32.91-1.86 1.74-2.58 1.86-.66.11-1.5.16-2.43-.16-0.56-.18-1.28-.41-2.22-.85-3.9-1.89-6.43-6.26-6.63-6.55-.2-.29-1.58-2.11-1.58-4.03 0-1.93 1.01-2.86 1.37-3.26.36-.41.78-.51 1.05-.51.27 0 .52 0 .74.01.24 0 .56-.09.88.67.32.77 1.08 2.64 1.17 2.83.09.18.15.41.02.67-.12.25-.18.41-.36.63-.18.22-.38.49-.54.66-.18.18-.36.38-.16.73.2.36.88 1.44 1.89 2.33 1.31 1.16 2.42 1.53 2.79 1.71.36.18.58.16.79-.09.25-.29.88-1.03 1.12-1.39.25-.36.5-.3.84-.16.34.14 2.17 1.02 2.55 1.2.36.18.59.27.68.41.09.14.09.84-.23 1.75z"/></svg>
                    {t("Hablar con un asesor por WhatsApp", "Chat with an advisor on WhatsApp")}
                  </a>
                  <button onClick={generatePdf} className="px-4 py-3 rounded-xl bg-gray-900 text-white hover:bg-black">
                    {t("Descargar resumen (PDF)", "Download summary (PDF)")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}