# Upgrade-Plan: Dependency-Modernisierung

Stand: 2026-10-09 · Projekt: LEAN-CODERS Blog (`hochitom/blog`)

## 1. Ist-Analyse

Das Projekt ist **kein Astro-Projekt**, sondern ein Fork von `eleventy-base-blog` v5.0.2 auf **Eleventy 0.11** (2020) mit Nunjucks/Liquid-Templates, 18 Posts, YouTube-Video-Collection und Netlify-Deployment.

| Paket | Aktuell | Neueste | Sprung |
|---|---|---|---|
| `@11ty/eleventy` | ^0.11.0 | 3.1.6 | 2 Major (Node ≥ 18) |
| `@11ty/eleventy-navigation` | ^0.1.3 | 1.0.5 | 1 Major |
| `@11ty/eleventy-plugin-rss` | ^1.0.7 | 3.1.0 | 2 Major |
| `@11ty/eleventy-plugin-syntaxhighlight` | ^3.0.1 | 5.0.2 | 2 Major |
| `luxon` | ^1.21.3 | 3.7.2 | 2 Major |
| `markdown-it` | ^8.4.2 | 15.0.2 | 7 Major |
| `markdown-it-anchor` | ^5.2.5 | 10.0.0 | 5 Major |
| `xml2js` | ^0.4.23 | 0.6.2 | Minor (Sicherheitsfixes) |

Weitere Befunde:

- **Node-Version:** `.nvmrc` = 10 (EOL), lokal/Cloud läuft Node 22. `netlify.toml` pinnt keine Version. Eleventy 3 braucht Node ≥ 18.
- **Build-Befehl:** `DEBUG=* eleventy` in `netlify.toml` erzeugt unnötig riesige Logs.
- **`_11ty/videos.js`:** holt den YouTube-Feed bei jedem Build ohne Fehlerbehandlung (`reject()` ohne Fehler, kein Timeout, kein Fallback). Der Build bricht komplett ab, wenn YouTube nicht erreichbar ist. Das habe ich in der Sandbox bestätigt (`ENOTFOUND`). Außerdem ist `.sort((a, b) => a.published > b.published)` ein fehlerhafter Comparator (liefert Boolean).
- **Veraltete 0.x-Idiome** in `.eleventy.js`: `setDataDeepMerge(true)` (in 3.x Standard), `addLayoutAlias` (deprecated), `setBrowserSyncConfig` (ab 2.0 durch Dev-Server ersetzt), `markdownTemplateEngine: 'liquid'` (ab 3.0 ist Default Liquid, Verhalten prüfen).
- **Altlasten:** Verzeichnis `gatsby/` (alter Stand), Autor-/Repo-Metadaten von Zach Leatherman in `package.json`, `README` vom Starter.
- **Keine Tests / keine CI:** Absicherung nur durch Vergleich der Build-Ausgabe.

## 2. Zielbild

Entscheidung: **Bei Eleventy bleiben und auf 3.x upgraden** (kein Wechsel auf Astro). Begründung: Der Inhalt (Markdown + Nunjucks) bleibt unverändert nutzbar, der Aufwand ist deutlich kleiner als eine Migration, und Eleventy 3 ist aktiv gepflegt. Ein Astro-Umstieg (aktuell 7.x, Node ≥ 22.12) wäre ein eigenes Projekt und nur sinnvoll, wenn Komponenten/Interaktivität gewünscht sind. Das wäre mit Vanilla-CSS und Astro gemäß LEAN-CODERS-Standard umsetzbar, sprengt aber „Dependency Upgrade“.

Ziel-Stack: Node 22 LTS, Eleventy 3.1, aktuelle Plugins, ESM-Konfiguration (`eleventy.config.js`).

## 3. Vorgehen (Phasen, je ein Commit)

### Phase 0: Baseline absichern
1. Aktuelle Build-Ausgabe mit gepinntem YouTube-Feed-Snapshot erzeugen (`_site` → `_site-baseline`, außerhalb von Git), um später per `diff -r` zu vergleichen.
2. `videos.js` zuerst robust machen (siehe Phase 1), damit Builds reproduzierbar laufen.

### Phase 1: Plattform & Hygiene
- `.nvmrc` → `22`, `package.json` `engines.node` → `>=20`, `netlify.toml` → `NODE_VERSION = "22"`, Build-Command ohne `DEBUG=*`.
- `videos.js`: `fetch` (nativ in Node 22) statt `https`, Timeout, bei Fehler Fallback auf leere Liste bzw. gecachten Stand (`@11ty/eleventy-fetch` mit Cache-Dauer 1 Tag), korrekter Comparator (`b.published - a.published`; Sortierung vorher klären, siehe letzte Commits „changed order of videos“).
- `xml2js` → 0.6.2.

