# Ecommerce Product Page

## Project Overview

A static single-product ecommerce page built as a Frontend Mentor challenge. Displays sneaker product details with an interactive gallery, lightbox, quantity selector, and cart — no backend or build step required.

## Tech Stack

- **HTML5** — semantic markup (`index.html`)
- **CSS3** — Flexbox/Grid, custom properties, media queries (`style.css`)
- **Vanilla JS (ES6)** — no frameworks, no bundler (`script.js`)
- **Google Fonts** — Kumbh Sans (only this family is used; others in the import are unused)

## Key Directories & Files

| Path             | Purpose                                                         |
| ---------------- | --------------------------------------------------------------- |
| `index.html`     | Single-page entry point; all markup lives here                  |
| `style.css`      | All styles; single responsive breakpoint at line 408            |
| `script.js`      | All interactivity; DOM queries cached at top, event logic below |
| `images/`        | SVG icons + JPG product images (main + `-thumbnail` variants)   |
| `design/`        | JPG mockups from Frontend Mentor (reference only, not served)   |
| `style-guide.md` | Official color palette, typography, and breakpoint specs        |

## Running Locally

No build step needed — open `index.html` directly in a browser, or serve with any static file server:

```
npx serve .
# or
python -m http.server
```

## Additional Documentation

Check these files when working on the relevant area:

- [`.claude/docs/architectural_patterns.md`](.claude/docs/architectural_patterns.md) — state management, event handling, CSS class-toggle pattern, modal/overlay system, image gallery synchronization

## Adding New Features or Fixing Bugs

**IMPORTANT**: When you work on a new feature or bug, create a git branch first.
Then work on changes in that branch for the remainder of the session.
