# Forma Gallery

A digital art gallery platform built with React, Vite, and Tailwind CSS v4. Features a curated grid gallery, artwork detail pages, a submission form for artists, and a personal saved collection.

![Forma Gallery](https://images.unsplash.com/photo-1785622576497-434cddec9a8f?w=1200&h=400&fit=crop&auto=format)

## Features

- **Gallery View** — Masonry-style grid of artworks with hover animations (scale, overlay, info slide-up)
- **Artwork Detail** — Full image, artist info, metadata, price, and inquiry modal
- **Submit Artwork** — Form with drag-and-drop file upload for artists to submit work
- **Saved Collection** — Heart-save any artwork; view your personal collection with combined value stats
- **Category Filtering** — Filter gallery by Abstract, Generative, Figurative, Surreal, Conceptual

## Tech Stack

- [React 19](https://react.dev)
- [Vite 8](https://vitejs.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript 5.7](https://www.typescriptlang.org)
- [pnpm](https://pnpm.io)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Clone the repo
git clone https://github.com/shahddismail/forma-gallery.git
cd forma-gallery

# Install dependencies
pnpm install or npm install

# Start the dev server
pnpm dev or npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
pnpm build
pnpm preview
```

## Project Structure

```
forma-gallery/
├── src/
│   ├── App.tsx        # All screens and components
│   ├── index.css      # Global styles, Tailwind v4 import, CSS animations
│   └── main.tsx       # React entrypoint
├── index.html
├── vite.config.ts               # Figma Make config (replace with standalone)
├── vite.config.standalone.ts    # Clean config for local/GitHub use
├── tsconfig.json
└── package.json
```

## Screens

| Screen | How to reach |
|---|---|
| Gallery | Default — loads on open |
| Artwork Detail | Click any artwork card |
| Submit Artwork | "Submit" link in nav |
| Saved Collection | Heart icon in nav |

## Customisation

**Artworks** — Edit the `ARTWORKS` array at the top of `src/App.tsx`. Each entry takes a title, artist, year, medium, dimensions, category, description, price, and an Unsplash photo ID.

**Colors** — Edit the `@theme` block in `src/index.css`. The key tokens are `--color-canvas` (background), `--color-accent` (gold), and `--color-text`.

**Fonts** — Swap the Google Fonts `@import` at the top of `src/index.css`. Update the `font-family` references in the `@theme` block.

## License

MIT
