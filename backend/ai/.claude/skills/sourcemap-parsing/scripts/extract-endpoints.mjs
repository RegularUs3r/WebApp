#!/usr/bin/env node
/*
 * extract-endpoints.mjs - heuristic API-endpoint extractor for JavaScript source maps.
 *
 * Input : one or more .js.map files, directories of them, or http(s) URLs to a .map (or .js
 *         whose sourceMappingURL will be followed).
 * Output: deduplicated lines in the form  METHOD {host/api}/PATH
 *         with {host/api} replaced by the resolved host when known, else kept literal.
 *
 * SAFETY: this script is read/parse only. It fetches the given .js/.map resources (which a
 * browser already loads) and parses them locally. It sends NO request to any endpoint it
 * discovers. Confirming an endpoint live is a manual-gated step (see ../safety.md).
 *
 * Usage:
 *   node extract-endpoints.mjs app.js.map
 *   node extract-endpoints.mjs https://t/static/js/main.js.map --base https://api.t.com
 *   node extract-endpoints.mjs ./maps/ --host VITE_API_URL=https://api.t.com --json
 *   node extract-endpoints.mjs app.js.map --include-third-party
 *
 * Flags:
 *   --base <url>          Base URL to apply to relative paths when none is found in source.
 *   --host NAME=<url>     Resolve a named placeholder (env var / base const) to a host. Repeatable.
 *   --include-third-party Keep analytics/CDN/vendor endpoints (dropped by default).
 *   --json               Emit structured JSON instead of plain METHOD {host/api}/PATH lines.
 */

import fs from 'node:fs';
import path from 'node:path';

const PLACEHOLDER = '{host/api}';

const THIRD_PARTY = [
  'google-analytics.com', 'googletagmanager.com', 'doubleclick.net', 'gstatic.com',
  'googleapis.com', 'sentry.io', 'ingest.sentry.io', 'segment.com', 'segment.io',
  'intercom.io', 'intercomcdn.com', 'stripe.com', 'facebook.com', 'facebook.net',
  'hotjar.com', 'hotjar.io', 'cloudflareinsights.com', 'cloudflare.com', 'jsdelivr.net',
  'unpkg.com', 'cdnjs.cloudflare.com', 'fontawesome.com', 'fonts.googleapis.com',
  'bootstrapcdn.com', 'newrelic.com', 'nr-data.net', 'datadoghq.com', 'amplitude.com',
  'mixpanel.com', 'fullstory.com', 'optimizely.com', 'launchdarkly.com', 'bugsnag.com'
];

const EXAMPLE_HOSTS = ['example.com', 'example.org', 'localhost', '127.0.0.1', '0.0.0.0', 'api.example'];

function parseArgs(argv) {
  const o = { inputs: [], base: null, hostMap: {}, includeThirdParty: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') o.json = true;
    else if (a === '--include-third-party') o.includeThirdParty = true;
    else if (a === '--base') o.base = argv[++i];
    else if (a === '--host') {
      const kv = argv[++i] || '';
      const eq = kv.indexOf('=');
      if (eq > 0) o.hostMap[kv.slice(0, eq)] = kv.slice(eq + 1);
    } else if (a === '-h' || a === '--help') { o.help = true; }
    else o.inputs.push(a);
  }
  return o;
}

function help() {
  console.log([
    'extract-endpoints.mjs - heuristic API-endpoint extractor for JS source maps',
    '',
    'Usage:',
    '  node extract-endpoints.mjs <file.js.map | dir | http(s)-url> [...] [flags]',
    '',
    'Flags:',
    '  --base <url>           Base URL for relative paths when none is found in source',
    '  --host NAME=<url>      Resolve a named env/base placeholder to a host (repeatable)',
    '  --include-third-party  Keep analytics/CDN/vendor endpoints (dropped by default)',
    '  --json                 Emit structured JSON instead of METHOD {host/api}/PATH lines',
    '',
    'Output lines:  METHOD {host/api}/PATH   ({host/api} replaced when resolved)',
    'Safety: parse/read only - sends NO request to any discovered endpoint.'
  ].join('\n'));
}

