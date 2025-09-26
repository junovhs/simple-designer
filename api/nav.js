// Runtime module manifest: Scans /pages/ for index.html, outputs JSON
export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    
    const fs = require('fs').promises;
    const path = require('path');
    const pagesDir = path.join(process.cwd(), 'pages');
    
    async function scanDir(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const cats = [];
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && entry.name.startsWith('cat.')) {
                const subEntries = await fs.readdir(fullPath, { withFileTypes: true });
                const modules = [];
                for (const sub of subEntries) {
                    if (sub.isDirectory()) {
                        const indexPath = path.join(fullPath, sub.name, 'index.html');
                        try {
                            await fs.access(indexPath);
                            // Parse module meta from comment in index.html (e.g., <!-- module: {id: 'foo', slots: ['#bar'], hooks: ['onLoad']} -->)
                            const html = await fs.readFile(indexPath, 'utf8');
                            const metaMatch = html.match(/<!--\s*module:\s*({[\s\S]*?})\s*-->/);
                            const meta = metaMatch ? JSON.parse(metaMatch[1]) : { id: sub.name, slots: [], hooks: [] };
                            modules.push({ ...meta, path: `/pages/${entry.name}/${sub.name}/index.html` });
                        } catch {}
                    }
                }
                if (modules.length) cats.push({ name: entry.name.replace('cat.', ''), modules });
            }
        }
        return { cats };
    }
    
    const manifest = await scanDir(pagesDir);
    res.status(200).json(manifest);
}