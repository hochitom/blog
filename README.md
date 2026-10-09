# hochitom.at

Persönlicher Blog über Radfahren, gebaut mit Eleventy und Tailwind CSS und gehostet auf Netlify.

## Voraussetzungen

* Node.js 24 (siehe `.nvmrc`)

## Entwicklung

```
npm install
npm start       # Eleventy-Server mit Live-Reload und CSS-Watcher
npm run build   # CSS bauen und statische Seite nach _site/ erzeugen
```

Weitere Befehle:

* `npm run css` baut nur das CSS (`resources/css/style.css` → `css/style.css`)
* `npm run css:watch` baut das CSS bei Änderungen neu
* `npm run watch` / `npm run serve` starten Eleventy ohne CSS-Watcher
* `npm run debug` startet Eleventy mit ausführlicher Ausgabe

## Aufbau

* `posts/` – Blogartikel als Markdown
* `_includes/` – Layouts und Partials (Nunjucks)
* `_data/metadata.json` – Seitentitel, Autor und Feed-Angaben
* `_11ty/` – eigene Collections und Filter (Tag-Liste, Video-Filter)
* `videos/` – Videos als Markdown-Dateien (siehe unten)
* `.eleventy.js` – Eleventy-Konfiguration
* `resources/css/` – Tailwind-Quelle; das erzeugte `css/style.css` wird nicht eingecheckt
* `img/` – Bilder, werden über den `image`-Shortcode in mehrere Größen umgewandelt
* `sw.js` – Skript, das alte Service Worker im Browser abmeldet

## Videos

Die Videos liegen als statische Dateien im Projekt, es gibt keine Abhängigkeit mehr von YouTube-API oder Datenbank:

* `videos/<name>.md` – ein Video pro Datei: Metadaten im Front Matter (`id`, `title`, `date`, `permalink`, `viewCount`, `thumbnail`, `link`), die Beschreibung als Markdown-Text darunter
* `img/videos/<id>.jpg` – Vorschaubild des Videos

Das Video selbst wird weiterhin von YouTube (`youtube-nocookie.com`) eingebettet. Texte lassen sich direkt in den Markdown-Dateien ändern. Ein neues Video ist eine neue Datei mit dem gleichen Aufbau. Die Collection `videos` (neueste zuerst) wird in `.eleventy.js` aus `videos/*.md` gebildet.

## Deployment

Netlify baut mit `npm run build` und veröffentlicht den Ordner `_site`. Die Node-Version steht in der `netlify.toml`. Für Pull Requests erstellt Netlify automatisch eine Deploy-Preview.

## Lizenz

MIT, basierend auf dem Starter `eleventy-base-blog` von Zach Leatherman (siehe `LICENSE`).
