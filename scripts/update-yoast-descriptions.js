import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sanitizeSlug(slug) {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function extractYoastDescriptions(xmlFilePath) {
  const xmlContent = fs.readFileSync(xmlFilePath, 'utf8');
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlContent);

  const items = result.rss.channel[0].item || [];
  const descriptions = new Map();

  for (const item of items) {
    // Only process published posts
    const postType = item['wp:post_type']?.[0];
    const status = item['wp:status']?.[0];

    if (postType !== 'post' || status !== 'publish') {
      continue;
    }

    const slug = sanitizeSlug(item['wp:post_name']?.[0] || '');

    // Extract Yoast meta description from postmeta
    const postmeta = item['wp:postmeta'] || [];
    let yoastDescription = null;

    for (const meta of postmeta) {
      const key = meta['wp:meta_key']?.[0];
      if (key === '_yoast_wpseo_metadesc') {
        yoastDescription = meta['wp:meta_value']?.[0];
        break;
      }
    }

    if (yoastDescription && slug) {
      descriptions.set(slug, yoastDescription);
    }
  }

  return descriptions;
}

function updateMarkdownFrontmatter(filePath, newDescription) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Match frontmatter block
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    console.warn(`No frontmatter found in ${filePath}`);
    return false;
  }

  const frontmatter = match[1];

  // Replace description line
  const descriptionRegex = /^description:\s*"([^"]*)"/m;
  const newFrontmatter = frontmatter.replace(
    descriptionRegex,
    `description: "${newDescription.replace(/"/g, '\\"')}"`
  );

  // Replace the frontmatter in the content
  const newContent = content.replace(frontmatterRegex, `---\n${newFrontmatter}\n---`);

  fs.writeFileSync(filePath, newContent);
  return true;
}

async function updateAllPosts() {
  const xmlPath = process.argv[2];

  if (!xmlPath) {
    console.error('Usage: node update-yoast-descriptions.js <path-to-wordpress-export.xml>');
    process.exit(1);
  }

  if (!fs.existsSync(xmlPath)) {
    console.error(`File not found: ${xmlPath}`);
    process.exit(1);
  }

  console.log('Extracting Yoast meta descriptions from WordPress XML...\n');

  try {
    const descriptions = await extractYoastDescriptions(xmlPath);
    console.log(`Found ${descriptions.size} posts with Yoast meta descriptions\n`);

    const blogDir = path.join(__dirname, '../src/content/blog');
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const file of files) {
      const slug = file.replace('.md', '');
      const yoastDesc = descriptions.get(slug);

      if (yoastDesc) {
        const filePath = path.join(blogDir, file);
        const success = updateMarkdownFrontmatter(filePath, yoastDesc);

        if (success) {
          console.log(`✓ Updated: ${slug}`);
          updatedCount++;
        }
      } else {
        console.log(`⚠ No Yoast description found for: ${slug}`);
        notFoundCount++;
      }
    }

    console.log(`\n✅ Update complete!`);
    console.log(`Updated: ${updatedCount} posts`);
    console.log(`Not found: ${notFoundCount} posts`);

  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

updateAllPosts();
