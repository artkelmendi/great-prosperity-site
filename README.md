# Great Prosperity — Hotel Supplies (static website)

A 3-page, fully static, bilingual (Albanian / English) website for a company that
sells supplies to hotels. Built with plain **HTML + CSS + vanilla JavaScript** — no
build step, no dependencies. It runs by opening a file and deploys to any static host.

## Pages
- `index.html` — Home (hero, categories, why-us, stats, CTA)
- `catalog.html` — Catalogue (filterable static product grid)
- `contact.html` — Contact (info cards + enquiry form)

## Folder structure
```
hotel-supplies-site/
├── index.html
├── catalog.html
├── contact.html
├── assets/
│   ├── css/style.css      ← all styling + design tokens (colors at the top)
│   ├── js/main.js         ← language toggle, scroll animations, filter, form
│   └── img/               ← put your product / hero photos here
└── README.md
```

## How to preview locally
Just double-click `index.html` — it opens in your browser. Everything works offline
except the Google Fonts (which need internet the first time).

## Language toggle
The site is Albanian by default with an **SQ / EN** switch in the top-right. The choice
is remembered in the browser. Translations live directly on each element as
`data-sq="..."` and `data-en="..."` attributes — edit both to change the text.

## Brand & logo
The brand is **Great Prosperity** (slogan **Hotel Supplies**). The logo files live in
`assets/img/`:
- `logo-mark.png` — colour sailboat mark, used in the top nav (on light backgrounds)
- `logo-mark-light.png` — light version, used in the footer (on the dark background)
- `logo.png` — the full original lockup (mark + wordmark), kept for print/marketing

To swap in a new logo, replace those files (keep the same names) or update the
`<img class="brand__logo">` / `<img class="footer__logo">` tags in the three pages.
The email placeholder is `info@greatprosperity.com` — change it to the real inbox.

## Catalogues (PDF cards)
The catalogue page (`catalog.html`) shows one card per product **catalogue**. Each
card opens its PDF in a new browser tab when clicked. The PDFs live in
`assets/catalogs/` and the card icons are inline SVG (no image files needed).

To add or change a catalogue:
1. Drop the new PDF into `assets/catalogs/` (use a simple lowercase name, e.g.
   `hotel-lamps.pdf`).
2. Open `catalog.html` and copy one `<a class="cat-card">…</a>` block.
3. Point `href` to your PDF, update the page count in the `cat-card__badge`, and
   edit the title / description (`data-sq` + `data-en`).
4. The coloured panel comes from the inline `--cg1` / `--cg2` gradient variables —
   change them to retint a card, or swap the inline `<svg class="cat-card__icon">`
   for a different icon. To use a real photo instead of the gradient+icon, replace
   the contents of `<div class="cat-card__media">` with
   `<img src="assets/img/cover.jpg" class="cat-card__img">` (and add
   `.cat-card__img{width:100%;height:100%;object-fit:cover}` to the CSS).

> **Note on size:** the 11 PDFs total ~113 MB. That's fine for Netlify / Vercel /
> Cloudflare / GitHub Pages, but it makes the upload bigger — keep the PDFs
> reasonably compressed if you add many more.

## Updating contact details
Phone, email, address and opening hours are in `contact.html` and in the footer of all
three pages. Update the `tel:`, `mailto:` and `data-sq/data-en` text.

## Contact form note
The form currently shows a success message on submit but does **not** send email yet
(a static site can't send mail by itself). Two easy options:
- **Formspree / Web3Forms** — paste your form endpoint into the `<form>` `action`.
- **Netlify Forms** — add `netlify` to the `<form>` tag if you host on Netlify.
Tell me which host you pick and I'll wire it up.

## Colors & fonts (design system)
Open `assets/css/style.css` — the palette is at the very top under `:root`:
cool navy/slate canvas + a sky-blue accent drawn from the sailboat logo. Fonts are
Playfair Display (headings) + Inter (body), loaded from Google Fonts.

The home-page hero shows floating cards with real product photos
(`assets/img/prod-*.jpg`, extracted from the catalogues) — swap those files to
feature different products. The category tiles and catalogue cards use brand
gradients set per tile via inline `--cg1` / `--cg2` variables.

## Publishing to a domain
Pick any of these (all free tiers available):
- **Netlify** — drag the whole `hotel-supplies-site` folder onto app.netlify.com → instant URL, then point your domain.
- **Vercel** — `vercel` CLI or drag-and-drop import.
- **GitHub Pages** — push the folder to a repo, enable Pages.
- **Cloudflare Pages** — connect a repo or direct upload.
- **Traditional cPanel / FTP hosting** — upload the folder contents into `public_html`.

Because it's fully static, there's nothing to "run" on the server — just upload the files.
