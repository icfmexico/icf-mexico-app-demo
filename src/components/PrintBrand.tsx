// src/components/PrintBrand.tsx
"use client";

export default function PrintBrand() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <>
      {/* Encabezado visible SOLO al imprimir */}
      <div className="icf-print-brand">
        <div className="row">
          <img src="/icf-logo-blue.png" alt="ICF MEXICO" className="logo" />
          <div className="title">
            <h1>ICF MEXICO — Calculadoras</h1>
            <p>Construcción eficiente y sostenible • {dateStr}</p>
          </div>
        </div>
        <hr />
      </div>

      {/* Pie de página con numeración (solo print) */}
      <div className="icf-print-footer">
        <span>ICF MEXICO</span>
        <span className="page">Página <span className="pageNumber"></span> de <span className="totalPages"></span></span>
      </div>

      <style jsx global>{`
        /* Página A4 y márgenes */
        @page {
          size: A4;
          margin: 14mm;
        }

        /* Header de impresión */
        .icf-print-brand { display: none; }
        .icf-print-footer { display: none; }

        @media print {
          body { color: #000; }

          .icf-print-brand {
            display: block;
            margin-bottom: 12px;
          }
          .icf-print-brand .row {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .icf-print-brand .logo {
            height: 38px;
            width: auto;
            object-fit: contain;
          }
          .icf-print-brand .title h1 {
            margin: 0;
            font-size: 16px;
            font-weight: 800;
            line-height: 1.2;
          }
          .icf-print-brand .title p {
            margin: 2px 0 0 0;
            font-size: 12px;
            color: #222;
          }
          .icf-print-brand hr {
            margin: 8px 0 0 0;
            border: none;
            border-top: 1px solid #999;
          }

          /* Footer fijo con numeración */
          .icf-print-footer {
            display: flex;
            position: fixed;
            bottom: 8mm;
            left: 14mm;
            right: 14mm;
            justify-content: space-between;
            font-size: 11px;
            color: #222;
          }

          /* Contadores (soportados por la mayoría de navegadores PDF) */
          .icf-print-footer .pageNumber:after { content: counter(page); }
          .icf-print-footer .totalPages:after { content: counter(pages); }
        }
      `}</style>
    </>
  );
}
