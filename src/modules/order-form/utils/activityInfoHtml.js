import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['div', 'p', 'br', 'span', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a'];
const ALLOWED_ATTR = ['href', 'target', 'rel'];
const FORBIDDEN_TAGS = ['style', 'script', 'iframe', 'object', 'embed', 'img'];
const SAFE_PROTOCOLS = new Set(['http:', 'https:']);
const BARE_URL_PATTERN = /https?:\/\/[^\s<]+/gi;

let hooksConfigured = false;

function isSafeHttpUrl(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return false;
  }

  try {
    const parsedUrl = new URL(normalizedValue);
    return SAFE_PROTOCOLS.has(parsedUrl.protocol);
  } catch {
    return false;
  }
}

function configureSanitizerHooks() {
  if (hooksConfigured) {
    return;
  }

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.nodeName !== 'A') {
      return;
    }

    const href = node.getAttribute('href');

    if (!isSafeHttpUrl(href)) {
      node.removeAttribute('href');
      node.removeAttribute('target');
      node.removeAttribute('rel');
      return;
    }

    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  });

  hooksConfigured = true;
}

function createLinkedFragment(textContent) {
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;

  BARE_URL_PATTERN.lastIndex = 0;

  for (const match of textContent.matchAll(BARE_URL_PATTERN)) {
    const [url] = match;
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      fragment.append(document.createTextNode(textContent.slice(lastIndex, matchIndex)));
    }

    if (isSafeHttpUrl(url)) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = url;
      fragment.append(link);
    } else {
      fragment.append(document.createTextNode(url));
    }

    lastIndex = matchIndex + url.length;
  }

  if (lastIndex < textContent.length) {
    fragment.append(document.createTextNode(textContent.slice(lastIndex)));
  }

  return fragment;
}

function linkifyBareUrls(sanitizedHtml) {
  const parser = new DOMParser();
  const documentFragment = parser.parseFromString(`<body>${sanitizedHtml}</body>`, 'text/html').body;
  const textNodes = [];
  const walker = document.createTreeWalker(documentFragment, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((textNode) => {
    if (!textNode.textContent || !BARE_URL_PATTERN.test(textNode.textContent)) {
      BARE_URL_PATTERN.lastIndex = 0;
      return;
    }

    BARE_URL_PATTERN.lastIndex = 0;

    if (textNode.parentElement?.closest('a')) {
      return;
    }

    textNode.replaceWith(createLinkedFragment(textNode.textContent));
  });

  return documentFragment.innerHTML;
}

export function formatActivityInfoHtml(rawValue) {
  if (rawValue == null) {
    return '';
  }

  const normalizedValue = String(rawValue).trim();

  if (!normalizedValue) {
    return '';
  }

  configureSanitizerHooks();

  const sanitizedHtml = DOMPurify.sanitize(normalizedValue, {
    ALLOWED_TAGS: ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTR,
    FORBID_TAGS: FORBIDDEN_TAGS,
    FORBID_ATTR: ['style']
  }).trim();

  if (!sanitizedHtml) {
    return '';
  }

  return linkifyBareUrls(sanitizedHtml);
}
