# Portfolio — Miguel

Portfolio personal de data analyst. Una sola página, sin dependencias ni build:
solo `index.html` (HTML + CSS + un poco de JS). Bilingüe ES/EN y con modo claro/oscuro.

## Publicar en GitHub Pages (5 minutos)

1. Crea un repositorio nuevo en GitHub llamado **`portfolio`** (público).
2. Sube `index.html` (arrastrar y soltar en la web de GitHub vale) o por consola:

   ```bash
   git init
   git add .
   git commit -m "Portfolio inicial"
   git branch -M main
   git remote add origin https://github.com/MiguelAngelRosingana/portfolio.git
   git push -u origin main
   ```

3. En el repo: **Settings → Pages → Source: Deploy from a branch → `main` / `root` → Save**.
4. En un par de minutos estará en `https://MiguelAngelRosingana.github.io/portfolio/`.

> Si quieres que la URL sea `https://MiguelAngelRosingana.github.io` (sin `/portfolio`),
> llama al repositorio `MiguelAngelRosingana.github.io` en vez de `portfolio`.

## Qué falta por editar

Nombre, foto, experiencia, formación, certificación PL-300, email y LinkedIn ya
están puestos con los datos de tu CV, y `cv.pdf` está incluido en el repo (es el
que se descarga desde el botón "Descargar CV").

La foto va **incrustada dentro de `index.html`** (en base64), así que la página se
ve entera aunque abras el archivo suelto, sin la carpeta al lado. El original
está en `img/miguel.jpg` por si quieres cambiarla: si la sustituyes, hay que
volver a incrustarla o cambiar los dos `src="data:image/jpeg;base64,..."` por
`src="img/miguel.jpg"`.

| Dónde | Qué cambiar |
|---|---|
| Enlaces "Ver el proyecto en GitHub" | Apuntan a tu perfil. Cuando subas cada proyecto, cámbialos por la URL del repo concreto (p. ej. `github.com/MiguelAngelRosingana/control-financiero-powerbi`) |
| Sección Proyectos | Añadir capturas de los informes (ver más abajo) y, si publicas los repos, un enlace a cada uno |
| Enlace de la certificación | El botón PL-300 apunta a la página oficial de Microsoft. Si tienes la insignia en Credly, pon ahí tu URL personal: se puede verificar y vale más |
| `cv.pdf` | Sustitúyelo cuando actualices el CV; el nombre del archivo debe seguir siendo `cv.pdf` |

## Imagen de previsualización y favicon

`og.png` (1200×630) es la tarjeta que se ve al pegar el enlace en LinkedIn,
WhatsApp o Slack. Las etiquetas `og:` de `index.html` apuntan a
`https://miguelangelrosingana.github.io/portfolio/og.png`: **si publicas el repo con otro
nombre, cambia esa URL y la de `og:url`**, o el enlace saldrá sin miniatura.

El icono de pestaña va incrustado como SVG dentro del propio `index.html`
(`favicon.svg` está en el repo por si quieres editarlo) y `apple-touch-icon.png`
es el icono al guardar la web en la pantalla de inicio del móvil.

Para que LinkedIn refresque la miniatura tras un cambio, pasa la URL por el
Post Inspector: https://www.linkedin.com/post-inspector/

## Cómo funcionan los dos interruptores

- **Idioma (ES/EN):** cada texto lleva `data-es="..." data-en="..."`. El botón
  intercambia el contenido y guarda la preferencia. Para traducir algo nuevo,
  añade los dos atributos y ya está.
- **Tema:** los colores son variables CSS en `:root`. Por defecto respeta el tema
  del sistema del visitante; el botón `◐` lo fuerza y recuerda la elección.

## Añadir un proyecto

Dentro de la sección `PROYECTOS` hay un bloque comentado con la plantilla
(`PLANTILLA: copia este bloque`). Cópialo, cámbiale el número y rellena
**Problema / Enfoque / Resultado** — ese trío es lo que hace que un proyecto de
portfolio se lea como trabajo real y no como una lista de herramientas.

## Capturas de los dashboards

El proyecto de control financiero ya lleva dos capturas (portada e inversiones),
incrustadas en el HTML igual que la foto. Los archivos originales están en `img/`
en `.webp` (los que usa la página) y en `.png`.

Para añadir una captura a otro proyecto, copia dentro de su `<article class="entry">`
un bloque como este, justo después del `<p class="entry-tools">`:

```html
<div class="shots">
  <figure class="shot">
    <img src="img/mi-captura.webp" alt="Descripción de lo que se ve">
    <figcaption>Una línea explicando qué demuestra la imagen.</figcaption>
  </figure>
</div>
```

Consejo: la captura no es decoración. El pie de foto debe decir qué demuestra,
no repetir el título del informe.

## Aviso sobre los datos de las capturas

Las capturas del proyecto de finanzas muestran importes reales (valor de cartera,
capital invertido, patrimonio neto). Es una página pública: si prefieres no
enseñarlos, cambia los valores del Excel por unos de ejemplo, vuelve a capturar y
sustituye las imágenes.

## Probar en local

Abre `index.html` con doble clic. No hace falta servidor.
