// 商品說明來自後端 DB（後台富文字編輯器產生的受限 HTML），後端不保證乾淨，
// 所以前台渲染前一定要經過這裡。不依賴 DOM，node:test 與瀏覽器行為一致。
//
// 安全性來自「輸出一定是安全的」而不是「輸入解析得跟瀏覽器一模一樣」：
// 輸出只可能是無屬性的白名單標籤加上不含 `<` 的文字，瀏覽器再解析一次也不會長出其他東西。

const ALLOWED_TAGS = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'div']);
const VOID_TAGS = new Set(['br']);
// 只拆標籤會讓程式碼／樣式內容變成可見文字，所以這兩種要連內容一起刪。
const RAW_TEXT_TAGS = new Set(['script', 'style']);
// stripHtml 轉純文字時，這些標籤的邊界視為換行。
const LINE_BREAK_TAGS = new Set(['br', 'p', 'div', 'li', 'ul', 'ol']);

const TAG_NAME = /[a-zA-Z][^\s/>]*/y;
const RAW_TEXT_END_TAGS = {
  script: /<\/script(?=[\s/>])/gi,
  style: /<\/style(?=[\s/>])/gi
};
const WHITESPACE = /\s/;
const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&nbsp;': ' ',
  '&quot;': '"',
  '&#39;': "'"
};

function isAsciiLetter(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}

// 回傳標籤結尾 `>` 的位置；引號內的 `>` 不算結尾，找不到（未閉合）回傳 -1。
function findTagEnd(source, from) {
  let previous = '';
  let index = from;
  while (index < source.length) {
    const char = source[index];
    if (char === '>') return index;
    if ((char === '"' || char === "'") && previous === '=') {
      const close = source.indexOf(char, index + 1);
      if (close === -1) return -1;
      previous = char;
      index = close + 1;
      continue;
    }
    if (!WHITESPACE.test(char)) previous = char;
    index += 1;
  }
  return -1;
}

// 把 HTML 切成 text / open / close 三種 token。註解、script/style、未閉合的標籤到此就被丟掉，
// 其他標籤只留名稱（屬性一律不保留）。不是標籤開頭的 `<`（例如 `1 < 2`）當成文字。
function tokenize(input) {
  const source = input.replace(/\0/g, '');
  const tokens = [];
  let index = 0;

  while (index < source.length) {
    const lt = source.indexOf('<', index);
    if (lt === -1) {
      tokens.push({ type: 'text', value: source.slice(index) });
      break;
    }
    if (lt > index) tokens.push({ type: 'text', value: source.slice(index, lt) });

    if (source.startsWith('<!--', lt)) {
      const commentEnd = source.indexOf('-->', lt + 2);
      if (commentEnd === -1) break;
      index = commentEnd + 3;
      continue;
    }

    const next = source[lt + 1];
    const isClosing = next === '/';
    if (!isAsciiLetter(next) && !isClosing && next !== '!' && next !== '?') {
      tokens.push({ type: 'text', value: '<' });
      index = lt + 1;
      continue;
    }

    TAG_NAME.lastIndex = lt + (isClosing ? 2 : 1);
    const match = TAG_NAME.exec(source);
    // `<!DOCTYPE>`、`<?xml?>`、`</ x>` 這類瀏覽器當成「假註解」的語法，直接丟到下一個 `>`。
    if (!match) {
      const bogusEnd = source.indexOf('>', lt + 1);
      if (bogusEnd === -1) break;
      index = bogusEnd + 1;
      continue;
    }

    const tagEnd = findTagEnd(source, TAG_NAME.lastIndex);
    // 標籤沒有閉合：瀏覽器也會整段丟掉，這裡連同後面全部丟掉。
    if (tagEnd === -1) break;
    const name = match[0].toLowerCase();
    index = tagEnd + 1;

    if (isClosing) {
      tokens.push({ type: 'close', name });
      continue;
    }
    if (RAW_TEXT_TAGS.has(name)) {
      // 只認自己的結尾標籤（`<script>` 不會被 `</style>` 提早結束），找不到就丟掉剩下全部。
      const endPattern = RAW_TEXT_END_TAGS[name];
      endPattern.lastIndex = index;
      if (!endPattern.exec(source)) break;
      const endTagEnd = findTagEnd(source, endPattern.lastIndex);
      if (endTagEnd === -1) break;
      index = endTagEnd + 1;
      continue;
    }
    tokens.push({ type: 'open', name });
  }

  return tokens;
}

// 回傳可直接給 v-html 的安全 HTML：只留白名單標籤且全部去掉屬性，其餘標籤拆掉只留文字。
export function sanitizeHtml(value) {
  if (value === null || value === undefined) return '';

  const openTags = [];
  const openCounts = new Map();
  let output = '';

  for (const token of tokenize(String(value))) {
    if (token.type === 'text') {
      output += token.value.replace(/</g, '&lt;');
      continue;
    }
    if (!ALLOWED_TAGS.has(token.name)) continue;

    if (token.type === 'open') {
      output += `<${token.name}>`;
      if (!VOID_TAGS.has(token.name)) {
        openTags.push(token.name);
        openCounts.set(token.name, (openCounts.get(token.name) ?? 0) + 1);
      }
      continue;
    }

    // 只收合有對應開頭的結尾標籤，並補齊中間漏掉的，輸出才會是完整配對的結構。
    if (!(openCounts.get(token.name) > 0)) continue;
    while (openTags.length > 0) {
      const name = openTags.pop();
      openCounts.set(name, openCounts.get(name) - 1);
      output += `</${name}>`;
      if (name === token.name) break;
    }
  }

  while (openTags.length > 0) {
    output += `</${openTags.pop()}>`;
  }
  return output;
}

// 回傳純文字（給卡片摘要、判斷說明是否為空用），不可再丟進 v-html。
export function stripHtml(value) {
  if (value === null || value === undefined) return '';

  let text = '';
  for (const token of tokenize(String(value))) {
    if (token.type === 'text') {
      // 先收合空白再解碼，`&nbsp;` 解出的空白交給最後一道整理；實體只解一次（`&amp;lt;` 得到 `&lt;`）。
      text += token.value
        .replace(/\s+/g, ' ')
        .replace(/&(?:amp|lt|gt|nbsp|quot|#39);/g, (entity) => ENTITIES[entity]);
    } else if (LINE_BREAK_TAGS.has(token.name)) {
      text += '\n';
    }
  }

  return text
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}
