# hochitom.at

Persönlicher Blog über Radfahren, gebaut mit [Eleventy](https://www.11ty.dev/) 3 und gehostet auf Netlify.

## Voraussetzungen

* Node.js 24 (siehe `.nvmrc`)

## Entwicklung

```
npm install
npm start      # lokaler Server mit Live-Reload
npm run build  # statischer Build nach _site/
```

## Aufbau

* `posts/` – Blogartikel als Markdown
* `_includes/` – Layouts und Partials (Nunjucks)
* `_data/metadata.json` – Seitentitel, Autor, Feed-Angaben
* `_11ty/` – eigene Collections (Tag-Liste, YouTube-Videos)
* `eleventy.config.js` – Eleventy-Konfiguration
* `css/`, `img/` – Assets (werden unverändert kopiert)

## Hinweise

* **Videos:** Der YouTube-Feed wird beim Build geladen und einen Tag lang in `.cache/` zwischengespeichert. Ist YouTube nicht erreichbar, wird der letzte Cache genutzt, ohne Cache bleibt die Videoliste leer.
* **Dependencies:** Dependabot erstellt wöchentlich Updates, die GitHub Action `Build` prüft jeden Pull Request.

## Lizenz

MIT, basierend auf [eleventy-base-blog](https://github.com/11ty/eleventy-base-blog) von Zach Leatherman (siehe `LICENSE`).
