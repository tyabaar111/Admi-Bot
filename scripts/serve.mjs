import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { loadEnvFile } from 'node:process';
import { handleChat } from '../server/assistant.js';

try { loadEnvFile('.env.local'); } catch (error) { if (error.code !== 'ENOENT') throw error; }

const root = resolve(process.argv[2] || '.');
const port = Number(process.env.PORT || 5173);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.txt':'text/plain; charset=utf-8', '.json':'application/json' };
const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || `127.0.0.1:${port}`}`);
    if (requestUrl.pathname === '/api/chat') {
      let size = 0; const chunks = [];
      for await (const chunk of req) { size += chunk.length; if(size > 120000) { res.writeHead(413); res.end('Request too large'); return; } chunks.push(chunk); }
      const response = await handleChat(new Request(requestUrl,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method) ? {body:Buffer.concat(chunks)} : {})}));
      res.writeHead(response.status,Object.fromEntries(response.headers)); res.end(Buffer.from(await response.arrayBuffer())); return;
    }
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {Allow:'GET, HEAD'}); res.end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname !== '/' && pathname !== '/index.html' && !/^\/(?:src|data)\//.test(pathname)) { res.writeHead(404); res.end('Not found'); return; }
    if (pathname.includes('\0') || pathname.split(/[\\/]/).some(p => p.startsWith('.'))) { res.writeHead(403); res.end('Forbidden'); return; }
    let path = resolve(root, `.${pathname}`);
    if (path !== root && !path.startsWith(root + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const body = await readFile(path);
    res.writeHead(200, {'Content-Type':types[extname(path)] || 'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Admibot-AI is ready at http://localhost:${port}`));
