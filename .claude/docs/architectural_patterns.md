# Architectural Patterns

## 1. Module-Level Global State

Two mutable variables hold all runtime state:

- `script.js:29` — `let currentNumber` tracks selected quantity
- `script.js:30` — `let currentImg` tracks the active gallery image index (1–4)

All event handlers read and write these directly. There is no encapsulation or pub/sub; a change to one of these variables takes effect on the next handler execution.

## 2. DOM Reference Caching at Module Top

All `querySelector` / `querySelectorAll` calls happen once at script load (`script.js:2–27`), before any event listeners are registered. References are stored in `const` variables and reused throughout. Exception: `toggleSidebar()` (`script.js:147–162`) queries `.sidebar`, `.close-btn`, `body`, and `.overlay` on every invocation — those elements are not cached at the top level.

## 3. CSS Class Toggle as UI State Machine

Visibility and active states are controlled entirely by adding/removing CSS utility classes — no inline `style` changes except the overlay opacity. Key classes:

| Class            | Effect                            | Applied via                             |
| ---------------- | --------------------------------- | --------------------------------------- |
| `invisible`      | `display: none`                   | `classList.add/remove`                  |
| `emptyCart`      | Shows empty-cart placeholder      | `classList.remove` on add-to-cart       |
| `selected`       | Orange border on active thumbnail | `classList.add` after removing previous |
| `sidebar-active` | Slides sidebar into view          | `classList.toggle`                      |
| `no-scroll`      | Prevents body scroll              | `classList.toggle` on `<body>`          |

See `script.js:33,37,41,51,111,132,154–155` for all toggle call sites.

## 4. Synchronized Dual-Image State

The main gallery image and the lightbox image are always kept in sync. Every image-change action updates both `mainThumbnailImg.src` (`.mainImg` outside the lightbox) and `bigMainImageLightBox.src` (`.lightbox-Container .mainImg`):

- Thumbnail click path: `script.js:45–72` (switch on `src` attribute)
- Previous/Next button path: `script.js:74–92` (template literal with `currentImg` index)

Both paths must be updated together when adding new images or changing the naming convention.

## 5. Dynamic Cart Content via `innerHTML`

When the user clicks "Add to Cart", the cart body is replaced wholesale with a template-literal HTML string (`script.js:114–128`). The empty-state `<p>Your Cart Is Empty</p>` is the default HTML in `index.html:51`; `removeBasketCart()` (`script.js:135–144`) restores it by setting `cartWrapper.innerHTML` to that string again.

Because the delete button and checkout button are injected via `innerHTML`, their event listeners must be attached after injection. The checkout button gets a listener at `script.js:130–131`; the delete button uses an inline `onclick="removeBasketCart()"` attribute (`script.js:122`).

## 6. Overlay / Modal Pattern

Both the sidebar and the lightbox share the same `.overlay` element (`index.html:20`). The overlay dims the background; body scrolling is locked alongside it. The lightbox modal (`#myModal`) uses the `invisible` class pattern (§3 above), while the sidebar uses `sidebar-active` plus a direct `opacity` style on the overlay (`script.js:157–161`).

## 7. Single Responsive Breakpoint

All mobile overrides live in one `@media screen and (max-width: 700px)` block at `style.css:408`. Desktop layout is the default; the media query adjusts layout, hides thumbnails, shows the hamburger menu, and stacks the two-column product layout into a single column.

## 8. Mixed Event-Binding Styles

The codebase uses two binding approaches without a consistent rule:

- `addEventListener` for primary interactive elements (`script.js:32–133`)
- Inline `onclick` attributes for the hamburger menu, close button, delete button, and checkout button (`index.html:23,28`; `script.js:122,126`)

The inline handlers call named functions (`toggleSidebar`, `removeBasketCart`, `checkOutButton`) defined at the bottom of `script.js:135–166`.
