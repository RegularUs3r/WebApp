import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fail = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function readJson(rel) {
  try {
    return JSON.parse(read(rel));
  } catch (error) {
    fail.push(`${rel} is invalid JSON: ${error.message}`);
    return null;
  }
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function walk(dir) {
  const base = path.join(root, dir);
  if (!fs.existsSync(base)) return [];
  const out = [];
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) out.push(...walk(rel));
    else out.push(rel);
  }
  return out;
}

function resolveRel(fromRel, target) {
  return path.normalize(path.join(root, path.dirname(fromRel), target));
}

const skill = readJson('skill.json');
const sources = readJson('sources.json');
const outputSchema = readJson('output-schema.json');
const fingerprints = readJson('provider-fingerprints.json');

if (skill) {
  for (const rel of ['router.md', 'safety.md', 'output-schema.json', 'techniques/index.md', 'provider-fingerprints.json']) {
    if (!exists(rel)) fail.push(`missing required entrypoint: ${rel}`);
  }

  if (!skill.safety_posture?.authorized_testing_only) fail.push('missing authorized_testing_only safety posture');
  if (!skill.safety_posture?.no_automatic_resource_claiming) fail.push('missing no_automatic_resource_claiming safety posture');
  if (!skill.safety_posture?.no_automatic_real_user_traffic_interception) fail.push('missing no_automatic_real_user_traffic_interception safety posture');
  if (!skill.retrieval_guidance?.avoid_loading_all_technique_cards) fail.push('must avoid loading all technique cards');
  const maxCards = Number(skill.retrieval_guidance?.max_technique_cards_per_assessment || 0);
  if (maxCards > 5 || maxCards < 1) fail.push('max_technique_cards_per_assessment must be between 1 and 5 for this specialist');

  const requiredSignalClasses = [
    'dangling_cname_signal',
    'dangling_ns_delegation_signal',
    'dangling_mx_signal',
    'non_claimable_provider_signal',
    'wildcard_dns_false_positive_signal',
    'claim_verification_signal'
  ];
  for (const signalClass of requiredSignalClasses) {
    if (!skill.signal_classes?.includes(signalClass)) fail.push(`missing signal class: ${signalClass}`);
  }

  const cards = skill.technique_cards || [];
  if (cards.length < 10) fail.push(`expected at least 10 technique cards, found ${cards.length}`);
  const slugs = new Set();
  for (const card of cards) {
    if (!card.slug || !card.title || !card.path) fail.push(`invalid technique card entry: ${JSON.stringify(card)}`);
    if (slugs.has(card.slug)) fail.push(`duplicate technique card slug: ${card.slug}`);
    slugs.add(card.slug);
    if (card.path && !exists(card.path)) fail.push(`missing technique card file: ${card.path}`);
  }
}

if (Array.isArray(sources)) {
  const ids = new Set();
  for (const source of sources) {
    if (!source.id || !source.title || !source.url) fail.push(`source missing id/title/url: ${JSON.stringify(source)}`);
    if (ids.has(source.id)) fail.push(`duplicate source id: ${source.id}`);
    ids.add(source.id);
  }
  if (ids.size < 20) fail.push(`expected at least 20 sources, found ${ids.size}`);
}

if (outputSchema) {
  for (const field of ['status', 'record_type', 'cname_chain', 'provider_classification', 'claimability', 'false_positive_controls', 'required_evidence', 'safe_next_step', 'manual_gate_required']) {
    if (!outputSchema.required_fields?.includes(field)) fail.push(`output schema missing required field: ${field}`);
  }
}

if (fingerprints) {
  const entries = fingerprints.entries || [];
  if (entries.length < 10) fail.push(`expected at least 10 provider-fingerprint entries, found ${entries.length}`);
  for (const entry of entries) {
    if (!entry.cname_pattern || !entry.provider || !entry.claimable) {
      fail.push(`invalid fingerprint entry: ${JSON.stringify(entry)}`);
    }
  }
}

const markdownFiles = ['README.md', 'router.md', 'safety.md', ...walk('techniques').filter((rel) => rel.endsWith('.md'))];

for (const rel of markdownFiles) {
  const text = read(rel);
  const h1Count = (text.match(/^# /gm) || []).length;
  if (h1Count !== 1) fail.push(`expected exactly one H1 in ${rel}, found ${h1Count}`);

  if (rel.startsWith('techniques/') && rel !== 'techniques/index.md') {
    for (const heading of ['## When To Consider', '## Evidence To Collect', '## False Positive Controls', '## Safe Validation Boundary', '## Output Requirements', '## Related Techniques']) {
      if (!text.includes(heading)) fail.push(`${rel} missing heading: ${heading}`);
    }
  }

  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  let match;
  while ((match = linkPattern.exec(text))) {
    const href = match[1];
    if (/^(https?:|mailto:|#)/i.test(href)) continue;
    const target = href.split('#')[0];
    if (!target) continue;
    if (!fs.existsSync(resolveRel(rel, target))) fail.push(`broken local link in ${rel}: ${href}`);
  }
}

const requiredCards = [
  'techniques/cname-fundamentals-and-triage.md',
  'techniques/non-claimable-provider-patterns.md',
  'techniques/wildcard-and-parking-false-positives.md',
  'techniques/ns-delegation-takeover.md',
  'techniques/claim-verification-and-safe-poc.md',
  'techniques/impact-proof-and-reporting.md'
];
for (const rel of requiredCards) {
  if (!exists(rel)) fail.push(`missing required card: ${rel}`);
}

if (fail.length) {
  console.error('Validation failed:');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  technique_cards: (skill?.technique_cards || []).length,
  sources: Array.isArray(sources) ? sources.length : 0,
  fingerprint_entries: (fingerprints?.entries || []).length
}, null, 2));
