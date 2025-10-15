# Aaron Roy - Personal Blog

Modern, fast static site built with Astro and Tailwind CSS. Migrated from WordPress and live at [aaronroy.com](https://aaronroy.com).

## Tech Stack

- **Astro** - Static site generator
- **Tailwind CSS** - Styling
- **MDX** - Markdown with JSX support
- **TypeScript** - Type safety

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Migrating from WordPress

### Prerequisites

1. Export your WordPress content:
   - Go to WordPress Admin → Tools → Export
   - Select "All content"
   - Download the XML file

### Run Migration Script

```bash
node scripts/migrate-wordpress.js /path/to/wordpress-export.xml
```

This script will:
- Parse the WordPress XML export
- Convert HTML content to Markdown
- Extract frontmatter (title, date, description, categories)
- Download and save images to `/public/images/`
- Update image paths in the content
- Create `.md` files in `/src/content/blog/`
- Preserve URL slugs for SEO

### Post-Migration Steps

1. Review generated markdown files in `src/content/blog/`
2. Check image downloads in `public/images/`
3. Verify frontmatter is correct
4. Test all post URLs to ensure they match WordPress URLs
5. Update any hardcoded links or references

## Project Structure

```
/
├── public/               # Static assets
│   ├── images/          # Blog post images (54+ images)
│   │   └── og-default.png  # Default Open Graph image for social sharing
│   ├── og-images/       # Custom OG images for individual posts
│   ├── favicon.svg      # Custom branded favicon
│   └── robots.txt       # Search engine directives
├── scripts/
│   ├── migrate-wordpress.js        # WordPress XML to Markdown migration
│   └── update-yoast-descriptions.js # Extract Yoast SEO descriptions
├── src/
│   ├── config.ts        # Centralized site metadata (title, author, social profiles)
│   ├── content/
│   │   ├── blog/        # Blog posts (29 markdown files)
│   │   └── config.ts    # Content collections schema
│   ├── data/
│   │   └── highlights.ts # Homepage featured posts configuration
│   ├── layouts/
│   │   ├── BaseLayout.astro   # Base HTML, SEO, Open Graph
│   │   └── BlogPost.astro     # Blog template with JSON-LD
│   ├── pages/
│   │   ├── index.astro        # Homepage with Highlights
│   │   ├── about.astro        # About page
│   │   ├── writing.astro      # Blog archive
│   │   ├── 404.astro          # Custom branded 404 page
│   │   └── [...slug].astro    # Dynamic blog post routes
│   └── styles/
│       └── global.css         # Tailwind imports
├── astro.config.mjs     # Astro config (site URL, integrations)
├── CLAUDE.md           # Project documentation for AI assistance
└── package.json
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Vercel auto-detects Astro and configures build settings
4. Deploy!

Build command: `npm run build`
Output directory: `dist`

### Custom Domain

1. Add your domain in Vercel dashboard
2. Update DNS records as instructed
3. SSL certificate will be automatically provisioned

## Content Management

### Adding New Posts

Create a new `.md` or `.mdx` file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "Brief description for SEO"
pubDate: 2025-01-15
categories: ["Product Management", "Startups"]
---

Your content here...
```

### Updating Existing Posts

Edit the markdown file directly. Add `updatedDate` to frontmatter if needed:

```yaml
updatedDate: 2025-01-20
```

## URL Structure

- Homepage: `/`
- Writing archive: `/writing`
- Individual posts: `/post-slug` (matches WordPress structure)
- About page: `/about`

URLs are automatically generated from the markdown filename/slug to preserve WordPress URLs.

## SEO Features

- **Meta descriptions**: All 29 posts have handcrafted SEO descriptions (100% coverage)
- **Canonical URLs**: Match WordPress structure (`/{slug}`) for SEO preservation
- **Open Graph & Twitter Cards**: Complete social sharing metadata with hybrid OG image system
- **OG Images**: Default fallback at `/images/og-default.png` + custom per-post images via `heroImage` frontmatter
- **Structured data**: JSON-LD BlogPosting schema with enhanced author metadata (includes social profiles)
- **Centralized config**: Site metadata managed in `src/config.ts` (title, author, Twitter/LinkedIn/GitHub profiles)
- **Sitemap**: Auto-generated at `/sitemap-index.xml` via @astrojs/sitemap
- **robots.txt**: Configured with sitemap reference
- **Custom favicon**: Branded icon in `public/favicon.svg`
- **Analytics**: Vercel Analytics installed (privacy-friendly, no cookie consent needed)

## Homepage Highlights

The homepage features a curated "Highlights" section instead of recent posts. To update:

1. Edit `src/data/highlights.ts`
2. Update the array of post slugs in your preferred order
3. Changes hot-reload automatically in dev mode

## Production Deployment

### 🎉 LIVE IN PRODUCTION

**Site URL**: [https://aaronroy.com](https://aaronroy.com)
**Preview/Staging**: [https://aaronroy-com.vercel.app](https://aaronroy-com.vercel.app)
**Deployed**: October 6, 2025

### ✅ Completed Features

**Content Migration:**
- [x] All 29 WordPress posts migrated to Markdown
- [x] 54+ images migrated to `public/images/`
- [x] URL structure matches WordPress exactly (`/{slug}`)
- [x] SEO descriptions on all 29 posts (100% coverage)
- [x] Highlights feature for homepage curation

**SEO & Analytics:**
- [x] Custom branded favicon installed
- [x] Sitemap and robots.txt configured
- [x] Vercel Analytics installed
- [x] Custom 404 page created
- [x] Hybrid OG image system (default + custom per-post)
- [x] Enhanced JSON-LD structured data with author social profiles
- [x] Centralized site configuration (`src/config.ts`)

**Deployment:**
- [x] Deployed to Vercel with SSL
- [x] Custom domain configured (aaronroy.com + www)
- [x] DNS cutover complete
- [x] Production build tested (33 pages, ~1.2s build time)

### 🔄 Domain Migration

**Old domain**: [aaronmichaelroy.com](https://aaronmichaelroy.com) (active through 2029)
**301 Redirects**: All URLs from old domain redirect to aaronroy.com
**Google Search Console**: Change of Address submitted October 6, 2025

The old domain will remain active with permanent 301 redirects to preserve SEO value from backlinks and catch long-tail traffic.

### 📈 Future Enhancements

- [ ] Submit sitemap to Google Search Console
- [ ] Run Lighthouse audit for performance baseline
- [ ] Consider adding RSS feed with `@astrojs/rss`
- [ ] Image optimization (WebP format, compression)
- [ ] Set up error tracking (Sentry or similar)
- [ ] Mobile responsive testing on additional devices

## License

© 2025 Aaron Michael Roy. All rights reserved.
