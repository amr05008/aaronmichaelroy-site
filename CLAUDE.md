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
- `BaseLayout.astro` - Base HTML structure, SEO meta tags, Open Graph, Twitter Cards
- `BlogPost.astro` - Blog post template with reading time calculation and JSON-LD structured data

### Homepage Features

The homepage (`src/pages/index.astro`) displays a curated "Highlights" section instead of recent posts. To manage which posts appear:

1. Edit `src/data/highlights.ts`
2. Update the array of post slugs in desired display order
3. Changes hot-reload automatically in dev mode

This approach provides explicit control over featured content without requiring redeployment-heavy frontmatter flags.

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

### Updating Yoast SEO Descriptions

To update blog post descriptions with Yoast SEO meta descriptions from WordPress XML:

```bash
node scripts/update-yoast-descriptions.js /path/to/wordpress-export.xml
```

This script extracts `_yoast_wpseo_metadesc` values from WordPress postmeta and updates the `description` field in blog post frontmatter. Hand-crafted Yoast descriptions are more SEO-optimized than auto-generated excerpts.

## Configuration

- **Site URL**: Set in `astro.config.mjs` as `site: 'https://aaronmichaelroy.com'`
- **Syntax highlighting**: Uses `github-dark` theme (configured in `astro.config.mjs`)
- **Integrations**: MDX, Sitemap, Tailwind CSS

## SEO Optimizations

The site includes comprehensive SEO features:

- **Meta descriptions**: 23/29 posts use hand-crafted Yoast SEO descriptions; 6 posts use auto-generated excerpts
- **Canonical URLs**: Set on all pages to match WordPress URL structure (/{slug})
- **Open Graph tags**: Complete OG and Twitter Card metadata in BaseLayout
- **Structured data**: JSON-LD BlogPosting schema on all blog posts
- **Sitemap**: Auto-generated via @astrojs/sitemap integration
- **robots.txt**: Located in `public/robots.txt` with sitemap reference
- **Homepage meta**: Custom description set in index.astro (not using generic fallback)

### SEO Notes

- OG images are optional (no default image to avoid 404s)
- Hero images not currently used (field exists but posts have no images)
- Consider adding author social profiles to structured data for enhanced rich results

## Deployment

Optimized for Vercel:
- Build command: `npm run build`
- Output directory: `dist`
- Astro auto-detected by Vercel

SSL and DNS configured for custom domain (aaronmichaelroy.com).

## Session History

### 2025-10-05: SEO Optimization & Highlights Feature

**Changes made:**
- Replaced "Recent Posts" with "Highlights" section on homepage
- Created `src/data/highlights.ts` for curated post selection
- Built `scripts/update-yoast-descriptions.js` to extract Yoast meta descriptions
- Updated 23 blog posts with hand-crafted SEO descriptions from WordPress
- Added `public/robots.txt` with sitemap reference
- Fixed broken OG image references (made optional instead of 404)
- Updated homepage meta description from generic to specific

**Technical decisions:**
- **Highlights config file approach**: Chose centralized slug array over frontmatter flags for easier curation and explicit ordering
- **Yoast extraction**: Parsed WordPress XML postmeta to recover superior SEO descriptions that weren't captured in initial migration
- **Optional OG images**: Removed default image reference to avoid 404s; will add proper OG images in future design phase
- **Location update**: Changed from "Bay Area" to "Brooklyn" across site

**Issues encountered:**
- Initial migration used generic descriptions instead of Yoast meta descriptions
- Homepage had generic meta description ("Product manager, writer, and tech enthusiast")
- Missing robots.txt would have impacted crawlability
- Broken OG image reference would have caused validation warnings

**Outcomes:**
- 23 posts now have optimized SEO descriptions (79% coverage)
- Homepage has specific, location-accurate meta description
- Site is crawler-ready with proper robots.txt
- Highlights feature allows dynamic content curation without code changes
- All SEO essentials in place for production deployment
