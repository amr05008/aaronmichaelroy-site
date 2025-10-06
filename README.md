# Aaron Michael Roy - Personal Blog

Modern, fast static site built with Astro and Tailwind CSS. Migrated from WordPress.

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
│   ├── favicon.svg      # Custom branded favicon
│   └── robots.txt       # Search engine directives
├── scripts/
│   ├── migrate-wordpress.js        # WordPress XML to Markdown migration
│   └── update-yoast-descriptions.js # Extract Yoast SEO descriptions
├── src/
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

- **Meta descriptions**: All 29 posts have handcrafted SEO descriptions
- **Canonical URLs**: Match WordPress structure (`/{slug}`) for SEO preservation
- **Open Graph & Twitter Cards**: Complete social sharing metadata
- **Structured data**: JSON-LD BlogPosting schema on all posts
- **Sitemap**: Auto-generated at `/sitemap-index.xml` via @astrojs/sitemap
- **robots.txt**: Configured with sitemap reference
- **Custom favicon**: Branded icon in `public/favicon.svg`

## Homepage Highlights

The homepage features a curated "Highlights" section instead of recent posts. To update:

1. Edit `src/data/highlights.ts`
2. Update the array of post slugs in your preferred order
3. Changes hot-reload automatically in dev mode

## Deployment Status

### ✅ Completed (75% Ready)
- [x] All 29 WordPress posts migrated to Markdown
- [x] 54+ images migrated to `public/images/`
- [x] URL structure matches WordPress exactly (`/{slug}`)
- [x] SEO descriptions on all 29 posts (100% coverage)
- [x] Custom branded favicon installed
- [x] Sitemap and robots.txt configured
- [x] About page with bio and contact links
- [x] Production build tested (32 pages, 1.14s build time)
- [x] Highlights feature for homepage curation

### 🔲 Critical Pre-Launch Tasks

Before pointing DNS to Vercel:

1. **Create custom 404 page** (`src/pages/404.astro`)
2. **Install analytics** (Google Analytics, Plausible, or Fathom)
3. **Test all 29 blog URLs** in production preview environment
4. **Mobile testing** on actual devices (phone, tablet)

### 🚀 Deployment Steps

5. Deploy to Vercel staging environment
6. Configure custom domain (`aaronmichaelroy.com`) in Vercel
7. Update DNS records to point to Vercel
8. Verify SSL certificate provisioning
9. Monitor first 24-48 hours for 404s and issues

### 📈 Post-Launch Optimization

10. Submit sitemap to Google Search Console
11. Create default OG image for social sharing (`/public/og-image.png`)
12. Run Lighthouse audit for performance baseline
13. Consider adding RSS feed with `@astrojs/rss`
14. Image optimization (WebP format, compression)
15. Set up error tracking (Sentry or similar)

## License

© 2025 Aaron Michael Roy. All rights reserved.