### Phase 2: Eleventy 0.11 → 3.x (Kernstück)
1. `@11ty/eleventy@^3`, Plugins auf Zielversionen heben, `package.json` auf `"type": "module"` setzen.
2. `.eleventy.js` → `eleventy.config.js` in ESM (`import`/`export default`); `_11ty/*.js` ebenfalls ESM (`export default`).
3. Entfernen/ersetzen: `setDataDeepMerge`, `addLayoutAlias` (Layouts per Front Matter `layout: layouts/post.njk`), `setBrowserSyncConfig` (optional eigenes 404 über `setServerOptions`/Dev-Server-Standard, der `404.html` bereits ausliefert).
4. Plugin-API-Änderungen:
   - `eleventy-plugin-rss` 3.x: Filter heißen z. B. `absoluteUrl`, `dateToRfc3339`; Feed-Templates prüfen (`feed/feed.njk`); optional das neue Virtual-Template-Feature nutzen.
   - `eleventy-plugin-syntaxhighlight` 5.x: Prism-CSS-Theme in `css/` prüfen.
   - `eleventy-navigation` 1.x: `eleventyNavigation`-Filter in `base.njk` testen.
5. `luxon` 3: `DateTime.fromJSDate(...).toFormat` bleibt kompatibel; Locale-/Zonen-Verhalten stichprobenartig prüfen (`readableDate`, `htmlDateString`).
6. `markdown-it` 15 und `markdown-it-anchor` 10: `permalink: true` ist ab Version 8 **entfernt** → auf `markdownItAnchor.permalink.linkInsideHeader({ symbol: '#', class: 'direct-link' })` umstellen. Optionen `html`, `breaks`, `linkify` bleiben gleich. Ausgabe der Überschriften-Anker vergleichen (CSS-Klasse `direct-link`).
7. Template-Engine: `markdownTemplateEngine: 'liquid'` weiterhin explizit setzen; Posts auf `{{ }}`/`{% %}`-Sequenzen in Codeblöcken prüfen (ggf. `{% raw %}`).
8. `permalink`/URL-Verhalten: In Eleventy 3 sind `pathPrefix`-Filter und Datumsextraktion aus Dateinamen unverändert, aber `page.date`-Parsing von Front-Matter-Daten ist strenger → alle 18 Posts bauen und Datumsausgaben vergleichen.

### Phase 3: Validierung
- `diff -r` der `_site`-Ausgabe gegen Baseline; erwartete Abweichungen (Anchor-Markup, Generator-Meta) dokumentieren.
- Prüfen: Startseite, Archiv, Tags-Seiten, Feed (`/feed/feed.xml`, valides Atom), Sitemap, 404, Videos-Seite, Syntax-Highlighting, Bilder/CSS-Passthrough.
- Netlify Deploy-Preview vor Merge nutzen.

### Phase 4: Aufräumen (optional, separat)
- `gatsby/`-Verzeichnis und Starter-Metadaten in `package.json`/`README` entfernen bzw. durch LEAN-CODERS-Angaben ersetzen.
- Dependabot oder Renovate aktivieren, damit der Rückstand nicht wieder entsteht.
- Einfache CI (GitHub Actions: `npm ci && npm run build`).

## 4. Risiken

| Risiko | Wahrscheinlichkeit | Gegenmaßnahme |
|---|---|---|
| Anchor-Links ändern Markup/Optik | hoch | Phase 2.6, CSS anpassen |
| Templates brechen durch strengere Engines | mittel | Baseline-Diff |
| Build scheitert an YouTube-Feed | hoch (bereits heute) | Phase 1 Fallback/Cache |
| ESM-Umstellung vergessene `require` | niedrig | Build schlägt sofort fehl |
| Feed-URL/Plugin-Filter geändert | mittel | Feed-Validierung |

## 5. Aufwand

Grob 0,5–1 Tag: Phase 1 ~1 h, Phase 2 ~3 h, Phase 3 ~1–2 h, Phase 4 optional ~1 h.

## 6. Empfohlene Reihenfolge der Umsetzung

Branch `chore/dependency-upgrade`, Phasen 0 → 3 als einzelne Commits, PR mit Netlify-Preview. Phase 4 als Folge-PR.
