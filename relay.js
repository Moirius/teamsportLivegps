// relay.js — Relais JSON entre le browser régie et vMix Data Source
// Usage : node relay.js
// vMix  : Data Source → Web URL → http://localhost:8765/
//
// L'app browser envoie POST http://localhost:8765/ avec { km_restants, done_km, total_km, pct }
// vMix interroge GET http://localhost:8765/ et reçoit le même JSON.

const http = require('http');

const PORT = 8765;
let data = { km_restants: '--', done_km: '--', total_km: '--', pct: '--', updated: null };

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        Object.assign(data, JSON.parse(body), { updated: new Date().toISOString() });
        console.log(`[${new Date().toLocaleTimeString()}] km_restants=${data.km_restants} pct=${data.pct}%`);
        res.writeHead(200); res.end('ok');
      } catch {
        res.writeHead(400); res.end('json invalide');
      }
    });
    return;
  }

  // GET → JSON pour vMix
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));

}).listen(PORT, '127.0.0.1', () => {
  console.log(`Relais GPX prêt → http://localhost:${PORT}/`);
  console.log('vMix : Data Source → Web URL → http://localhost:8765/');
  console.log('Champs : km_restants, done_km, total_km, pct');
});
