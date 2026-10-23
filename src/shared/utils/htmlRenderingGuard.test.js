import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

// 防線：後端的商品說明是受限 HTML，但後端不保證乾淨。任何把字串當 HTML 渲染的寫法
// （v-html / innerHTML / outerHTML / insertAdjacentHTML）都有 XSS 風險，所以整個前台只允許一個地方使用，
// 而且它綁定的值必須由 sanitizeHtml(...) 算出來。要新增合法用途時，連同 html.test.js 的案例一起更新這裡的白名單。
const SRC_DIR = fileURLToPath(new URL('../../', import.meta.url));
const ALLOWED_FILE = 'modules/product/components/ProductAddDialog.vue';
const RAW_HTML_SINKS = ['v-html', 'innerHTML', 'outerHTML', 'insertAdjacentHTML'];

function listSourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listSourceFiles(fullPath);
    if (!/\.(vue|js)$/.test(entry.name) || entry.name.endsWith('.test.js')) return [];
    return [fullPath];
  });
}

// 註解裡提到 v-html 不算使用，先把 HTML / 區塊 / 行註解拿掉再掃（保留 `://` 之類的網址）。
function stripComments(source) {
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const files = listSourceFiles(SRC_DIR).map((fullPath) => ({
  relativePath: path.relative(SRC_DIR, fullPath).split(path.sep).join('/'),
  source: stripComments(fs.readFileSync(fullPath, 'utf8'))
}));

test('the scan covers the real source tree (so the guard cannot pass vacuously)', () => {
  assert.equal(files.length > 50, true);
  assert.equal(files.some((file) => file.relativePath === ALLOWED_FILE), true);
});

test('raw HTML rendering (v-html, innerHTML, outerHTML, insertAdjacentHTML) only appears in ProductAddDialog.vue', () => {
  const offenders = files
    .filter((file) => file.relativePath !== ALLOWED_FILE)
    .filter((file) => RAW_HTML_SINKS.some((sink) => file.source.includes(sink)))
    .map((file) => file.relativePath);

  assert.deepEqual(offenders, []);
});

test('the only v-html binding renders a value computed by sanitizeHtml', () => {
  const { source } = files.find((file) => file.relativePath === ALLOWED_FILE);
  const bindings = [...source.matchAll(/v-html="([^"]+)"/g)].map((match) => match[1].trim());

  assert.equal(bindings.length, 1);

  const bindingName = bindings[0];
  assert.match(bindingName, /^[A-Za-z_$][\w$]*$/);
  assert.match(
    source,
    new RegExp(`const\\s+${bindingName}\\s*=\\s*computed\\(\\s*\\(\\)\\s*=>\\s*sanitizeHtml\\(`)
  );
  assert.match(source, /import\s*\{[^}]*\bsanitizeHtml\b[^}]*\}\s*from\s*'@\/shared\/utils\/html\.js'/);
});
