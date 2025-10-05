import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';
import TurndownService from 'turndown';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Custom rules for better WordPress conversion
turndownService.addRule('removeStyles', {
  filter: ['style', 'script'],
  replacement: () => '',
});

turndownService.addRule('cleanImages', {
  filter: 'img',
  replacement: (content, node) => {
    const alt = node.getAttribute('alt') || '';
    const src = node.getAttribute('src') || '';
    return `![${alt}](${src})`;
  },
});

async function downloadImage(url, filename) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imagesDir = path.join(__dirname, '../public/images');

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filepath = path.join(imagesDir, filename);
    fs.writeFileSync(filepath, response.data);
    console.log(`Downloaded: ${filename}`);
    return `/images/${filename}`;
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
    return url; // Return original URL if download fails
  }
}

function sanitizeSlug(slug) {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function processImages(content, postSlug) {
  const dom = new JSDOM(content);
  const images = dom.window.document.querySelectorAll('img');

  let processedContent = content;

  for (const img of images) {
    const src = img.getAttribute('src');
    if (src && src.startsWith('http')) {
      const extension = path.extname(new URL(src).pathname) || '.jpg';
      const filename = `${postSlug}-${Date.now()}${extension}`;
      const newPath = await downloadImage(src, filename);
      processedContent = processedContent.replace(src, newPath);
    }
  }

  return processedContent;
}

async function parseWordPressXML(xmlFilePath) {
  const xmlContent = fs.readFileSync(xmlFilePath, 'utf8');
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlContent);

  const items = result.rss.channel[0].item || [];
  const posts = [];

  for (const item of items) {
    // Only process published posts (not pages, drafts, etc.)
    const postType = item['wp:post_type']?.[0];
    const status = item['wp:status']?.[0];

    if (postType !== 'post' || status !== 'publish') {
      continue;
    }

    const title = item.title?.[0] || 'Untitled';
    const slug = sanitizeSlug(item['wp:post_name']?.[0] || title);
    const pubDate = new Date(item.pubDate?.[0]);
    const content = item['content:encoded']?.[0] || '';
    const description = item.description?.[0] || '';

    // Process images
    const processedContent = await processImages(content, slug);

    // Convert HTML to Markdown
    const markdown = turndownService.turndown(processedContent);

    // Extract categories
    const categories = item.category
      ? item.category.filter(cat => cat.$.domain === 'category').map(cat => cat._)
      : [];

    posts.push({
      title,
      slug,
      date: pubDate.toISOString().split('T')[0],
      description: description || markdown.substring(0, 160).replace(/\n/g, ' '),
      categories,
      content: markdown,
    });
  }

  return posts;
}

async function createMarkdownFiles(posts) {
  const blogDir = path.join(__dirname, '../src/content/blog');

  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  for (const post of posts) {
    const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
description: "${post.description.replace(/"/g, '\\"')}"
pubDate: ${post.date}
${post.categories.length > 0 ? `categories: [${post.categories.map(c => `"${c}"`).join(', ')}]` : ''}
---

${post.content}`;

    const filename = `${post.slug}.md`;
    const filepath = path.join(blogDir, filename);

    fs.writeFileSync(filepath, frontmatter);
    console.log(`Created: ${filename}`);
  }
}

async function migrate() {
  const xmlPath = process.argv[2];

  if (!xmlPath) {
    console.error('Usage: node migrate-wordpress.js <path-to-wordpress-export.xml>');
    process.exit(1);
  }

  if (!fs.existsSync(xmlPath)) {
    console.error(`File not found: ${xmlPath}`);
    process.exit(1);
  }

  console.log('Starting WordPress migration...');
  console.log(`Reading XML from: ${xmlPath}\n`);

  try {
    const posts = await parseWordPressXML(xmlPath);
    console.log(`\nFound ${posts.length} published posts\n`);

    await createMarkdownFiles(posts);

    console.log('\n✅ Migration complete!');
    console.log(`Created ${posts.length} markdown files in src/content/blog/`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
