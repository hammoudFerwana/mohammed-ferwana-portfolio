import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['src', 'public'];
const TEXT_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.css',
  '.md',
  '.json',
  '.txt',
  '.svg',
  '.html',
]);

const BANNED_RULES = [
  { label: 'Qusay', regex: /\bQusay\b/gi },
  { label: 'Rihan', regex: /\bRihan\b/gi },
  { label: 'Amassi', regex: /\bAmassi\b/gi },
  { label: 'Enterprise', regex: /\bEnterprise\b/gi },
  { label: 'enterprise-grade', regex: /\benterprise-grade\b/gi },
  { label: 'microservices', regex: /\bmicroservices\b/gi },
  { label: 'distributed system', regex: /\bdistributed system\b/gi },
  { label: 'Senior', regex: /\bSenior\b/gi },
  { label: 'consulting', regex: /\bconsulting\b/gi },
  { label: 'Hybrid', regex: /\bHybrid\b/gi },
  { label: 'portfolio.local', regex: /portfolio\.local/gi },
  { label: '[VERCEL_URL]', regex: /\[VERCEL_URL\]/gi },
  { label: 'Redis', regex: /\bRedis\b/gi },
  { label: 'RabbitMQ', regex: /\bRabbitMQ\b/gi },
  { label: 'Kafka', regex: /\bKafka\b/gi },
  { label: 'TAQAT internship', regex: /\bTAQAT internship\b/gi },
  { label: 'May 2026 – Present', regex: /May 2026\s*[–-]\s*Present/gi },
  { label: 'ClaimSync', regex: /\bClaimSync\b/gi },
  { label: 'SprintX', regex: /\bSprintX\b/gi },
  { label: 'LEARNIFY', regex: /\bLEARNIFY\b/gi },
  { label: 'ARCH_KERNEL', regex: /\bARCH_KERNEL\b/gi },
];

function collectFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = ROOTS.flatMap((root) => collectFiles(root));
const violations = [];

for (const filePath of files) {
  const relPath = filePath.replace(/\\/g, '/');
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of BANNED_RULES) {
      rule.regex.lastIndex = 0;
      if (rule.regex.test(line)) {
        violations.push({
          file: relPath,
          line: index + 1,
          term: rule.label,
          text: line.trim(),
        });
      }
    }
  });
}

if (violations.length > 0) {
  console.error(`Fact check failed with ${violations.length} match(es):`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} [${v.term}] ${v.text}`);
  }
  process.exit(1);
}

console.log(`Fact check passed (${files.length} files scanned, 0 banned matches).`);
