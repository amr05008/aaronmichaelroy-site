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

- **Site URL**: Set in `astro.config.mjs` as `site: 'https://aaronroy.com'`
- **Syntax highlighting**: Uses `github-dark` theme (configured in `astro.config.mjs`)
- **Integrations**: MDX, Sitemap, Tailwind CSS

## SEO Optimizations

The site includes comprehensive SEO features:

- **Meta descriptions**: All 29 posts have handcrafted SEO descriptions
- **Canonical URLs**: Set on all pages to match WordPress URL structure (/{slug})
- **Open Graph tags**: Complete OG and Twitter Card metadata in BaseLayout
- **Structured data**: JSON-LD BlogPosting schema on all blog posts
- **Sitemap**: Auto-generated via @astrojs/sitemap integration
- **robots.txt**: Located in `public/robots.txt` with sitemap reference
- **Homepage meta**: Custom description set in index.astro (not using generic fallback)

### SEO Notes

- **Favicon**: Custom branded favicon installed in `public/favicon.svg`
- OG images are optional (no default image to avoid 404s)
- Hero images not currently used (field exists but posts have no images)
- Consider adding author social profiles to structured data for enhanced rich results

## Deployment

Optimized for Vercel:
- Build command: `npm run build`
- Output directory: `dist`
- Astro auto-detected by Vercel

SSL and DNS configured for custom domain (aaronroy.com).

## Session History

### 2025-10-06: Production Deployment - 404 Page, Analytics & DNS Cutover

**What we built/modified:**
- Created custom branded 404 error page at `src/pages/404.astro`
- Installed and integrated Vercel Analytics (`@vercel/analytics`)
- Verified domain change from aaronmichaelroy.com to aaronroy.com in production build
- Deployed to Vercel with auto-detected Astro configuration
- Connected custom domains (aaronroy.com and www.aaronroy.com) in Vercel
- Enabled Vercel Web Analytics in dashboard

**Technical decisions:**
- **404 page design**: Created minimal, branded error page with CTAs to /writing and homepage, using consistent Tailwind styling from existing pages
- **Analytics choice**: Chose Vercel Analytics over Google Analytics for privacy-friendly tracking (no cookie consent needed), seamless Vercel integration, and built-in Core Web Vitals monitoring
- **Analytics implementation**: Used official `@vercel/analytics/astro` component in BaseLayout for site-wide tracking without additional configuration
- **Domain setup**: Added both apex domain (aaronroy.com) and www subdomain with automatic SSL certificate provisioning
- **Meta tags**: Set 404 page title as "Page Not Found | Aaron Roy" (not "Aaron Michael Roy") for consistency with new domain

**Issues encountered:**
- **None** - Deployment went smoothly with all systems working as expected

**Verification completed:**
- ✅ Production build successful (33 pages including new 404)
- ✅ Sitemap verified: All 32 URLs use `https://aaronroy.com` (0 references to old domain)
- ✅ Canonical URLs confirmed on all pages
- ✅ Open Graph and Twitter Card meta tags use new domain
- ✅ Custom 404 page displays correctly with proper HTTP 404 status
- ✅ Vercel Analytics script injected on all pages
- ✅ Preview site live at https://aaronroy-com.vercel.app/
- ✅ SSL certificates generating for custom domains

**Deployment status:**
- **Preview URL**: https://aaronroy-com.vercel.app/ (live and tested)
- **Custom domains**: aaronroy.com and www.aaronroy.com (SSL provisioning in progress)
- **Analytics**: Enabled in Vercel dashboard, ready to track once DNS propagates
- **DNS**: Configured at domain registrar, awaiting propagation (1-48 hours)

**Updated launch checklist:**

**🎉 COMPLETED:**
1. ✅ Custom 404 page created and deployed
2. ✅ Vercel Analytics installed and enabled
3. ✅ URL validation testing - all 29 blog posts verified with correct URLs
4. ✅ Deployed to Vercel production
5. ✅ Custom domains added in Vercel
6. ✅ DNS records configured (awaiting propagation)
7. ✅ SSL certificates provisioning

**⏳ IN PROGRESS:**
1. **DNS propagation** - Waiting for DNS to resolve (1-48 hours, typically 15 minutes)
2. **SSL certificate generation** - Vercel provisioning certificates for both domains

**🚨 REMAINING BLOCKERS (Before announcing launch):**
1. **Mobile responsive testing** - Effort: 20 min - Priority: HIGH
   - Test https://aaronroy.com on iPhone (Safari)
   - Test on Android (Chrome)
   - Verify navigation, images, and typography render correctly on mobile devices

