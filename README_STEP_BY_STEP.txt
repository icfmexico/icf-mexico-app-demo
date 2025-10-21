PASO A PASO — ICF México App DEMO (PWA)

ARCHIVO: ICF_Mexico_App_Demo_PWA.zip

1) DESCARGA
   - Descarga el ZIP y descomprímelo en tu computadora.

2) SUBIR A GITHUB
   - Entra a https://github.com (login) → botón "New" → crea repo: icf-mexico-app-demo.
   - Dentro del repo: "Add file" → "Upload files" → arrastra TODO el contenido de la carpeta descomprimida → "Commit changes".

3) DEPLOY EN VERCEL
   - Entra a https://vercel.com (login) → "New Project" → "Import Git Repository" → selecciona icf-mexico-app-demo → Deploy.
   - Al terminar: Settings → Environment Variables → agrega dos variables:
       NEXT_PUBLIC_ENV = DEMO
       NEXT_PUBLIC_QUOTE_ENDPOINT = https://icfmexico-leads.vercel.app/api/quote
   - Haz "Redeploy" para que tome las variables.

4) PROBAR
   - Abre la URL que te da Vercel (ej. https://icf-mexico-app-demo.vercel.app).

5) INSTALAR EN TELÉFONO (PWA)
   - iPhone (Safari): botón de compartir → "Agregar a pantalla de inicio".
   - Android (Chrome): verás "Instalar app" o menú ⋮ → "Agregar a pantalla de inicio".