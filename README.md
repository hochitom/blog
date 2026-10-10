# hochitom.at

Persönlicher Blog über Radfahren, gebaut mit [Astro](https://astro.build) und Tailwind CSS und gehostet auf Netlify.

## Voraussetzungen

* Node.js 24 (siehe `.nvmrc`)

## Entwicklung

```
npm install
npm start       # Astro-Dev-Server mit Live-Reload
npm run build   # statische Seite nach dist/ erzeugen
npm run preview # gebaute Seite lokal ansehen
npm run check   # Typen und Content-Schema prüfen
```

## Aufbau

* `src/content/posts/` – Blogartikel als Markdown (`title`, `date`, `tags`)
* `src/content/videos/` – Videos als Markdown-Dateien (siehe unten)
* `src/content.config.ts` – Schema der Content Collections
* `src/pages/` – Routen; `bikes.md`, `ausruestung.md` und `ueber-mich.md` sind einfache Markdown-Seiten
* `src/layouts/`, `src/components/` – Layouts und Komponenten
* `src/lib/` – Seitendaten (`site.ts`), Navigation, Datumsformat und Collection-Helfer
* `src/styles/` – Tailwind-Quelle (`style.css`) und Typografie (`prose.css`)
* `src/assets/` – Bilder; Astro erzeugt daraus optimierte Varianten
* `public/` – unveränderte Dateien (`sw.js`, Videos als mp4 unter `public/img/`)
* `astro.config.mjs` – Astro-Konfiguration (Markdown-Plugins, Sitemap, Tailwind)

## Videos

Die Videos liegen als statische Dateien im Projekt, es gibt keine Abhängigkeit von YouTube-API oder Datenbank:

* `src/content/videos/<name>.md` – ein Video pro Datei: Metadaten im Front Matter (`id`, `title`, `date`, `viewCount`, `thumbnail`, `link`), die Beschreibung als Markdown-Text darunter. Der Dateiname bestimmt die URL (`/videos/<name>/`).
* `src/assets/videos/<id>.jpg` – Vorschaubild des Videos

Das Video selbst wird weiterhin von YouTube (`youtube-nocookie.com`) eingebettet. Ein neues Video ist eine neue Datei mit dem gleichen Aufbau.

## Feed und Sitemap

* `/feed/feed.xml` – RSS-2.0-Feed der Artikel (`src/pages/feed/feed.xml.ts`)
* `/sitemap-index.xml` – erzeugt von `@astrojs/sitemap`; `/sitemap.xml` leitet per 301 (`netlify.toml`) dorthin weiter

## Deployment

Netlify baut mit `npm run build` und veröffentlicht den Ordner `dist`. Die Node-Version steht in der `netlify.toml`. Für Pull Requests erstellt Netlify automatisch eine Deploy-Preview.

## Lizenz

MIT, ursprünglich basierend auf dem Starter `eleventy-base-blog` von Zach Leatherman (siehe `LICENSE`).
