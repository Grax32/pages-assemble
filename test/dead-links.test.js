// Dead Links Test for _site directory
// Scans all HTML, CSS, JS, and image references for dead links

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const assert = require('assert');

const https = require('https');
const agent = new https.Agent({ keepAlive: false });

const SITE_DIR = path.join(__dirname, '../_site');

const whitelist = [
    'https://www.linkedin.com/in/grax32/',
    'https://www.nytimes.com/2014/01/26/opinion/sunday/what-drives-success.html'
];

async function linkCheck(url) {

    const res = await fetch(url, { method: 'GET', timeout: 10000, agent });
    const status = res.status;

    try {
        const result = await res.text();
    } catch (e) {
        console.error(`Error fetching ${url}:`, e);
    }

    if (!res.ok) {
        return status || 999;
    }
    return "OK";
}

function walk(dir, filelist = []) {
    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath, filelist);
        } else {
            filelist.push(filepath);
        }
    });
    return filelist;
}

function extractLinksFromHtml(html, filePath) {
    const $ = cheerio.load(html);
    const links = [];
    $('a[href], link[href], img[src], script[src]').each((_, el) => {
        const tag = $(el);
        const href = tag.attr('href') || tag.attr('src');
        if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
            links.push({ href, filePath });
        }
    });
    return links;
}

function isLocalLink(link) {
    // Treat protocol-relative URLs (//hostname) as external
    return !/^([a-z]+:)?\/\//i.test(link);
}

describe('Dead Links Test', () => {
    const allFiles = walk(SITE_DIR);
    const htmlFiles = allFiles.filter(f => f.endsWith('.html'));

    let localLinks = [];
    let netLinks = [];

    beforeAll(() => {
        for (const htmlFile of htmlFiles) {
            const html = fs.readFileSync(htmlFile, 'utf8');
            const links = extractLinksFromHtml(html, htmlFile);
            for (const { href, filePath } of links) {
                if (isLocalLink(href)) {
                    if (!localLinks.some(l => l.href === href && l.filePath === filePath)) {
                        localLinks.push({ href, filePath });
                    }
                } else {
                    if (!netLinks.some(l => l.href === href && l.filePath === filePath)) {
                        netLinks.push({ href, filePath });
                    }
                }
            }
        }

        localLinks = localLinks.sort((a, b) => a.href.localeCompare(b.href));
        netLinks = netLinks.sort((a, b) => a.href.localeCompare(b.href));

        const whitelistedNetLinks = netLinks.filter(link => whitelist.includes(link.href));
        if (whitelistedNetLinks.length > 0) {
            console.log(`Whitelisted remote links found:\n${whitelistedNetLinks.map(link => `  ✅ ${link.href} (in ${link.filePath})`).join('\n')}`);
        }

        netLinks = netLinks.filter(link => !whitelist.includes(link.href));
    });

    it('should not have dead local links', () => {
        const deadLinks = [];
        for (const { href, filePath } of localLinks) {
            let resolved = href;
            if (href.startsWith('/')) {
                resolved = path.join(SITE_DIR, href);
            } else {
                resolved = path.join(path.dirname(filePath), href);
            }
            // Remove query/hash
            resolved = resolved.split('?')[0].split('#')[0];
            if (!fs.existsSync(resolved)) {
                deadLinks.push({ href, filePath });
            }
        }

        if (deadLinks.length > 0) {
            const groupByFile = deadLinks.reduce((acc, link) => {
                if (!acc[link.filePath]) {
                    acc[link.filePath] = [];
                }
                acc[link.filePath].push(link);
                return acc;
            }, {});
            const msg = Object.entries(groupByFile).map(([filePath, links]) => {
                return `Dead links in file: ${filePath}\n` + links.map(l => `  - ${l.href}`).join('\n');
            }).join('\n');

            assert.fail(`Dead local links found:\n${msg}`);
        }
    });

    it('should not have dead remote links', async () => {
        const linkCheckPromises = [];

        for (const { href } of netLinks) {
            let url = href;
            if (/^\/\//.test(href)) {
                url = 'https:' + href;
            }

            async function handleLinkCheck(url) {
                try {
                    const linkResult = await linkCheck(url);
                    return {
                        success: linkResult === "OK",
                        status: linkResult === "OK" ? "OK" : linkResult
                    };
                } catch (e) {
                    return { success: false, status: e.message };
                }
            }
            linkCheckPromises.push(handleLinkCheck(url));
        }

        const linkCheckResults = await Promise.all(linkCheckPromises);
        const fullResults = netLinks.map((link, index) => ({
            ...linkCheckResults[index],
            href: link.href,
            filePath: link.filePath
        }));
        const deadRemoteLinks = fullResults.filter(result => !result.success);
        const liveRemoteLinks = fullResults.filter(result => result.success);

        console.log(`Checked ${fullResults.length} remote links.  Live: ${liveRemoteLinks.length}, Dead: ${deadRemoteLinks.length}`);

        if (deadRemoteLinks.length > 0) {
            const message = ['Dead remote links found:\n'];
            const deadLinksByFile = deadRemoteLinks.reduce((acc, link) => {
                if (!acc[link.filePath]) {
                    acc[link.filePath] = [];
                }
                acc[link.filePath].push(link);
                return acc;
            }, {});

            Object.entries(deadLinksByFile).sort((a, b) => a[0].localeCompare(b[0])).forEach(([filePath, links]) => {
                message.push('');
                message.push(`File: ${filePath}`);
                links.forEach(link => {
                    message.push(`  - ${link.href} (${link.status})`);
                });
            });

            const msg = message.join('\n');
            throw new Error(msg);
        }
    }, 300000); // Allow up to 5 minutes for all fetches
});
