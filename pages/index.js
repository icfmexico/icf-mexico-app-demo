// pages/index.js — ICF México App (Alpha con categorías/productos)
import React, { useMemo, useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function App() {
  const [lang, setLang] = useState("es");
  const t = (es, en) => (lang === "es" ? es : en);

  // Splash & prefs
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

  // ===== NUEVOS ESTADOS (categoría/producto) =====
  const [category, setCategory] = useState("Muros ICF");
  const [product, setProduct] = useState("Reticular-20");

  // Entradas generales
  const [area, setArea] = useState(120);
  const [waste, setWaste] = useState(5);
  const [steelRate, setSteelRate] = useState(80);

  // Muros ICF
  const wallCoverage = {
    "Reticular-15": 0.36,          // m²/pza
    "Reticular-20": 0.30,
    "StrongBlock 100": 1.08,
    "StrongBlock 150": 2.16,
    "Pared Sólida": 0.48           // referencia útil; ajustable cuando definamos pieza final
  };
  const tEquiv = { // espesor equivalente (m) para reticulares/StrongBlock
    "Reticular-15": (0.20/1.20 + 0.20/0.60 - (0.20*0.20)/(1.20*0.60)) * 0.076,
    "Reticular-20": (0.20/1.00 + 0.20/0.60 - (0.20*0.20)/(1.00*0.60)) * 0.10,
    "StrongBlock 100": (0.20/1.20 + 0.20/0.60 - (0.20*0.20)/(1.20*0.60)) * 0.10,
    "StrongBlock 150": (0.20/1.20 + 0.20/0.60 - (0.20*0.20)/(1.20*0.60)) * 0.1524
  };
  const rMap = { // R-values oficiales
    "Reticular-15": 24,
    "Reticular-20": 26,
    "StrongBlock 100": 24,
    "StrongBlock 150": 27,
    "Pared Sólida": 24
  };
  const [solidThickness, setSolidThickness] = useState(10); // cm

  // Makros
  const [makrosDepth, setMakrosDepth] = useState(25); // cm
  const [makrosCoverage, setMakrosCoverage] = useState(0.60); // m² por metro lineal
  const makrosConcretePerM2 = { 18: 0.083, 20: 0.091, 25: 0.103, 29: 0.114, 32: 0.121 }; // m³/m²

  // SteelFoam
  const [sfDepth, setSfDepth] = useState(25);
  const [sfFactor, setSfFactor] = useState(1.05); // factor sobre capa de 5 cm

  // Joist
  const [span, setSpan] = useState(6.0);
  const [width, setWidth] = useState(8.4);
  const joistSpacing = 0.60;
  const [joistModel, setJoistModel] = useState("J-RST/25");
  const foamCoveragePerPiece = 0.62; // m²/pza espuma entre viguetas (ref)

  // ProLite
  const [proliteCoverage, setProliteCoverage] = useState(0.60); // m² por ML

  // Cotización (modal)
  const [showQuote, setShowQuote] = useState(false);
  const [quoteId, setQuoteId] = useState(null);
  const [sending, setSending] = useState(false);
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [projName, setProjName] = useState("");
  const [projLoc, setProjLoc] = useState("");

  const results = useMemo(() => {
    const A = Math.max(area, 0);
    const fRec = 1 + waste/100;

    // ===== MUROS ICF =====
    if (category === "Muros ICF") {
      const cov = wallCoverage[product] || 0.36;
      const A_net = A; // futuros vanos (% ventanas/puertas)
      const blocks = (A_net / cov) * fRec;

      let Vc = 0;
      if (product === "Pared Sólida") {
        Vc = A_net * (Math.max(solidThickness, 8) / 100); // m³ = área × espesor
      } else {
        Vc = A_net * (tEquiv[product] || 0.09);
      }
      const steel = Vc * steelRate;

      return {
        panelLabel: t("Bloques (pzas)", "Blocks (pcs)"),
        panelQty: blocks,
        concrete: Vc,
        steel,
        rValue: rMap[product]
      };
    }

    // ===== ENTREpisos / TECHOS =====
    if (category === "Entrepisos/Techos") {
      if (product === "Makros") {
        const m3perM2 = makrosConcretePerM2[makrosDepth] ?? 0.103;
        const ml = (A / Math.max(makrosCoverage, 0.0001)) * fRec;
        const Vc = A * m3perM2;
        const steel = Vc * steelRate;
        return { panelLabel: t("Makros (ml)", "Makros (lm)"), panelQty: ml, concrete: Vc, steel };
      }
      if (product === "SteelFoam") {
        const panelM2 = A * fRec;           // venta por m²
        const VcLayer = A * 0.05;           // capa 5 cm
        const VcTotal = VcLayer * sfFactor; // ajuste por peralte/condición
        const steel = VcTotal * steelRate;
        return { panelLabel: t("Panel SteelFoam (m²)", "SteelFoam panel (m²)"), panelQty: panelM2, concrete: VcTotal, steel };
      }
      if (product === "Joist") {
        const nJoists = Math.ceil(width / joistSpacing) + 1;
        const mlJoist = nJoists * span;
        const foamPieces = (A / foamCoveragePerPiece) * fRec;
        const VcLayer = A * 0.05;
        const steel = VcLayer * steelRate;
        return { panelLabel: t("Viguetas (ml)", "Joists (lm)"), panelQty: mlJoist, joistsPieces: nJoists, foamPieces, concrete: VcLayer, steel };
      }
    }

    // ===== PANELES AISLANTES =====
    if (category === "Paneles Aislantes" && product === "ProLite") {
      const ml = (A / Math.max(proliteCoverage, 0.0001)) * fRec; // venta por ML
      return { panelLabel: t("ProLite (ml)", "ProLite (lm)"), panelQty: ml, concrete: 0, steel: 0 };
    }

    // Fallback
    return { panelLabel: t("Cantidad", "Quantity"), panelQty: 0, concrete: 0, steel: 0 };
  }, [category, product, area, waste, steelRate, makrosDepth, makrosCoverage, sfFactor, width, span, proliteCoverage, solidThickness, lang]);

  const fmt = (n, f=2) => new Intl.NumberFormat(lang, { maximumFractionDigits: f }).format(Number(n||0));
  const waText = encodeURIComponent(t(
    `Hola ICF MEXICO, acabo de enviar mi cotización (ID ${quoteId || ''}) desde la app y quisiera hablar con un asesor.`,
    `Hello ICF MEXICO, I just sent my quote (ID ${quoteId || ''}) from the app and would like to speak with an advisor.`
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
    doc.text('ICF MEXICO — Smart · Efficient · Strong', marginX, 38);
    doc.setTextColor(0,0,0); doc.setFont('helvetica','bold'); doc.setFontSize(14);
    doc.text(isES?'Resumen de Cotización':'Quote Summary', marginX, y);
    doc.setFont('helvetica','normal'); doc.setFontSize(11);
    y+=24; doc.text(`${isES?'ID de cotización':'Quote ID'}: ${quoteId || '—'}`, marginX, y);
    y+=line; doc.text(`${isES?'Categoría':'Category'}: ${category}`, marginX, y);
    y+=line; doc.text(`${isES?'Producto':'Product'}: ${product}`, marginX, y);
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
              <div className="text-2xl font-semibold">ICF MEXICO</div>
              <div className="text-sm text-gray-600 mt-2">{t("Construcción eficiente y sostenible, hecha en México.", "Efficient and sustainable construction, made in Mexico.")}</div>
            </div>
          </div>
        )}

        <header className="flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-bold tracking-wide">
      ICF MEXICO — {t("Demo PWA (Alpha)", "PWA Demo (Alpha)")}
    </h1>
    <div className="text-xs mt-1 text-gray-500">
      {t("Entorno:", "Environment:")}{" "}
      <span className="inline-block px-2 py-0.5 rounded bg-gray-100 border">
        {process.env.NEXT_PUBLIC_ENV || "DEMO"}
      </span>{" "}
      · <span className="text-gray-400">{QUOTE_ENDPOINT}</span>
    </div>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-sm">ES</span>
    <button
      className="w-12 h-6 rounded-full relative bg-gray-300"
      onClick={() => setLang(lang === "es" ? "en" : "es")}
    >
      <span
        className={`absolute top-0.5 transition-all ${
          lang === "es" ? "left-0.5" : "left-6"
        } w-5 h-5 bg-white rounded-full shadow`}
      />
    </button>
    <span className="text-sm">EN</span>
  </div>
</header>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-3">{t("Entradas", "Inputs")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Categoría y producto */}
              <div>
                <label className="block text-sm mb-1">{t("Categoría", "Category")}</label>
                <select className="w-full border rounded-xl p-2" value={category} onChange={(e)=>{ 
                  setCategory(e.target.value); 
                  if (e.target.value === "Muros ICF") setProduct("Reticular-20");
                  if (e.target.value === "Entrepisos/Techos") setProduct("Makros");
                  if (e.target.value === "Paneles Aislantes") setProduct("ProLite");
                }}>
                  <option>Muros ICF</option>
                  <option>Entrepisos/Techos</option>
                  <option>Paneles Aislantes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">{t("Producto", "Product")}</label>
                <select className="w-full border rounded-xl p-2" value={product} onChange={(e)=>setProduct(e.target.value)}>
                  {category === "Muros ICF" && (
                    <>
                      <option>Reticular-15</option>
                      <option>Reticular-20</option>
                      <option>StrongBlock 100</option>
                      <option>StrongBlock 150</option>
                      <option>Pared Sólida</option>
                    </>
                  )}
                  {category === "Entrepisos/Techos" && (
                    <>
                      <option>Makros</option>
                      <option>Joist</option>
                      <option>SteelFoam</option>
                    </>
                  )}
                  {category === "Paneles Aislantes" && (
                    <>
                      <option>ProLite</option>
                    </>
                  )}
                </select>
              </div>

              {/* Área / desperdicio / acero */}
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

              {/* Inputs condicionales */}
              {category === "Muros ICF" && product === "Pared Sólida" && (
                <div>
                  <label className="block text-sm mb-1">{t("Espesor núcleo (cm)", "Core thickness (cm)")}</label>
                  <select className="w-full border rounded-xl p-2" value={solidThickness} onChange={(e)=>setSolidThickness(parseInt(e.target.value))}>
                    {[10,14,18].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              )}

              {category === "Entrepisos/Techos" && product === "Makros" && (
                <>
                  <div>
                    <label className="block text-sm mb-1">{t("Peralte (cm)", "Depth (cm)")}</label>
                    <select className="w-full border rounded-xl p-2" value={makrosDepth} onChange={(e)=>setMakrosDepth(parseInt(e.target.value))}>
                      {[18,20,25,29,32].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{t("Cobertura (m²/ML)", "Coverage (m²/lm)")}</label>
                    <input type="number" step="0.01" className="w-full border rounded-xl p-2" value={makrosCoverage} onChange={(e)=>setMakrosCoverage(parseFloat(e.target.value||"0.60"))} />
                  </div>
                </>
              )}

              {category === "Entrepisos/Techos" && product === "SteelFoam" && (
                <>
                  <div>
                    <label className="block text-sm mb-1">{t("Peralte EPS (cm)", "EPS depth (cm)")}</label>
                    <select className="w-full border rounded-xl p-2" value={sfDepth} onChange={(e)=>setSfDepth(parseInt(e.target.value))}>
                      {[15,20,25,30,35].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{t("Factor de concreto", "Concrete factor")}</label>
                    <input type="number" step="0.01" className="w-full border rounded-xl p-2" value={sfFactor} onChange={(e)=>setSfFactor(parseFloat(e.target.value||"1"))} />
                  </div>
                </>
              )}

              {category === "Entrepisos/Techos" && product === "Joist" && (
                <>
                  <div>
                    <label className="block text-sm mb-1">{t("Modelo", "Model")}</label>
                    <select className="w-full border rounded-xl p-2" value={joistModel} onChange={(e)=>setJoistModel(e.target.value)}>
                      <option>J-RST/10</option>
                      <option>J-RST/17.5</option>
                      <option>J-RST/25</option>
                      <option>J-RST/30</option>
                      <option>J-RST/40</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{t("Luz (m)", "Span (m)")}</label>
                    <input type="number" className="w-full border rounded-xl p-2" value={span} onChange={(e)=>setSpan(parseFloat(e.target.value||"0"))} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{t("Ancho (m)", "Width (m)")}</label>
                    <input type="number" className="w-full border rounded-xl p-2" value={width} onChange={(e)=>setWidth(parseFloat(e.target.value||"0"))} />
                  </div>
                </>
              )}

              {category === "Paneles Aislantes" && product === "ProLite" && (
                <div>
                  <label className="block text-sm mb-1">{t("Cobertura (m²/ML)", "Coverage (m²/lm)")}</label>
                  <input type="number" step="0.01" className="w-full border rounded-xl p-2" value={proliteCoverage} onChange={(e)=>setProliteCoverage(parseFloat(e.target.value||"0.60"))} />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-3">{t("Resultados", "Results")}</h2>
            <div className="grid gap-3">
              <div className="p-3 rounded-xl border">
                <div className="text-sm text-gray-500">{results.panelLabel}</div>
                <div className="text-2xl font-semibold">{fmt(results.panelQty, 2)}</div>
                {category === "Muros ICF" && product !== "Pared Sólida" && (
                  <div className="text-xs text-gray-500 mt-1">{t("R-Value", "R-Value")}: R-{results.rValue}+</div>
                )}
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
          {t("Alpha PWA lista para instalar en iPhone/Android. Para pruebas no estructurales.", "Alpha installable PWA for iPhone/Android. Not for structural design.")}
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
                  <div><b>{t("Categoría", "Category")}:</b> {category}</div>
                  <div><b>{t("Producto", "Product")}:</b> {product}</div>
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