async function loadMapText(input) {
  if (/^https?:\/\//i.test(input)) {
    const res = await fetch(input);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${input}`);
    let text = await res.text();
    // If this was a .js (not a map), follow its sourceMappingURL.
    if (!input.endsWith('.map') && !looksLikeMap(text)) {
      const m = text.match(/[#@]\s*sourceMappingURL=([^\s'"]+)/);
      if (!m) throw new Error(`no sourceMappingURL in ${input}`);
      const ref = m[1];
      if (ref.startsWith('data:')) return decodeDataMap(ref);
      const mapUrl = new URL(ref, input).toString();
      const r2 = await fetch(mapUrl);
      if (!r2.ok) throw new Error(`HTTP ${r2.status} for ${mapUrl}`);
      return await r2.text();
    }
    return text;
  }
  return fs.readFileSync(input, 'utf8');
}

function decodeDataMap(dataUri) {
  const b64 = dataUri.split(',')[1] || '';
  return Buffer.from(b64, 'base64').toString('utf8');
}

function looksLikeMap(text) {
  const t = text.slice(0, 200);
  return t.includes('"version"') && (t.includes('"mappings"') || t.includes('"sources"'));
}

function collectInputs(inputs) {
  const out = [];
  for (const inp of inputs) {
    if (/^https?:\/\//i.test(inp)) { out.push(inp); continue; }
    let st;
    try { st = fs.statSync(inp); } catch { console.error(`skip (not found): ${inp}`); continue; }
    if (st.isDirectory()) {
      for (const f of fs.readdirSync(inp)) if (f.endsWith('.map')) out.push(path.join(inp, f));
    } else out.push(inp);
  }
  return out;
}

function getSources(mapText) {
  let map;
  try { map = JSON.parse(mapText); } catch { return { contents: [], hasContent: false }; }
  const sources = Array.isArray(map.sources) ? map.sources : [];
  const contents = Array.isArray(map.sourcesContent) ? map.sourcesContent : [];
  const out = [];
  for (let i = 0; i < Math.max(sources.length, contents.length); i++) {
    const name = sources[i] || `source-${i}`;
    const code = contents[i];
    if (typeof code === 'string' && code.length) out.push({ name, code });
  }
  return { contents: out, hasContent: out.length > 0 };
}

function isFirstParty(sourceName) {
  return !/node_modules|webpack\/bootstrap|webpack\/runtime|\/polyfills|\.pnpm\//.test(sourceName);
}

const METHODS = 'get|post|put|delete|patch|head|options';

// Returns array of { method, rawUrl }
function scanCode(code) {
  const hits = [];
  const push = (method, rawUrl) => {
    if (rawUrl && looksLikeEndpoint(rawUrl)) hits.push({ method: method.toUpperCase(), rawUrl });
  };

  // axios / instance / http.<verb>(url ...) ; Angular this.http.<verb>(url)
  const verbCall = new RegExp(`\\.(?:${METHODS})\\s*(?:<[^>]*>)?\\s*\\(\\s*([\`'"])((?:\\\\.|(?!\\1).)*)\\1`, 'gi');
  for (const m of code.matchAll(verbCall)) {
    const method = m[0].slice(1, m[0].indexOf('(')).replace(/<.*$/, '').trim();
    push(method, m[2]);
  }

  // fetch(url, { method }) or fetch(url)
  const fetchCall = /\bfetch\s*\(\s*([`'"])((?:\\.|(?!\1).)*)\1\s*(?:,\s*(\{[\s\S]{0,200}?\}))?/gi;
  for (const m of code.matchAll(fetchCall)) {
    let method = 'GET';
    if (m[3]) { const mm = m[3].match(/method\s*:\s*['"`]([A-Za-z]+)['"`]/); if (mm) method = mm[1]; }
    push(method, m[2]);
  }

  // XMLHttpRequest .open('METHOD', 'url')
  const xhr = /\.open\s*\(\s*['"`]([A-Za-z]+)['"`]\s*,\s*([`'"])((?:\\.|(?!\2).)*)\2/gi;
  for (const m of code.matchAll(xhr)) push(m[1], m[3]);

  // jQuery $.get/$.post(url
  const jq = /\$\.(get|post)\s*\(\s*([`'"])((?:\\.|(?!\2).)*)\2/gi;
  for (const m of code.matchAll(jq)) push(m[1], m[3]);

  // Bare path/URL string literals with an API-ish shape, verb unknown => ANY
  const bare = /([`'"])((?:https?:\/\/[^`'"\s]+|\/(?:api|rest|graphql|v\d|auth|users?|account|admin|orders?|payments?|internal)[^`'"\s]*))\1/gi;
  for (const m of code.matchAll(bare)) push('ANY', m[2]);

  return hits;
}

function looksLikeEndpoint(u) {
  if (!u) return false;
  if (/^https?:\/\//i.test(u)) return true;
  if (u.startsWith('/') && u.length > 1 && !/\.(js|css|png|jpe?g|gif|svg|woff2?|ttf|ico|map|json|html?)$/i.test(u)) return true;
  if (u.includes('/') && (u.includes('api') || u.includes('${') || /\/v\d/.test(u))) return true;
  return false;
}

// Collect base-URL candidates from a code string.
function scanBases(code, hostMap) {
  const bases = [];
  const add = (v) => { if (v && /^https?:\/\//i.test(v)) bases.push(v.replace(/\/+$/, '')); };

  // Only explicit base definitions are treated as bases. A generic "any absolute URL
  // containing 'api'" rule would wrongly swallow real call URLs into the base set.
  for (const m of code.matchAll(/\b(?:baseURL|baseUrl|basePath|apiUrl|apiBase|API_BASE|API_URL|BASE_URL|API_ENDPOINT|uri|prefixUrl)\s*[:=]\s*['"`]([^'"`]+)['"`]/g)) add(m[1]);

  // Named placeholders resolved via --host NAME=url
  for (const [name, url] of Object.entries(hostMap)) {
    if (code.includes(name)) add(url);
  }
  return bases;
}

function normalizePath(p) {
  // strip query/hash
  p = p.replace(/[?#].*$/, '');
  // ${expr} -> {lastIdentifier}
  p = p.replace(/\$\{[^}]*?([A-Za-z_$][\w$]*)\s*\}/g, '{$1}');
  p = p.replace(/\$\{[^}]*\}/g, '{var}');
  // ":param" style (express-like) kept as {param}
  p = p.replace(/\/:([A-Za-z_$][\w$]*)/g, '/{$1}');
  // trailing concat residue like  /users/" + id  -> /users/{id}
  p = p.replace(/\/["'`]\s*\+\s*([A-Za-z_$][\w$.]*)\s*$/,(_, v) => '/{' + v.split('.').pop() + '}');
  p = p.replace(/["'`]\s*\+.*$/, '');
  if (!p.startsWith('/') && !/^https?:\/\//i.test(p)) p = '/' + p;
  return p.replace(/\/{2,}/g, '/').replace(/\/$/,'') || '/';
}

function splitHostPath(rawUrl, bases, globalBase) {
  if (/^https?:\/\//i.test(rawUrl)) {
    try { const u = new URL(rawUrl); return { host: u.origin, path: normalizePath(u.pathname + u.search) }; }
    catch { return { host: PLACEHOLDER, path: normalizePath(rawUrl) }; }
  }
  const host = bases[0] || globalBase || PLACEHOLDER;
  return { host, path: normalizePath(rawUrl) };
}

function hostIsThirdParty(host) {
  if (host === PLACEHOLDER) return false;
  let h; try { h = new URL(host).hostname; } catch { return false; }
  return THIRD_PARTY.some((d) => h === d || h.endsWith('.' + d));
}
function hostIsExample(host) {
  if (host === PLACEHOLDER) return false;
  let h; try { h = new URL(host).hostname; } catch { return false; }
  return EXAMPLE_HOSTS.some((d) => h === d || h.endsWith('.' + d));
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || opts.inputs.length === 0) { help(); process.exit(opts.help ? 0 : 1); }

  const files = collectInputs(opts.inputs);
  const endpoints = new Map(); // key -> {method, host, path, sources:Set}
  const basesGlobal = [];
  const mapReport = [];

  for (const f of files) {
    let text;
    try { text = await loadMapText(f); } catch (e) { mapReport.push({ map: f, reachable: false, error: String(e.message || e) }); continue; }
    const { contents, hasContent } = getSources(text);
    mapReport.push({ map: f, reachable: true, hasSourcesContent: hasContent, sources: contents.length });
    for (const { name, code } of contents) {
      if (!isFirstParty(name)) continue;
      for (const b of scanBases(code, opts.hostMap)) if (!basesGlobal.includes(b)) basesGlobal.push(b);
    }
    for (const { name, code } of contents) {
      if (!isFirstParty(name)) continue;
      const localBases = scanBases(code, opts.hostMap);
      const bases = localBases.length ? localBases : basesGlobal;
      for (const { method, rawUrl } of scanCode(code)) {
        const { host, path: p } = splitHostPath(rawUrl, bases, opts.base);
        if (!opts.includeThirdParty && (hostIsThirdParty(host) || hostIsExample(host))) continue;
        const key = `${method} ${host} ${p}`;
        if (!endpoints.has(key)) endpoints.set(key, { method, host, path: p, sources: new Set() });
        endpoints.get(key).sources.add(name);
      }
    }
  }

  // Post-process noise:
  //  - drop an ANY entry when the same host+path is already known with a real verb
  //  - drop an ANY entry that is just a resolved base URL (origin[+base path], no real route)
  //  - drop an ANY entry at a bare origin ('/')
  const concrete = new Set();
  for (const e of endpoints.values()) if (e.method !== 'ANY') concrete.add(e.host + '\u0000' + e.path);
  const baseKeys = new Set();
  for (const b of basesGlobal) {
    try { const u = new URL(b); baseKeys.add(u.origin + '\u0000' + normalizePath(u.pathname)); } catch { /* ignore */ }
  }
  for (const [key, e] of [...endpoints]) {
    if (e.method !== 'ANY') continue;
    const k = e.host + '\u0000' + e.path;
    if (concrete.has(k) || baseKeys.has(k) || e.path === '/') endpoints.delete(key);
  }

  const list = [...endpoints.values()].sort((a, b) =>
    (a.host + a.path + a.method).localeCompare(b.host + b.path + b.method));
  const unresolved = list.filter((e) => e.host === PLACEHOLDER).length;

  if (opts.json) {
    console.log(JSON.stringify({
      maps: mapReport,
      resolved_bases: basesGlobal,
      endpoint_count: list.length,
      unresolved_host_count: unresolved,
      endpoints: list.map((e) => ({ method: e.method, host: e.host, path: e.path, line: `${e.method} ${e.host}${e.path}`, sources: [...e.sources] }))
    }, null, 2));
  } else {
    const w = Math.max(3, ...list.map((e) => e.method.length));
    for (const e of list) console.log(`${e.method.padEnd(w)} ${e.host}${e.path}`);
    console.error(`\n# ${list.length} endpoints (${unresolved} with unresolved host). Bases: ${basesGlobal.join(', ') || 'none found'}`);
    console.error('# HEURISTIC output - verify against source. No requests were sent to any endpoint.');
  }
}

main().catch((e) => { console.error('fatal:', e.message || e); process.exit(1); });
