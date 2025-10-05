# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog for Aaron Michael Roy, built with Astro and migrated from WordPress. The site is a static blog with clean design, SEO optimization, and Markdown-based content management.

## Tech Stack

- **Astro 5.x** - Static site generator with TypeScript support
- **Tailwind CSS** - Utility-first styling with typography plugin
- **MDX** - Markdown with JSX capabilities for blog posts
- **Content Collections** - Type-safe content management via `src/content/config.ts`

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture & Routing

### URL Structure
- Homepage: `/` (index.astro)
- Writing archive: `/writing` (writing.astro)
- Individual posts: `/{slug}` ([...slug].astro) - matches WordPress structure
- About page: `/about` (about.astro)

### Content Collections
Blog posts live in `src/content/blog/` as `.md` or `.mdx` files. Schema defined in `src/content/config.ts`:
- Required: `title`, `description`, `pubDate`
- Optional: `updatedDate`, `categories`, `heroImage`

Posts are rendered via the catch-all route `[...slug].astro` which uses the `BlogPost` layout.

### Layouts
- `BaseLayout.astro` - Base HTML structure, SEO meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- `BlogPost.astro` - Blog post template with reading time calculation

## WordPress Migration

The site was migrated from WordPress using `scripts/migrate-wordpress.js`. To migrate content:

```bash
node scripts/migrate-wordpress.js /path/to/wordpress-export.xml
```

The script:
- Parses WordPress XML exports
- Converts HTML to Markdown using Turndown
- Downloads images to `public/images/` with slug-based naming
- Creates frontmatter with title, description, pubDate, categories
- Preserves URL slugs for SEO continuity

Post-migration: Review generated markdown in `src/content/blog/`, verify images in `public/images/`, and test URL mappings.

## Configuration

- **Site URL**: Set in `astro.config.mjs` as `site: 'https://aaronmichaelroy.com'`
- **Syntax highlighting**: Uses `github-dark` theme (configured in `astro.config.mjs`)
- **Integrations**: MDX, Sitemap, Tailwind CSS

## Deployment

Optimized for Vercel:
- Build command: `npm run build`
- Output directory: `dist`
- Astro auto-detected by Vercel

SSL and DNS configured for custom domain (aaronmichaelroy.com).
