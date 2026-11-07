# SEO and GEO

See also [architecture](architecture.md).

The game is a single route (`/`), so all metadata is static in `index.html`. Content is in French (`lang="fr"`, `og:locale` `fr_FR`).

## Where it lives

- `index.html` head: title, description, canonical, robots, Open Graph, Twitter card, `theme-color` (`#0b1028`, same as the `:root` background).
- `index.html` JSON-LD `@graph`: `WebSite`, `VideoGame` (genre, browser requirements, free offer), `SoftwareSourceCode` (public repo), and the shared `Person` node `https://akkibi.art/#person`.
- `index.html` `<noscript>`: short description for crawlers that do not run JavaScript.
- `public/robots.txt`: allows every crawler, points to the sitemap.
- `public/sitemap.xml`: the only route, `/`.
- `public/llms.txt`: summary, controls and requirements for AI answer engines.
- `public/og-image.jpg`: 1200×630 share image (gameplay screenshot).

## When something changes

- New route: add it to `sitemap.xml` and `llms.txt`. Per-route titles would need a head manager, since the app is a client-side SPA.
- Gameplay, controls or requirements: update the `VideoGame` description and `browserRequirements`, the `<noscript>` text and `llms.txt`.
- New share image: keep 1200×630 and update `og:image:alt`.
- Domain: update every absolute URL in the files above.
