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
│   └── images/          # Blog post images
├── scripts/
│   └── migrate-wordpress.js  # Migration script
├── src/
│   ├── content/
│   │   ├── blog/        # Blog posts (markdown/mdx)
│   │   └── config.ts    # Content collections config
│   ├── layouts/
│   │   ├── BaseLayout.astro   # Base HTML structure
│   │   └── BlogPost.astro     # Blog post template
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── about.astro        # About page
│   │   └── blog/
│   │       ├── index.astro    # Blog listing
│   │       └── [...slug].astro # Individual posts
│   └── styles/
│       └── global.css         # Tailwind imports
├── astro.config.mjs     # Astro configuration
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
- Blog listing: `/blog`
- Individual posts: `/blog/post-slug`
- About page: `/about`

URLs are automatically generated from the markdown filename/slug to preserve WordPress URLs.

## License

© 2025 Aaron Michael Roy. All rights reserved.
