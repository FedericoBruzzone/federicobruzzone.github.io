#!/usr/bin/env node
// Generates feed.xml (RSS 2.0) from the hand-authored HTML pages.
//
// Sources of truth (each entry carries a machine-readable data-date="YYYY-MM-DD"):
//   - post.html              -> blog posts                  (category: Post)
//   - index.html             -> publications and preprints  (category: Publication / Preprint)
//   - activities/index.html  -> activities and talks        (category: Activity / Presentation)
//
// Run from the repo root: `node scripts/gen-feed.js`. No dependencies.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://federicobruzzone.github.io';
const OUT = path.join(ROOT, 'feed.xml');

// ---- helpers ---------------------------------------------------------------

function read(rel) {
    return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function decodeEntities(s) {
    return s
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;|&apos;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&'); // last, so we don't double-decode
}

// Turn an HTML fragment into clean plain text (drop comments, tags, entities).
function toText(html) {
    return decodeEntities(
        html
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/<[^>]+>/g, '')
    ).replace(/\s+/g, ' ').trim();
}

// Keep inline HTML but tidy whitespace; used for <description> (wrapped in CDATA).
function toInnerHtml(html) {
    return html.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim();
}

function escapeXml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function cdata(s) {
    // Guard against an accidental "]]>" inside the payload.
    return '<![CDATA[' + s.replace(/]]>/g, ']]]]><![CDATA[>') + ']]>';
}

function rfc822(iso) {
    return new Date(iso + 'T00:00:00Z').toUTCString();
}

function absUrl(href) {
    if (/^https?:\/\//i.test(href)) return href;        // already absolute (external)
    if (href.startsWith('/')) return SITE + href;        // root-relative
    return SITE + '/' + href.replace(/^\.?\//, '');      // page-relative
}

function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

const items = [];

function addItem({ date, title, link, description, category, section }) {
    if (!date) {
        console.warn(`WARN: skipping "${title}" — missing data-date`);
        return;
    }
    const url = absUrl(link);
    items.push({
        date,
        title,
        link: url,
        description,
        category,
        guid: `tag:federicobruzzone.github.io,${date}:${section}/${slugify(title)}`,
    });
}

// ---- parsers ---------------------------------------------------------------

// post.html and the publication/preprint blocks in index.html share this shape:
//   <div onclick="location.href='URL';" data-date="DATE" ...>
//     <article class="CLASSES"> ... <div class="post-title">..</div>
//                                    <div class="post-desc">..</div> ... </article>
//   </div>
// Only blocks that carry data-date are matched, so index.html's pinned posts
// (which duplicate post.html and have no data-date) are skipped automatically.
function parsePostBlocks(html, classify, section) {
    const block = /<div onclick="location\.href='([^']+)';"\s+data-date="([^"]+)"[^>]*>\s*<article class="([^"]*)">([\s\S]*?)<\/article>/g;
    let m;
    while ((m = block.exec(html)) !== null) {
        const [, link, date, classes, inner] = m;
        const titleM = inner.match(/<div class="post-title">([\s\S]*?)<\/div>/);
        const descM = inner.match(/<div class="post-desc">([\s\S]*?)<\/div>/);
        if (!titleM) continue;
        addItem({
            date,
            title: toText(titleM[1]),
            link,
            description: descM ? toInnerHtml(descM[1]) : '',
            category: classify(classes),
            section,
        });
    }
}

// activities/index.html:
//   <div class="entry" data-date="DATE">
//     <span class="title"><a href="URL">TITLE</a></span>
//     <p class="summary">SUMMARY</p>
//   </div>
function parseActivities(html) {
    const split = html.indexOf('<h1>Presentations</h1>');
    const sections = split === -1
        ? [['Activity', html]]
        : [['Activity', html.slice(0, split)], ['Presentation', html.slice(split)]];

    const entry = /<div class="entry" data-date="([^"]+)">([\s\S]*?)<\/div>/g;
    for (const [category, chunk] of sections) {
        let m;
        while ((m = entry.exec(chunk)) !== null) {
            const [, date, inner] = m;
            const titleM = inner.match(/<span class="title">([\s\S]*?)<\/span>/);
            const summaryM = inner.match(/<p class="summary">([\s\S]*?)<\/p>/);
            if (!titleM) continue;
            const linkM = titleM[1].match(/<a[^>]+href="([^"]+)"/);
            addItem({
                date,
                title: toText(titleM[1]),
                link: linkM ? linkM[1] : '/activities/index.html',
                description: summaryM ? toInnerHtml(summaryM[1]) : '',
                category,
                section: 'activities',
            });
        }
    }
}

// ---- build -----------------------------------------------------------------

parsePostBlocks(read('post.html'), () => 'Post', 'posts');
parsePostBlocks(read('index.html'), (classes) =>
    /preprint-post-theme/.test(classes) ? 'Preprint' : 'Publication', 'publications');
parseActivities(read('activities/index.html'));

// Newest first; stable sort preserves the authored order within an equal date.
items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

const now = new Date().toUTCString();
const xmlItems = items.map((it) => `    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${escapeXml(it.link)}</link>
      <guid isPermaLink="false">${escapeXml(it.guid)}</guid>
      <category>${escapeXml(it.category)}</category>
      <pubDate>${rfc822(it.date)}</pubDate>
      <description>${cdata(it.description)}</description>
    </item>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Federico Bruzzone</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Posts, scientific publications, preprints, and activities by Federico Bruzzone.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
${xmlItems}
  </channel>
</rss>
`;

fs.writeFileSync(OUT, xml);
console.log(`Wrote ${path.relative(ROOT, OUT)} with ${items.length} items.`);
