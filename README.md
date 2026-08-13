# AstroTurismo. 🛩️

Sitio web de Turismo para la agencia ficticia **AstroTurismo**, especializada en llevar viajeros a los cielos más oscuros del planeta (Bortle clase 1 y 2) para observar auroras boreales, lluvias de meteoros, eclipses totales y la Vía Láctea.

## Screenshots📸

![image alt](https://github.com/lpalacios1410/AstroTurismo/blob/5fad7b65f4500c1c97499cba1da0e401da39fd8a/public/Astro1.png)

![image alt](https://github.com/lpalacios1410/AstroTurismo/blob/5fad7b65f4500c1c97499cba1da0e401da39fd8a/public/Astro2.png)

![image alt](https://github.com/lpalacios1410/AstroTurismo/blob/5fad7b65f4500c1c97499cba1da0e401da39fd8a/public/Astro3.png)

![image alt](https://github.com/lpalacios1410/AstroTurismo/blob/5fad7b65f4500c1c97499cba1da0e401da39fd8a/public/Astro4.png)


## STACK ⚡

![Stack](https://img.shields.io/badge/Astro-5-ff5d01?logo=astro&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06b6d4?logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88ce02?logo=greensock&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)

---

## ✨ Características

- **Visor de constelaciones interactivo** — tres constelaciones (Orión, Osa Mayor, Casiopea) con:
  - Parallax que sigue el cursor (efecto lente con perspectiva).
  - Retícula de mira con telemetría **RA/DEC en vivo**.
  - Líneas que se dibujan con `strokeDashoffset`, estrellas que titilan.
  - Clic en una estrella = "Enfoque" con onda expansiva y anillo de bloqueo.
  - Estrellas fugaces que cruzan el ocular cada pocos segundos.
  - "Parpadeo de apertura" al cambiar de constelación.
- **Destinos** — Lofoten, Denali y Vatnajökull con badge de clase Bortle (Bortle 1 = premium en púrpura).
- **Animaciones de scroll** — reveals con `ScrollTrigger` mediante el atributo `data-reveal`; el contenido es visible sin JavaScript.
- **Arquitectura islas** — solo se hidrata React donde hace falta interactividad; el resto es HTML estático (SEO + rendimiento).

## 🛠️ Stack

| Herramienta | Rol |
| --- | --- |
| **Astro 5** | Framework de contenido / renderizado estático |
| **Tailwind CSS 3.4** | Estilos y tokens de diseño (`tailwind.config.ts`) |
| **React 19** | Islas interactivas (visor y fondo estelar) |
| **GSAP 3.15** | Animaciones: ScrollTrigger, ticker, quickTo, dibujado de líneas |
| **TypeScript** | Tipado estricto (`astro/tsconfigs/strict`) |

## 🚀 Instalación

Requisitos: **Node.js ≥ 18**.

```bash
npm install      # instala dependencias
npm run dev      # servidor local → http://localhost:4321
```

## 📜 Scripts

```bash
npm run dev      # desarrollo con hot reload
npm run build    # build de producción → dist/
npm run preview  # previsualiza el build
npm run check    # type-check (astro check)
```

> Nota para Windows: `build` pasa por `scripts/build.mjs`, que tolera el fallo conocido de Astro al limpiar directorios vacíos (`dist/chunks`, `dist/pages`) por un EBUSY de libuv/Node.

## 🗂️ Estructura

```
public/                        # favicon, auroras SVG, constelaciones decorativas
src/
├── components/
│   ├── common/                # Header, Footer, Button
│   ├── hero/                  # Hero + StarBackground (isla canvas + GSAP)
│   ├── constellations/        # Viewer + Canvas + Tabs (isla React)
│   ├── destinations/          # Grid + Card (Lofoten, Denali, Vatnajökull)
│   └── features/              # Grid + Card (beneficios de la expedición)
├── data/                      # constellations.ts, destinations.ts (datos tipados)
├── layouts/                   # Layout.astro (head, fuentes, fondo global)
├── pages/                     # index.astro (página única)
├── styles/                    # global.css (Tailwind + utilidades reutilizables)
├── types/                     # interfaces de Constellation y Destination
└── utils/                     # gsap.ts (registro central de ScrollTrigger)
scripts/                       # build.mjs (wrapper de build para Windows)
```

## 🎨 Sistema de diseño


- **Colores:** Obsidian Black `#020305` (fondo), Deep Midnight Blue `#05070A` (contenedores), Aurora Teal `#00F5FF` (acción primaria), Celestial Purple `#BC13FE` (acento premium).
- **Tipografía:** Montserrat (títulos) + Inter (UI), con etiquetas `label-sm` (mayúsculas + tracking) y dígitos tabulares (`hud-tnum`) para datos.
- **Elevación:** L0 fondo estelar → L1 contenedores → L2 cristal (`surface-glass`) → L3 elementos activos con glow.
- **Shapes:** botones pill (`rounded-xl`), tarjetas de vidrio (`rounded-lg`), selectores circulares.

## Deployment

Deployed on [Vercel](https://vercel.com) with automated daily deploys via GitHub Actions.

## Author 📄

**Luis Palacios** — [@lpalacios1410](https://github.com/lpalacios1410)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/luis-palacios-739b1b15a)
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat&logo=gmail&logoColor=white)](mailto:luisarmando20092009@gmail.com)

**Proyecto educativo ficticio. Las imágenes de destino son ilustraciones SVG generadas con IA para este proyecto.**
