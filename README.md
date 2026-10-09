# hochitom.at

Persönlicher Blog über Radfahren, gebaut mit Eleventy und Tailwind CSS und gehostet auf Netlify.

## Voraussetzungen

* Node.js 24 (siehe `.nvmrc`)
* Zugangsdaten für die Video-Pipeline (siehe unten)

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
* `_11ty/` – eigene Collections und Filter (Tag-Liste, Videos)
* `.eleventy.js` – Eleventy-Konfiguration
* `resources/css/` – Tailwind-Quelle; das erzeugte `css/style.css` wird nicht eingecheckt
* `img/` – Bilder, werden über den `image`-Shortcode in mehrere Größen umgewandelt
* `sw.js` – Skript, das alte Service Worker im Browser abmeldet

## Videos

Die Videoliste wird beim Build über die YouTube Data API geladen. Die Permalinks der Videos werden in einer MongoDB gespeichert, damit sich die URLs nicht ändern. Dafür werden diese Umgebungsvariablen gebraucht:

* `youtube_api` – API-Schlüssel der YouTube Data API
* `mongo_user` – Benutzer der MongoDB
* `mongo_pw` – Passwort der MongoDB

Lokal können sie in einer `.env` im Projektordner stehen (die Datei ist von Git ausgeschlossen). Auf Netlify werden sie unter „Environment variables“ gesetzt. Ohne gültige Zugangsdaten bricht der Build derzeit ab.

## Deployment

Netlify baut mit `npm run build` und veröffentlicht den Ordner `_site`. Die Node-Version steht in der `netlify.toml`. Für Pull Requests erstellt Netlify automatisch eine Deploy-Preview.

## Lizenz

MIT, basierend auf dem Starter `eleventy-base-blog` von Zach Leatherman (siehe `LICENSE`).
