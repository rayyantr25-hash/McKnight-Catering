# McKnight's Catering — Website Redesign

Production-ready static site. Pure HTML5 / CSS3 / vanilla JS — no build step,
no framework, and no backend files included in this folder. Forms are
frontend-only (they validate and show a success state, but don't send
anywhere yet) — wire them up to whatever backend/CRM/email service you choose
whenever you're ready.

## Structure
Everything lives flat in this one folder:
- `index.html`, `workplace-dining.html`, `corporate-catering.html`, `formal-events.html`,
  `sliders-and-dogs.html`, `chef-curated-menus.html`, `about.html`, `contact.html`,
  `gallery.html`, `login.html`, `signup.html`, `404.html`
- `style.css` — all styles (design tokens as CSS variables at the top)
- `main.js` — nav, header/logo behavior, hero & testimonial carousels (Swiper),
  scroll reveals (GSAP), popup, gallery filter/lightbox, animated counters, forms
- `mcknights-logo-transparent.png` — your logo, transparent background (used on
  the white navbar, footer, popup, and login/signup cards)
- `logo-white.png` — a white version of your logo (transparent background),
  generated for use on dark sections if you add any later
- `*.jpg` — optimized photos (client slider/hot dog photography + event photography)
- `robots.txt`, `sitemap.xml`, `manifest.json`, `favicon-32.png`, `apple-touch-icon.png`, `favicon.png`

## Running it locally
Open with a local server, not by double-clicking the file (browsers block
relative CSS/JS requests over `file://`). Easiest options:
- VS Code → "Live Server" extension → right-click `index.html` → Open with Live Server
- Or from a terminal in this folder: `python -m http.server 8080` → open `http://localhost:8080`

## Forms (frontend-only, by design)
`contact.html` (quote request), the homepage $25-off popup, the footer
newsletter signup, and `login.html` / `signup.html` all validate and show a
success message on submit, but nothing is sent anywhere yet — there is no
backend code in this folder. When you're ready to connect them, `main.js`'s
`initForms()` is where submissions are handled; that's the one spot to wire
into an email service, CRM, or your own backend/auth system.

## Updating content
Each page is plain HTML — open the file and edit text directly. Headings,
paragraphs, and image `src`/`alt` attributes are all in place, no templating
engine required.

To change site-wide colors, edit the `:root` variables at the top of
`style.css` (`--ink`, `--charcoal`, `--gold`, `--white`, `--paper`).

## Navbar & logo
The header is white with a sticky, shrinking-on-scroll behavior, and uses your
actual logo (transparent PNG) rather than a placeholder mark. The hamburger
menu (below ~1080px width) opens a full-width white panel with all nav links,
Login, and Order Now — positioned dynamically under the header/top bar so it
never overlaps.

## Hero carousel
The homepage hero and each service page's banner rotate through a short set
of real event/food photos (Swiper.js, autoplay + fade), rather than a single
static image.

## Marketing integrations
Add your Google Analytics / GTM snippets right before `</head>` in each page.
Not included yet since IDs weren't provided.

## Order Now
The "Order Now" button in the header and Sliders & Dogs page links to the
existing BentoBox store (`catering-store-v2`) until a new checkout is built.

## Client contact info used throughout
- Address: 1990 Post Oak Suite A, Houston, TX 77056 (Google Maps CID in footer/contact links)
- Phone: 832-257-6694
- Email: gmcknight@yccfoodservice.com
