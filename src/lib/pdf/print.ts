'use client';

export function printSectionById(sectionId: string, title = 'Resultados de Cálculo — ICF MEXICO') {
  const srcEl = document.getElementById(sectionId);
  if (!srcEl) {
    alert('No encontré la tarjeta de resultados para imprimir.');
    return;
  }

  const origin = window.location.origin;
  const logoUrl = `${origin}/logo-icf-mexico.png?v=${Date.now()}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          @page { margin: 25mm 20mm; }
          html, body { background: #fff; color: #111; font-family: Helvetica, Arial, sans-serif; }

          /* Encabezado refinado */
          .header {
            display: flex; align-items: center;
            border-bottom: 4px solid #0A1D44;
            margin-bottom: 18px; padding-bottom: 6px;
          }
          .logo { width: 150px; }
          .company {
            margin-left: 20px;
            font-size: 12px;
            color: #0A1D44;
          }
          .company p {
            margin: 0;
            line-height: 1.3;
          }

          h3 {
            color: #0A1D44;
            border-left: 5px solid #E30613;
            padding-left: 8px;
            font-size: 16px;
            margin: 0 0 10px 0;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 8px;
            font-size: 13px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px 6px;
          }
          th:first-child, td:first-child { text-align: left; }
          th {
            background-color: #f2f5fa;
            color: #0A1D44;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
          }
          td { text-align: right; }
          td strong { color: #E30613; }

          .muted {
            color: #555; font-size: 10px; margin-top: 15px;
          }

          .footer {
            margin-top: 30px;
            border-top: 3px solid #E30613;
            padding-top: 6px;
            font-size: 10px;
            color: #0A1D44;
            text-align: center;
          }

          .sign {
            margin-top: 25px;
            display: flex;
            justify-content: flex-end;
            font-size: 11px;
            color: #444;
          }
          .sign .line {
            border-top: 1px solid #0A1D44;
            width: 180px;
            text-align: center;
            padding-top: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logoUrl}" class="logo" alt="ICF MEXICO Logo" />
          <div class="company">
            <p><strong>Construcción Eficiente y Sostenible</strong></p>
            <p>www.icfmexico.com</p>
          </div>
        </div>

        <h3>${title}</h3>
        <div id="print-content">${srcEl.innerHTML}</div>

        <div class="sign">
          <div class="line">Responsable Técnico</div>
        </div>

        <p class="muted">Generado automáticamente — ${new Date().toLocaleString()}</p>

        <div class="footer">
          ICF MEXICO — Formas de Concreto Aislado (ICF), Techos y Entrepisos ICF · © ${new Date().getFullYear()}
        </div>

        <script>
          const imgs = Array.from(document.images || []);
          const waits = imgs.map(img => new Promise(res => {
            if (img.complete) return res();
            img.onload = img.onerror = () => res();
          }));
          Promise.all(waits).then(() => {
            setTimeout(() => {
              window.focus();
              window.print();
            }, 50);
          });
        </script>
      </body>
    </html>
  `;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(html);
  doc.close();

  const cleanup = () => {
    setTimeout(() => {
      try { document.body.removeChild(iframe); } catch {}
    }, 600);
  };
  iframe.contentWindow?.addEventListener('afterprint', cleanup);
  setTimeout(cleanup, 3000);
}