**Total remaining blocker effort: 20 minutes**

**🎨 NICE-TO-HAVES (Post-launch optimization):**
1. Submit sitemap to Google Search Console - Effort: 10 min
2. Create default OG image (1200x630px) - Effort: 30 min
3. Run Lighthouse audit for performance baseline - Effort: 15 min
4. Add RSS feed with @astrojs/rss - Effort: 45 min
5. Image optimization (WebP conversion) - Effort: 60 min
6. Set up error tracking (Sentry) - Effort: 30 min

**Priority order for next session:**
1. Wait for DNS propagation and SSL certificate completion
2. Mobile responsive testing on real devices
3. Monitor analytics for first 24-48 hours
4. Submit sitemap to Google Search Console
5. Run Lighthouse audit

**Outcomes:**
- Site is 95% live - only waiting on DNS propagation
- All critical pre-launch tasks completed (404, analytics, deployment, DNS)
- Preview URL fully functional and tested
- Custom domains configured with SSL certificates provisioning
- Analytics ready to track traffic once DNS resolves
- Only remaining blocker is mobile testing before public announcement
- **SITE READY FOR LAUNCH** once SSL certificates complete

### 2025-10-05: Documentation Sync & Launch Readiness Review

**What we built/modified:**
- Updated CLAUDE.md to reflect completion of favicon and SEO descriptions (both done manually)
- Updated README.md with current project structure and 75% deployment readiness status
- Added SEO Features section to README documenting all completed optimizations
- Added Homepage Highlights section explaining curation feature
- Reorganized deployment checklist into Critical/Deployment/Post-Launch categories
- Committed documentation updates with detailed commit messages
- Created prioritized launch checklist with effort estimates

**Technical decisions:**
- **Documentation consolidation**: Chose to maintain deployment status in both CLAUDE.md (detailed session history) and README.md (user-facing quick reference)
- **Checklist organization**: Separated tasks by blocker status (Critical vs Nice-to-Have) to clarify launch dependencies
- **Effort estimation**: Added time estimates to help prioritize remaining work
- **Project structure accuracy**: Updated file tree to match actual implementation (highlights.ts, Yoast script, favicon, robots.txt)

**Issues encountered:**
- **Git credentials**: Push failed due to missing git credentials - requires manual `git push origin main`
- **Todo list staleness**: Initial todo included already-completed items (favicon, SEO), required cleanup

**Updated launch checklist for aaronroy.com:**

**🚨 BLOCKERS (Must complete before DNS cutover):**
1. **Create custom 404 page** - Effort: 20 min - Priority: HIGH
   - Create `src/pages/404.astro` with branded error page
   - Test 404 behavior in production build

2. **Install analytics** - Effort: 15 min - Priority: HIGH
   - Choose provider (Google Analytics, Plausible, or Fathom)
   - Add tracking code to BaseLayout.astro
   - Verify tracking in preview environment

3. **URL validation testing** - Effort: 30 min - Priority: HIGH
   - Deploy to Vercel preview
   - Test all 29 blog post URLs match WordPress
   - Verify /about, /writing, and homepage load correctly

4. **Mobile responsive testing** - Effort: 20 min - Priority: HIGH
   - Test on iPhone (Safari)
   - Test on Android (Chrome)
   - Verify navigation, images, and typography render correctly

**Total blocker effort: ~85 minutes (1.5 hours)**

**✅ DEPLOYMENT STEPS (Sequential after blockers complete):**
5. Deploy to Vercel production - Effort: 10 min
6. Configure custom domain in Vercel dashboard - Effort: 5 min
7. Update DNS A/CNAME records - Effort: 5 min + 1-48hr propagation
8. Verify SSL certificate - Effort: 5 min
9. Monitor 24-48 hours post-launch - Effort: Ongoing

**🎨 NICE-TO-HAVES (Post-launch optimization):**
10. Submit sitemap to Google Search Console - Effort: 10 min
11. Create default OG image (1200x630px) - Effort: 30 min
12. Run Lighthouse audit - Effort: 15 min
13. Add RSS feed with @astrojs/rss - Effort: 45 min
14. Image optimization (WebP conversion) - Effort: 60 min
15. Set up error tracking (Sentry) - Effort: 30 min

**Priority order for next session:**
1. 404 page (highest ROI, prevents bad UX)
2. Analytics (critical for measuring success)
3. Deploy to Vercel preview + URL testing (validates WordPress parity)
4. Mobile testing (last blocker before launch)
5. DNS cutover (go live!)

