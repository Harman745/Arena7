# Arena Seven — upgraded website

A responsive, animated multi-sport turf website for Arena Seven in Pitthuwala, Dehradun. Built with **HTML, CSS, and vanilla JavaScript**. No Node build or paid service required.

## What's new

- WhatsApp-first booking: the old date/time/name form has been removed.
- Direct WhatsApp links for each sport and a general booking link throughout the site.
- Animated hero, scrolling sport ticker, reveal-on-scroll sections, hover effects, and a scroll progress bar.
- Collapsible mobile navigation and mobile-friendly page layouts.
- Gallery: swipeable carousel, keyboard navigation, full-screen lightbox, and pause on hover/focus.
- Photos converted to WebP for a smaller and faster website.
- Respects reduced-motion accessibility settings. No fictitious live availability or published prices.

## Preview locally

Open `index.html` in a browser. For the most accurate preview use a simple local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Publish

On Netlify, drag the **contents** of this `arena-seven-website` directory into your site's deploy area, or upload this ZIP if Netlify accepts it. The homepage file must be at the website root (not inside a nested folder).

For GitHub Pages, upload the contents of this directory to the root of your repo, then enable Pages under Settings > Pages.

## Update the website

- WhatsApp number: currently **+91 82679 30564**, in HTML page links. Search the HTML files for `918267930564` to update it.
- Sport names, prices text, addresses, page copy: edit the `.html` pages.
- Animation styles, colors, spacing, navigation: `style.css`.
- Gallery image paths and interaction logic: `script.js`.
- Gallery files: `assets/gallery/` (optimized `.webp`).
- Opening hours currently advertised as **7 AM – 12 AM**; verify with the owner before publishing.
- `robots.txt` and `sitemap.xml`: update with the final domain before adding the website to Google Search Console. Existing placeholders have been kept.

## Booking behavior

Every Book on WhatsApp link opens WhatsApp with an enquiry message ready to send. Customers ask the owner about availability and rates, and **the team confirms bookings manually**. There is no calendar, payment processor, customer database, or automated reservation system; this is intentional.
