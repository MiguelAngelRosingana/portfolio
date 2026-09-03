# Portfolio · Miguel Ángel Rosingana

Portfolio personal de **Data Analyst**. Una sola página, sin frameworks ni proceso
de build: `index.html` con HTML, CSS y JavaScript plano.

**→ [miguelangelrosingana.github.io/portfolio](https://miguelangelrosingana.github.io/portfolio/)**

![Vista previa del portfolio](og.png)

---

## Qué hay dentro

Tres proyectos de análisis de datos contados en formato **Problema / Enfoque /
Resultado**, con las capturas de los informes: un modelo financiero en Power BI
sobre un esquema en estrella, un modelo de temporada a nivel de evento y una
automatización de limpieza de datos con Python y VBA.

## Decisiones técnicas

- **Sin dependencias.** Ni framework, ni bundler, ni gestor de paquetes. La página
  entera es un archivo que se abre con doble clic; la única petición externa es la
  de las tipografías.
- **Bilingüe ES/EN sin duplicar páginas.** Cada texto lleva sus dos versiones en
  atributos `data-es` y `data-en`; un botón las intercambia y guarda la
  preferencia. Al entrar se detecta el idioma del navegador.
- **Tema claro y oscuro.** Toda la paleta son variables CSS en `:root`. Por
  defecto respeta el tema del sistema del visitante y el interruptor lo fuerza.
- **Imágenes incrustadas.** La foto y las capturas van en base64 dentro del HTML,
  en WebP: la página se ve completa aunque se abra el archivo suelto y se ahorran
  peticiones. Los originales quedan en `img/`.
- **Responsive y accesible.** Sin scroll horizontal a 360 px, navegación por
  teclado en el visor de capturas y `prefers-reduced-motion` respetado.

## Stack

`HTML` · `CSS` (grid, variables, `color-mix`) · `JavaScript` (sin librerías) ·
`GitHub Pages`

## Estructura

```
├── index.html            La página completa: marcado, estilos y scripts
├── cv.pdf                CV que descarga el botón de la portada
├── og.png                Tarjeta de previsualización al compartir el enlace
├── favicon.svg           Icono de pestaña
├── apple-touch-icon.png  Icono al guardar la web en el móvil
└── img/                  Originales de la foto y las capturas
```

## Desarrollo

No hace falta servidor: abre `index.html` en el navegador. Para añadir un
proyecto, dentro de la sección `PROYECTOS` hay una plantilla comentada con la
estructura de una ficha.

---

## English

Personal **Data Analyst** portfolio. A single page with no frameworks and no
build step — plain HTML, CSS and JavaScript, served from GitHub Pages.

Bilingual (Spanish/English) through `data-*` attributes, light and dark themes
driven by CSS variables, and images embedded as base64 WebP so the page renders
even as a standalone file. Three data projects, each told as Problem / Approach /
Result, with screenshots of the reports.

---

## Contacto

**Miguel Ángel Rosingana Martín** · Data Analyst · Madrid
[miguel.rosin@gmail.com](mailto:miguel.rosin@gmail.com) ·
[LinkedIn](https://www.linkedin.com/in/miguel-angel-rosingana)