**Outcomes:**
- Documentation now accurately reflects current state (favicon ✓, SEO ✓)
- Clear separation between blockers (85 min) and nice-to-haves
- Launch path reduced to 4 critical tasks before DNS cutover
- README updated to serve as quick-reference deployment guide
- All changes committed and ready to push

### 2025-10-05: Pre-Deployment Audit & Documentation

**What we built/modified:**
- Conducted comprehensive pre-deployment audit of Astro site vs current WordPress site
- Verified production build process (32 pages generated successfully)
- Confirmed sitemap generation (`sitemap-index.xml` and `sitemap-0.xml`)
- Validated SEO infrastructure (canonical URLs, meta tags, Open Graph, JSON-LD structured data)
- Verified all 29 blog posts migrated with correct URL structure matching WordPress (`/{slug}`)
- Confirmed all 54+ images migrated to `public/images/`
- Manually installed custom branded favicon in `public/favicon.svg`
- Manually completed SEO descriptions for all 29 blog posts (100% coverage)
- Updated CLAUDE.md documentation to reflect current state

**Technical decisions:**
- **URL preservation strategy**: Verified Astro URLs exactly match WordPress structure to prevent SEO disruption during migration
- **Sitemap compatibility**: Confirmed @astrojs/sitemap generates proper XML that can replace WordPress sitemap plugin
- **Static build validation**: Tested full production build to ensure all dynamic routes (blog posts) generate correctly
- **Favicon placement**: Used `public/favicon.svg` for proper static asset serving in Astro
- **Documentation approach**: Created detailed pre-deployment checklist covering Vercel deployment, DNS cutover, and post-launch monitoring

**Issues encountered:**
- **Build directory confusion**: Initially checked for `dist/` files while in `dist/` directory itself (resolved by returning to project root)
- **Sitemap location**: Sitemap files exist in `dist/` after build (not in project root), which is expected for static site generation
- **WordPress comparison**: Current WordPress site has limited robots.txt (`User-agent: * Crawl-Delay: 20`) vs our more comprehensive setup with sitemap reference

**Deployment readiness assessment:**
- ✅ **Content**: All 29 posts migrated with SEO descriptions
- ✅ **URLs**: Match WordPress exactly for SEO continuity
- ✅ **SEO**: Comprehensive meta tags, sitemaps, robots.txt, structured data
- ✅ **Build**: Production builds working (1.14s, 32 pages)
- ✅ **Favicon**: Custom branded icon installed
- ⚠️ **OG Images**: Optional, none configured (acceptable for MVP)
- ⚠️ **Analytics**: Not yet installed (critical pre-launch task)
- ⚠️ **404 Page**: Using default (should create custom)

**Remaining tasks for production deployment:**

**Critical (must complete before DNS cutover):**
1. Create custom 404 page (`src/pages/404.astro`)
2. Install analytics (Google Analytics, Plausible, or Fathom)
3. Test all 29 blog post URLs in production preview
4. Mobile responsive testing on actual devices

**Deployment steps:**
5. Deploy to Vercel staging environment
6. Configure custom domain (aaronroy.com) in Vercel
7. Update DNS records to point to Vercel
8. Verify SSL certificate provisioning
9. Monitor first 24-48 hours for 404s and issues

**Post-launch optimization:**
10. Submit sitemap to Google Search Console
11. Create default OG image for social sharing
12. Run Lighthouse audit for performance baseline
13. Consider adding RSS feed with @astrojs/rss

**Outcomes:**
- Comprehensive pre-deployment audit completed with 75% readiness score
- Site architecture validated as production-ready
- Clear critical path identified: 4 tasks before DNS cutover
- Documentation updated to reflect manual favicon and SEO completion
- Deployment roadmap created with specific Vercel and DNS migration steps

### 2025-10-05: SEO Optimization & Highlights Feature

**Changes made:**
- Replaced "Recent Posts" with "Highlights" section on homepage
- Created `src/data/highlights.ts` for curated post selection
- Built `scripts/update-yoast-descriptions.js` to extract Yoast meta descriptions
- Updated all 29 blog posts with hand-crafted SEO descriptions from WordPress
- Added `public/robots.txt` with sitemap reference
- Fixed broken OG image references (made optional instead of 404)
- Updated homepage meta description from generic to specific
- Installed custom branded favicon (`public/favicon.svg`)

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
- All 29 posts now have optimized SEO descriptions (100% coverage)
- Homepage has specific, location-accurate meta description
- Site is crawler-ready with proper robots.txt
- Highlights feature allows dynamic content curation without code changes
- Custom favicon installed for brand consistency
- All SEO essentials in place for production deployment
